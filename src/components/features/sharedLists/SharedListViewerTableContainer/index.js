import React, { useState, useContext, useEffect } from "react";
import { Button, Tooltip } from "antd";
import { Alert, Modal } from "antd";
import { toast } from "utils/Toast.js";
import { useLocation, useNavigate } from "react-router-dom";
//SUB COMPONENTS
import InstallExtensionCTA from "../../../misc/InstallExtensionCTA";
//ACTIONS
import {
  addRulesAndGroupsToStorage,
  processDataToImport,
} from "../../rules/ImportRulesModal/actions";
//UTILS
import {
  redirectToPricingPlans,
  redirectToRules,
} from "../../../../utils/RedirectionUtils";
import {
  submitEventUtil,
  trackRQLastActivity,
} from "../../../../utils/AnalyticsUtils";
import {
  getAppMode,
  getRulesSelection,
  getUserAuthDetails,
} from "../../../../utils/GlobalStoreUtils";
import { isExtensionInstalled } from "../../../../actions/ExtensionActions";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
//STORE
import { store } from "../../../../store";
//UTILS
import { getAllRules } from "../../../../utils/GlobalStoreUtils";
import ProCard from "@ant-design/pro-card";
import RulesTable from "components/features/rules/RulesListContainer/RulesTable";
import { ImportOutlined } from "@ant-design/icons";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getSharedListIdFromURL } from "../SharedListViewerIndexPage/actions";
import APP_CONSTANTS from "../../../../config/constants";
import {
  checkIfAnyRuleImportAllowed,
  getNumberOfRulesImportAllowed,
  checkIfCompleteImportAllowed,
} from "../../../../utils/ImportUtils";
import LimitReachedModal from "../../../user/LimitReachedModal";
import { getPrettyPlanName } from "../../../../utils/FormattingHelper";
import { trackUpgradeNowClickedEvent } from "../../../../utils/analytics/business/free-limits/limit_reached";

