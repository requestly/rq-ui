import React, { useState, useContext, useCallback, useEffect } from "react";
import { Row, Col, Input, Button, Space } from "antd";
import { toast } from "utils/Toast.js";
import isEmpty from "is-empty";
//Sub Components
import SpinnerCard from "../../misc/SpinnerCard";
import ErrorCard from "../..//misc/ErrorCard";
//Utils
import { submitEventUtil, submitAttrUtil } from "../../../utils/AnalyticsUtils";
import { isPlanExpired } from "../../../utils/PremiumUtils";
import * as GlobalStoreUtils from "../../../utils/GlobalStoreUtils";
//Actions
import * as FirebaseActions from "../../../actions/FirebaseActions";
import * as ExtensionActions from "../../../actions/ExtensionActions";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import APP_CONSTANTS from "../../../config/constants";
//STORE
import { store } from "../../../store";
import ProCard from "@ant-design/pro-card";
import { CheckOutlined } from "@ant-design/icons";
import Jumbotron from "components/bootstrap-legacy/jumbotron";
import { isFeatureEnabled } from "../../../utils/FeatureManager";

const TRACKING = GLOBAL_CONSTANTS.GA_EVENTS;

const RemoteRulesSettings = () => {
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const user = GlobalStoreUtils.getUserAuthDetails(state);
  const appMode = GlobalStoreUtils.getAppMode(state);
  //Component State
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({});
  // const [planDetails, setPlanDetails] = useState({});
  const [planName, setPlanName] = useState("");
  const [endPoint, setEndPoint] = useState("");
  const [frequency, setFrequency] = useState(60);

  const fetchUserData = () => {
    if (user.loggedIn) {
      setUserProfile(user.details.profile);
      // setPlanDetails(userData.planDetails);
      setIsLoading(false);
      const planName =
        user.details.planDetails && user.details.planDetails.planName;
      const isExpired = isPlanExpired(user.details.planDetails);
      if (!isExpired) {
        setPlanName(planName);
      } else {
        setPlanName(APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE);
      }
    } else {
      setIsLoading(false);
    }
  };

  const stableFetchUserData = useCallback(fetchUserData, [user]);

  const fetchSettingsFromStorage = () => {
    ExtensionActions.getRemoteRulesSettings().then((obj) => {
      obj.endPoint && setEndPoint(obj.endPoint);
      obj.frequency && setFrequency(obj.frequency);
    });
  };

  const renderCardContent = () => {
    if (
      !isFeatureEnabled(APP_CONSTANTS.FEATURES.REMOTE_RULES, user, planName)
    ) {
      return (
        <Jumbotron
          style={{ background: "transparent" }}
          className="text-center"
        >
          <h3>Remote Rules feature is only available in Professional Plan.</h3>
        </Jumbotron>
      );
    }

    return renderRemoteRuleConfigurations();
  };

  const renderRemoteRuleConfigurations = () => {
    return (
      <React.Fragment>
        <Row>
          <Col span={10} offset={7}>
            <div className="card-body">
              <div className="card-text" style={{ padding: "1rem 10%" }}>
                <p className="m-0">
                  Define Server EndPoint from where app will periodically import
                  the rules
                </p>
                <div className=" mb-3">
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="https://myserver.com/rules/v1"
                    value={endPoint}
                    onChange={(e) => setEndPoint(e.target.value)}
                    addonBefore="Server Endpoint"
                  />
                </div>
                <br />
                <p className="m-0">
                  Frequency (in minutes) for importing rules from Server.
                  Minimum 2 & maximum 100 minutes.
                </p>
                <div className=" mb-3">
                  <Input
                    type="number"
                    min="2"
                    max="60"
                    className="form-control"
                    placeholder="20"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    addonBefore="Frequency"
                  />
                </div>
              </div>

              <div className="text-center">
                <Space>
                  <Button
                    type="primary"
                    className="btn btn-primary"
                    // style={{ marginRight: "1rem", padding: "0.75rem" }}
                    onClick={saveRemoteRuleConfig}
                    icon={<CheckOutlined />}
                  >
                    Save & Import Periodically
                  </Button>
                  <Button type="secondary" onClick={disableRemoteRuleConfig}>
                    Disable
                  </Button>
                </Space>
              </div>
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
  };

  const validate = () => {
    if (!endPoint || isEmpty(endPoint)) {
      toast.warn("Please enter a valid end point");
      return false;
    }

    if (!frequency || frequency < 2 || frequency > 100) {
      toast.warn(
        "Frequency must lie between 2 and 100. Please provide a valid value"
      );
      return false;
    }

    return true;
  };

  const saveRemoteRuleConfig = () => {
    if (!validate()) {
      return;
    }

    const remoteRulesSettings = {
      enabled: true,
      endPoint: endPoint,
      frequency: frequency,
    };

    ExtensionActions.setRemoteRulesSettings(remoteRulesSettings)
      .then((response) => {
        if (response.success) {
          FirebaseActions.updateValueAsPromise(
            ["settings", userProfile.uid, "remoteRules"],
            remoteRulesSettings
          ).then(() => {
            toast.success("Settings saved successfully!");

            submitEventUtil(
              TRACKING.CATEGORIES.REMOTE_RULES,
              TRACKING.ACTIONS.CREATED,
              "Remote Rules Settings Created"
            );
            submitAttrUtil(
              TRACKING.ATTR.REMOTE_RULES_ENDPOINT,
              remoteRulesSettings.endPoint
            );
            submitAttrUtil(
              TRACKING.ATTR.REMOTE_RULES_FREQUENCY,
              remoteRulesSettings.frequency
            );
          });
        } else {
          alert(
            "Unable to save settings in storage. Please reach out to support at contact@requestly.io"
          );
        }
      })
      .catch((err) => toast.error(err));
  };
  const disableRemoteRuleConfig = () => {
    const remoteRulesSettings = {
      enabled: false,
      endPoint: endPoint,
      frequency: frequency,
    };

    ExtensionActions.setRemoteRulesSettings(remoteRulesSettings)
      .then((response) => {
        if (response.success) {
          FirebaseActions.updateValueAsPromise(
            ["settings", userProfile.uid, "remoteRules"],
            remoteRulesSettings
          ).then(() => {
            toast.success("Disabled!");
            submitEventUtil(
              TRACKING.CATEGORIES.REMOTE_RULES,
              TRACKING.ACTIONS.DEACTIVATED,
              "Remote Rules Settings Deactivated"
            );
          });
        } else {
          alert(
            "Unable to save settings in storage. Please reach out to support at contact@requestly.io"
          );
        }
      })
      .catch((err) => toast.error(err));
  };

  useEffect(() => {
    if (appMode === GLOBAL_CONSTANTS.APP_MODES.DESKTOP) return;
    // Attach a listener to check firebase auth state
    stableFetchUserData();
    fetchSettingsFromStorage();
  }, [stableFetchUserData, appMode]);

  if (appMode === GLOBAL_CONSTANTS.APP_MODES.DESKTOP) {
    return (
      <ErrorCard customErrorMessage="Remote rules are available only in Requestly Chrome Extension as of now." />
    );
  }

  if (isLoading) {
    return <SpinnerCard customLoadingMessage="Loading Remote Rules" />;
  }

  return (
    <>
      {/* Page content */}
      <ProCard
        className="primary-card github-like-border"
        title="Remote Rules (Beta)"
      >
        {/* Table */}
        <Row>
          <Col span={24} align="center">
            {renderCardContent()}
          </Col>
        </Row>
      </ProCard>
    </>
  );
};

export default RemoteRulesSettings;
