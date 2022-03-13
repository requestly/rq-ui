import React, { useContext, useEffect, useState } from "react";
import { Row } from "antd";
import Split from "react-split";
import RuleBuilder from "../../../../components/features/rules/RuleBuilder";
import ProCard from "@ant-design/pro-card";
import { isExtensionInstalled } from "actions/ExtensionActions";
import InstallExtensionCTA from "components/misc/InstallExtensionCTA";
import { store } from "store";
import {
  getAllRules,
  getAppMode,
  getIfTrialModeEnabled,
  getUserAuthDetails,
} from "utils/GlobalStoreUtils";
import { checkIfLimitReached, isFeatureEnabled } from "utils/FeatureManager";
import APP_CONSTANTS from "config/constants";
import UpgradeCTA from "components/misc/UpgradeCTA";
import LoginCTA from "components/misc/LoginCTA";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import { getModeData } from "components/features/rules/RuleBuilder/actions";
import { StorageService } from "init";
import ExtensionDeactivationMessage from "components/misc/ExtensionDeactivationMessage";
import RuleEditorSplitPane from "../../../../components/features/rules/RuleEditorSplitPane";

const GUTTER_SIZE = 20;

const RuleEditor = (props) => {
  //Constants
  const { MODE, RULE_TYPE_TO_CREATE } = getModeData(props.location, null);
  // Component State
  const [isExtensionEnabled, setIsExtensionEnabled] = useState(true);
  const [rulePaneSizes, setRulePaneSizes] = useState([90, 10]);
  const [gutterSize, setGutterSize] = useState(GUTTER_SIZE);

  const { location } = props;
  const isInEditMode = location.pathname
    .split("/rules/editor")[1]
    ?.startsWith("/edit");
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const allRules = getAllRules(state);
  const user = getUserAuthDetails(state);
  const appMode = getAppMode(state);
  const isTrialModeEnabled = getIfTrialModeEnabled(state);

  // fetch planName from global state
  const planName =
    user.details?.planDetails?.planName ||
    APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE;

  useEffect(() => {
    if (appMode === GLOBAL_CONSTANTS.APP_MODES.EXTENSION) {
      StorageService(appMode)
        .getRecord(APP_CONSTANTS.RQ_SETTINGS)
        .then((value) => {
          if (value) {
            setIsExtensionEnabled(value.isExtensionEnabled);
          } else {
            setIsExtensionEnabled(true);
          }
        });
    }
  }, [appMode]);

  const expandRulePane = () => {
    setRulePaneSizes([30, 70]);

    setGutterSize(
      gutterSize === GUTTER_SIZE ? GUTTER_SIZE + 0.000000001 : GUTTER_SIZE
    );
  };

  const collapseRulesPlane = () => {
    setRulePaneSizes([90, 10]);

    setGutterSize(
      gutterSize === GUTTER_SIZE ? GUTTER_SIZE + 0.000000001 : GUTTER_SIZE
    );
  };

  // Check if plan limit reached
  const ifPlanRulesLimitReached = checkIfLimitReached(
    allRules.length,
    APP_CONSTANTS.FEATURES.RULES,
    user,
    planName
  );

  const showEditor =
    (!user.loggedIn &&
      !isTrialModeEnabled &&
      allRules.length < APP_CONSTANTS.NO_LOGIN_RULES_LIMIT) ||
    (user.loggedIn && !ifPlanRulesLimitReached) ||
    isInEditMode;

  const showExecutionLogs = isFeatureEnabled(
    APP_CONSTANTS.FEATURES.EXECUTION_LOGS,
    user,
    planName
  );

  const renderRuleEditor = () => {
    if (appMode && appMode === GLOBAL_CONSTANTS.APP_MODES.EXTENSION) {
      // PATCH
      // Sometimes RULE_TYPE_TO_CREATE contains the rule id.
      // For time being, split the string to extract Rule Type. Ex: Redirect_ke4mv -> Redirect
      const CURRENT_RULE_TYPE = RULE_TYPE_TO_CREATE.split("_")[0];

      switch (CURRENT_RULE_TYPE) {
        case GLOBAL_CONSTANTS.RULE_TYPES.REDIRECT:
        case GLOBAL_CONSTANTS.RULE_TYPES.REPLACE:
        case GLOBAL_CONSTANTS.RULE_TYPES.QUERYPARAM:
        case GLOBAL_CONSTANTS.RULE_TYPES.CANCEL:
        case GLOBAL_CONSTANTS.RULE_TYPES.HEADERS:
          return (
            <>
              <Split
                sizes={rulePaneSizes}
                minSize={75}
                gutterSize={gutterSize}
                dragInterval={20}
                direction="vertical"
                cursor="row-resize"
                style={{
                  height: "88vh",
                }}
              >
                <Row className="gap-case-1" style={{ overflow: "auto" }}>
                  <ProCard
                    className="primary-card github-like-border"
                    style={{
                      boxShadow: "none",
                      borderBottom: "2px solid #f5f5f5",
                      borderRadius: "0",
                    }}
                  >
                    <RuleBuilder location={location} />
                  </ProCard>
                </Row>
                <Row style={{ overflow: "hidden", height: "100%" }}>
                  <ProCard
                    className="primary-card github-like-border"
                    style={{
                      boxShadow: "none",
                      borderRadius: "0",
                      borderTop: "2px solid #f5f5f5",
                    }}
                    bodyStyle={{ padding: "0px 20px" }}
                  >
                    <RuleEditorSplitPane
                      mode={MODE}
                      showExecutionLogs={showExecutionLogs}
                      expandRulePane={expandRulePane}
                      collapseRulesPlane={collapseRulesPlane}
                    />
                  </ProCard>
                </Row>
              </Split>
            </>
          );
        case GLOBAL_CONSTANTS.RULE_TYPES.RESPONSE:
        case GLOBAL_CONSTANTS.RULE_TYPES.DELAY:
        case GLOBAL_CONSTANTS.RULE_TYPES.USERAGENT:
        case GLOBAL_CONSTANTS.RULE_TYPES.SCRIPT:
          return (
            <>
              <Split
                sizes={rulePaneSizes}
                minSize={75}
                gutterSize={gutterSize}
                dragInterval={20}
                direction="vertical"
                cursor="row-resize"
                style={{
                  height: "88vh",
                }}
              >
                <Row
                  className="gap-case-2"
                  style={{ width: "100%", overflow: "auto" }}
                >
                  <ProCard
                    className="primary-card github-like-border"
                    style={{
                      boxShadow: "none",
                      borderBottom: "2px solid #f5f5f5",
                      borderRadius: "0",
                    }}
                  >
                    <RuleBuilder location={location} />
                  </ProCard>
                </Row>
                <Row style={{ overflow: "hidden", height: "100%" }}>
                  <ProCard
                    className="primary-card github-like-border"
                    style={{
                      boxShadow: "none",
                      borderRadius: "0",
                      borderTop: "2px solid #f5f5f5",
                    }}
                    bodyStyle={{ padding: "0px 20px" }}
                  >
                    <RuleEditorSplitPane
                      mode={MODE}
                      showExecutionLogs={showExecutionLogs}
                      expandRulePane={expandRulePane}
                      collapseRulesPlane={collapseRulesPlane}
                    />
                  </ProCard>
                </Row>
              </Split>
            </>
          );
        default:
          break;
      }
    }
    return (
      <>
        <ProCard className="primary-card github-like-border">
          <RuleBuilder location={location} />
        </ProCard>
      </>
    );
  };

  // useEffect(() => {
  //   // DO NOT CHANGE THIS IF YOU DONT KNOW THE SIDE EFFECTS
  //   localForage
  //     .getItem("ruleEditorSplitPaneWidth")
  //     .then((value) => {
  //       if (value && isNumber(value)) {
  //         setSplitPaneWidth(value);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("Using default pane width");
  //     });
  // }, []);

  const handleDeviceView = () => {
    switch (appMode) {
      case GLOBAL_CONSTANTS.APP_MODES.DESKTOP:
        if (showEditor) {
          return renderRuleEditor();
        }

        return handleAuthenticatedView();

      case GLOBAL_CONSTANTS.APP_MODES.EXTENSION:
        if (!isExtensionInstalled()) {
          return (
            <ProCard className="primary-card github-like-border">
              <InstallExtensionCTA />
            </ProCard>
          );
        }

        if (showEditor) {
          if (!isExtensionEnabled) {
            return <ExtensionDeactivationMessage />;
          }

          return renderRuleEditor();
        }

        return handleAuthenticatedView();

      default:
        break;
    }
  };

  const handleAuthenticatedView = () => {
    if (user.loggedIn) {
      return (
        <ProCard className="primary-card github-like-border">
          <UpgradeCTA
            heading={"Limit Reached"}
            content={
              "We are limited to 3 rules for the free plan. Please upgrade to create more rules."
            }
          />
        </ProCard>
      );
    }

    return (
      <>
        <ProCard className="primary-card github-like-border">
          <LoginCTA
            heading={"Please login to create more rules."}
            content={""}
            cbUrl={location.pathname}
          />
        </ProCard>
      </>
    );
  };

  return handleDeviceView();
};

export default RuleEditor;