const SharedListViewerTableContainer = ({ rules, groups }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  //Global State
  const globalState = useContext(store);
  const { state, dispatch } = globalState;
  const appMode = getAppMode(state);
  const allRules = getAllRules(state);
  const userDetails = getUserAuthDetails(state);
  const rulesSelection = getRulesSelection(state);
  const isTemplate = queryParams.get("template") === "true" ? true : false;
  const functions = getFunctions();
  //Component state
  const [areRulesImporting, setAreRulesImporting] = useState(false);
  const [isPartialImportAllowed, setIsPartialImportAllowed] = useState(false);
  const [isCompleteImportAllowed, setIsCompleteImportAllowed] = useState(false);
  const [isLimitReachedModalActive, setIsLimitReachedModalActive] = useState(
    false
  );
  const [numberOfRulesImportAllowed, setNumberOfRulesImportAllowed] = useState(
    0
  );
  const [modal, setModal] = useState(false);

  // fetch planName from global state
  const userPlanName =
    userDetails.details?.planDetails?.planName ||
    APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE;

  const currentNumberOfRules = allRules.length;

  const sendSharedListImportAsEmail = httpsCallable(
    functions,
    "sendSharedListImportAsEmail"
  );
  const sharedListId = getSharedListIdFromURL(window.location.pathname);

  const toggleLimitReachedModal = () => {
    setIsLimitReachedModalActive((prev) => !prev);
  };

  const handleImportListOnClick = (e) => {
    if (
      appMode === GLOBAL_CONSTANTS.APP_MODES.EXTENSION &&
      !isExtensionInstalled()
    ) {
      setModal(true);
      return;
    }

    setAreRulesImporting(true);

    const ruleIdsToImport = Object.keys(rulesSelection);
    const groupsToImport = groups ? groups : [];

    const rulesToImport = isCompleteImportAllowed
      ? rules
      : rules.filter((rule) => ruleIdsToImport.includes(rule.id));

    // Check Limit

    if (!isCompleteImportAllowed && ruleIdsToImport.length === 0) {
      toast.error("Please select rule before importing");
      setAreRulesImporting(false);
      return;
    }

    if (
      !checkIfAnyRuleImportAllowed(
        userPlanName,
        userDetails,
        currentNumberOfRules,
        rulesToImport.length
      )
    ) {
      toast.error(
        "Cannot Import rules. Importing Any Rule would violate your Rules limit."
      );
      setAreRulesImporting(false);
      return;
    }

    const numberOfRulesImportAllowed = getNumberOfRulesImportAllowed(
      userPlanName,
      userDetails,
      currentNumberOfRules
    );

    if (rulesToImport.length > numberOfRulesImportAllowed) {
      setAreRulesImporting(false);
      toast.error(`You can import ${numberOfRulesImportAllowed} rule(s) only`);
      return;
    }

    //E-mail
    sendSharedListImportAsEmail({
      email: userDetails.loggedIn
        ? userDetails.details.profile.email
        : "user_not_logged_in",
      url: "https://app.requestly.io" + location.pathname,
      rules: rules,
      sharedListId: sharedListId,
    }).catch((err) => {
      console.err(err);
    });

    //ANALYTICS
    submitEventUtil(
      GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.SHARED_LIST,
      GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.IMPORTED,
      "sharedList_import_started"
    );
    trackRQLastActivity("sharedList_import_started");

    //process Data
    processDataToImport(
      [...rulesToImport, ...groupsToImport],
      userDetails,
      allRules
    ).then((result) => {
      addRulesAndGroupsToStorage(appMode, result.data).then(() => {
        toast.info(`Successfully imported rules`);
        trackRQLastActivity("sharedList_imported");
        redirectToRules(navigate);
      });
    });
  };

  useEffect(() => {
    const rulesToImport = rules || [];

    // Check Limit
    const currentNumberOfRules = allRules.length;

    if (
      checkIfCompleteImportAllowed(
        userPlanName,
        userDetails,
        currentNumberOfRules,
        rulesToImport.length
      )
    ) {
      setIsCompleteImportAllowed(true);
    } else if (
      !checkIfAnyRuleImportAllowed(
        userPlanName,
        userDetails,
        currentNumberOfRules,
        rulesToImport.length
      )
    ) {
      setIsPartialImportAllowed(false);
      setAreRulesImporting(false);
      return;
    }

    const numberOfRulesImportAllowed = getNumberOfRulesImportAllowed(
      userPlanName,
      userDetails,
      currentNumberOfRules
    );
    setIsPartialImportAllowed(true);
    setNumberOfRulesImportAllowed(numberOfRulesImportAllowed);
  }, [allRules, dispatch, rules, userPlanName]);

  const trackImportEvent = () => {
    const reason = APP_CONSTANTS.LIMIT_REACHED_MODAL.REASON.IMPORT_RULE;
    const source = APP_CONSTANTS.LIMIT_REACHED_MODAL.SOURCE.IMPORT_RULE;

    trackUpgradeNowClickedEvent(reason, source);
  };

  const toggle = () => setModal(!modal);

  const ExtensionModal = () => {
    return (
      <Modal visible={modal} onCancel={toggle} footer={null}>
        <InstallExtensionCTA
          heading={"Browser Extension Required"}
          content={
            "Please install Requestly Browser Extension to import shared list."
          }
        />
      </Modal>
    );
  };
  return (
    <>
      <ExtensionModal />
      <ProCard className="primary-card github-like-border" title={null}>
        {isCompleteImportAllowed ? null : (
          <Alert
            message={
              <div>
                {isPartialImportAllowed ? (
                  <span>
                    {`You already have ${currentNumberOfRules} ${
                      currentNumberOfRules === 1 ? "rule" : "rules"
                    }, so you can import ${numberOfRulesImportAllowed} more ${
                      numberOfRulesImportAllowed === 1 ? "rule" : "rules"
                    } in the ${getPrettyPlanName(
                      userPlanName
                    )} plan. Please select the rule(s) & import.`}
                  </span>
                ) : (
                  <span>
                    {`You already have ${currentNumberOfRules} ${
                      currentNumberOfRules === 1 ? "rule" : "rules"
                    }, so you cannot import more rules in the ${getPrettyPlanName(
                      userPlanName
                    )} plan. Please upgrade to access all features.`}
                  </span>
                )}
              </div>
            }
            type="warning"
            showIcon
            action={
              <Button
                type="primary"
                onClick={() => {
                  redirectToPricingPlans(navigate);
                  trackImportEvent();
                }}
              >
                Upgrade Now
              </Button>
            }
          />
        )}
        <RulesTable
          options={{
            disableSelection: isCompleteImportAllowed,
            disableEditing: true,
            disableActions: true,
            disableFavourites: true,
            disableStatus: true,
            disableAlertActions: true,
          }}
          rules={rules}
          groups={groups}
          headerTitle={
            isTemplate ? "Template - Content" : "Shared List - Content"
          }
          toolBarRender={() => [
            isPartialImportAllowed ? (
              <Button
                type="primary"
                icon={<ImportOutlined />}
                onClick={handleImportListOnClick}
                loading={areRulesImporting}
                disabled={!isPartialImportAllowed}
              >
                {isTemplate ? "Use this Template" : "Import to My Rules"}
              </Button>
            ) : (
              <Tooltip title={`You cannot import more rules`} trigger="hover">
                <Button
                  type="primary"
                  icon={<ImportOutlined />}
                  onClick={handleImportListOnClick}
                  loading={areRulesImporting}
                  disabled={!isPartialImportAllowed}
                >
                  Import to My Rules
                </Button>
              </Tooltip>
            ),
          ]}
        />
      </ProCard>
      {isLimitReachedModalActive ? (
        <LimitReachedModal
          isOpen={isLimitReachedModalActive}
          toggle={toggleLimitReachedModal}
          featureName={APP_CONSTANTS.FEATURES.IMPORT}
          userPlanName={userPlanName}
        />
      ) : null}
    </>
  );
};

export default SharedListViewerTableContainer;
