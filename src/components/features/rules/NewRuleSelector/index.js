import React, { useContext } from "react";
import { Row, Col, Button, Card, Popover } from "antd";
import { Modal } from "antd";
import { NavLink } from "react-router-dom";
//Config
import APP_CONSTANTS from "../../../../config/constants";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
// Extension Actions
import { isExtensionVersionCompatible } from "../../../../actions/ExtensionActions";
import { getAppMode, getUserAuthDetails } from "utils/GlobalStoreUtils";
import { store } from "../../../../store";
import { CrownTwoTone, RightOutlined } from "@ant-design/icons";
import { isRuleTypeEnabled } from "../../../../utils/FeatureManager";
import ExampleContent from "./Examples";

const { PATHS, RULE_TYPES_CONFIG } = APP_CONSTANTS;

const NewRuleSelector = (props) => {
  const globalState = useContext(store);
  const { state } = globalState;
  const appMode = getAppMode(state);
  const user = getUserAuthDetails(state);
  const userPlanName = user.details?.planDetails?.planName;

  const renderCrownIcon = (ruleType) => {
    if (!isRuleTypeEnabled(ruleType, user, userPlanName)) {
      return <CrownTwoTone twoToneColor={"limegreen"} />;
    }
    return null;
  };

  const renderExampleContent = (ruleType) => {
    return <ExampleContent ruleType={ruleType} />;
  };

  return (
    <Modal
      // className="modal-dialog-centered max-width-70-percent"
      visible={props.isOpen}
      onCancel={props.toggle}
      footer={null}
      title="Create New Rule"
      width={1000}
    >
      <div>
        <Row gutter={[16, 16]}>
          {Object.entries(RULE_TYPES_CONFIG).map(([key, RULE_CONFIG]) => {
            // To check extension version for delay rule compatibility
            // negative check
            if (
              !isExtensionVersionCompatible(
                APP_CONSTANTS.DELAY_COMPATIBILITY_VERSION
              ) &&
              appMode !== GLOBAL_CONSTANTS.APP_MODES.DESKTOP &&
              RULE_CONFIG.TYPE === GLOBAL_CONSTANTS.RULE_TYPES.DELAY
            )
              return null;

            return (
              <Col xs={24} sm={12} lg={8} key={RULE_CONFIG.ID}>
                <Popover
                  content={() => renderExampleContent(RULE_CONFIG.TYPE)}
                  // title={RULE_CONFIG.NAME}
                  title="Example Use Cases"
                  placement="rightBottom"
                >
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
                      <NavLink
                        to={`${PATHS.RULE_EDITOR.CREATE_RULE.ABSOLUTE}/${RULE_CONFIG.TYPE}`}
                      >
                        <Button type="primary" icon={<RightOutlined />}>
                          Create
                        </Button>
                      </NavLink>,
                    ]}
                  >
                    <Card.Meta
                      avatar={<>{React.createElement(RULE_CONFIG.ICON)}</>}
                      title={
                        <>
                          {RULE_CONFIG.NAME + " "}
                          {renderCrownIcon(RULE_CONFIG.TYPE)}
                        </>
                      }
                      description={RULE_CONFIG.DESCRIPTION}
                    />
                  </Card>
                </Popover>
              </Col>
            );
          })}
        </Row>
      </div>
    </Modal>
  );
};

export default NewRuleSelector;
