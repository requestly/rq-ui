import React, { useContext, useState } from "react";
import { Row, Col, Button, Card } from "antd";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";
//Config
import APP_CONSTANTS from "../../../../../config/constants";
import { redirectToCreateNewFile } from "utils/RedirectionUtils";
import { checkIfLimitReached } from "utils/FeatureManager";
import { store } from "../../../../../store";
import { getUserAuthDetails } from "utils/GlobalStoreUtils";
import LimitReachedModal from "components/user/LimitReachedModal";

const { MOCK_TYPES_CONFIG } = APP_CONSTANTS;

const NewMockSelector = (props) => {
  const { currentMocksCount, isOpen, toggle } = props;
  // Navigate
  const navigate = useNavigate();
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const user = getUserAuthDetails(state);
  // Component State
  const [userPlanName, setUserPlanName] = useState("Free");
  const [isLimitReachedModalActive, setIsLimitReachedModalActive] = useState(
    false
  );

  const toggleLimitReachedModal = () => {
    setIsLimitReachedModalActive(isLimitReachedModalActive ? false : true);
  };

  // fetch planName from global state
  const planName =
    user.details?.planDetails?.planName ||
    APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE;

  const handleCreateOnClick = (mockType) => {
    const ifLimitReached = checkIfLimitReached(
      currentMocksCount,
      APP_CONSTANTS.FEATURES.FILES,
      user,
      planName
    );
    if (ifLimitReached) {
      setUserPlanName(planName);
      //Activate modal to notify user to upgrade
      setIsLimitReachedModalActive(true);
    } else {
      //Continue allowing
      redirectToCreateNewFile(navigate, mockType);
    }
  };

  return (
    <>
      <Modal
        // className="modal-dialog-centered max-width-70-percent"
        visible={isOpen}
        onCancel={toggle}
        footer={null}
        title="Create New Mock"
        width={800}
      >
        <div>
          <h3 style={{ textAlign: "center" }}>
            Confused about Mocks? refer{" "}
            <a
              href={APP_CONSTANTS.LINKS.REQUESTLY_DOCS_MOCK_SERVER}
              target="_blank"
              rel="noreferrer nofollow"
            >
              here
            </a>
          </h3>
          <Row gutter={[16, 16]}>
            {Object.entries(MOCK_TYPES_CONFIG).map(([key, MOCK_CONFIG]) => {
              // To check extension version for delay rule compatibility
              // negative check
              return (
                <Col xs={12} sm={8} lg={8} key={MOCK_CONFIG.ID}>
                  <Card
                    loading={false}
                    hoverable={true}
                    style={{
                      height: "100%",
                      display: "flex",
                      flexFlow: "column",
                      cursor: "default",
                    }}
                    size="small"
                    bodyStyle={{ flexGrow: "1" }}
                    actions={[
                      <Button
                        onClick={() => handleCreateOnClick(MOCK_CONFIG.TYPE)}
                        type="primary"
                      >
                        {" "}
                        Create{" "}
                      </Button>,
                    ]}
                  >
                    <Card.Meta
                      avatar={<>{React.createElement(MOCK_CONFIG.ICON)}</>}
                      title={MOCK_CONFIG.NAME}
                      description={MOCK_CONFIG.DESCRIPTION}
                    />
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      </Modal>
      {/* MODALS */}
      {isLimitReachedModalActive ? (
        <LimitReachedModal
          isOpen={isLimitReachedModalActive}
          toggle={toggleLimitReachedModal}
          featureName={APP_CONSTANTS.FEATURES.FILES}
          userPlanName={userPlanName}
        />
      ) : null}
    </>
  );
};

export default NewMockSelector;
