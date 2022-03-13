import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Button, Space, Divider } from "antd";
//Sub Components
import NewRuleSelector from "../NewRuleSelector";
import ImportRulesModal from "../ImportRulesModal";
// Constants
import APP_CONSTANTS from "../../../../config/constants";
import ProCard from "@ant-design/pro-card";
import { store } from "../../../../store";
import { getUserAuthDetails } from "utils/GlobalStoreUtils";
import { getToggleActiveModalActionObject } from "store/action-objects";
import Jumbotron from "components/bootstrap-legacy/jumbotron";
const { PATHS } = APP_CONSTANTS;

const { ACTION_LABELS: AUTH_ACTION_LABELS } = APP_CONSTANTS.AUTH;

const CreateRuleCTA = () => {
  //Global State
  const globalState = useContext(store);
  const { state, dispatch } = globalState;
  const user = getUserAuthDetails(state);
  //Component State
  const [showExistingRulesBanner, setShowExistingRulesBanner] = useState(false);
  const [
    isNewRuleSelectorModalActive,
    setIsNewRuleSelectorModalActive,
  ] = useState(false);
  const [isImportRulesModalActive, setIsImportRulesModalActive] = useState(
    false
  );

  const toggleNewRuleSelectorModal = () => {
    setIsNewRuleSelectorModalActive(
      isNewRuleSelectorModalActive ? false : true
    );
  };
  const toggleImportRulesModal = () => {
    setIsImportRulesModalActive(isImportRulesModalActive ? false : true);
  };

  const handleLoginOnClick = () => {
    dispatch(
      getToggleActiveModalActionObject("authModal", true, {
        redirectURL: window.location.href,
        authMode: AUTH_ACTION_LABELS.LOG_IN,
        src: APP_CONSTANTS.FEATURES.RULES,
      })
    );
  };

  useEffect(() => {
    if (user?.details?.isLoggedIn) setShowExistingRulesBanner(false);
    else setShowExistingRulesBanner(true);
  }, [user]);

  return (
    <React.Fragment>
      <ProCard className="primary-card github-like-border">
        <Row style={{ textAlign: "center" }} align="center">
          <Col span={24}>
            <Jumbotron
              style={{ background: "transparent" }}
              className="text-center"
            >
              <h1 className="display-3">Get Started with Rules</h1>
              <p className="lead">
                Create Rules that trigger certain actions whenever a request
                matches one of the URL patterns you define.
              </p>

              <Space>
                <Button
                  type="primary"
                  onClick={() => setIsNewRuleSelectorModalActive(true)}
                >
                  Create My First Rule
                </Button>
                <Button
                  color="secondary"
                  onClick={() => setIsImportRulesModalActive(true)}
                >
                  Upload Rules
                </Button>
              </Space>

              {showExistingRulesBanner ? (
                <p className="lead mt-5" style={{ marginTop: "1em" }}>
                  If you have existing Rules, consider{" "}
                  <Button
                    type="link"
                    onClick={handleLoginOnClick}
                    style={{ paddingLeft: "0", paddingRight: "0" }}
                  >
                    signing in
                  </Button>{" "}
                  to see them
                </p>
              ) : null}

              <Divider style={{ marginBottom: "1em", marginTop: "1em" }}>
                or
              </Divider>
              <p className="lead mt-5">
                Try example Rules from the{" "}
                <Link to={PATHS.RULES.TEMPLATES.ABSOLUTE}>
                  <strong>Templates</strong>
                </Link>
              </p>
            </Jumbotron>
          </Col>
        </Row>
      </ProCard>

      {isNewRuleSelectorModalActive ? (
        <NewRuleSelector
          isOpen={isNewRuleSelectorModalActive}
          toggle={toggleNewRuleSelectorModal}
        />
      ) : null}
      {isImportRulesModalActive ? (
        <ImportRulesModal
          isOpen={isImportRulesModalActive}
          toggle={toggleImportRulesModal}
        />
      ) : null}
    </React.Fragment>
  );
};

export default CreateRuleCTA;
