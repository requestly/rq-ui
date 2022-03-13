import React, { useState, useContext, useEffect, useCallback } from "react";
//SUB COMPONENTS
import LimitReachedModal from "../../../../../../user/LimitReachedModal";
//STORE
import { store } from "../../../../../../../store";
//ACTIONS
import { setCurrentlySelectedRule } from "../../../actions";
//CONSTANTS
import APP_CONSTANTS from "../../../../../../../config/constants";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
//UTILITIES
import * as GlobalStoreUtils from "../../../../../../../utils/GlobalStoreUtils";
import * as FeatureManager from "../../../../../../../utils/FeatureManager";
import { Switch } from "antd";
import { trackActiveRuleLimitReachedEvent } from "utils/analytics/rules/active_rule_limit";
import { toast } from "utils/Toast.js";
import { saveRule } from "../actions/index";

const Status = ({ location }) => {
  //Global State
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const currentlySelectedRuleData = GlobalStoreUtils.getCurrentlySelectedRuleData(
    state
  );
  const allRules = GlobalStoreUtils.getAllRules(state);
  const user = GlobalStoreUtils.getUserAuthDetails(state);
  const appMode = GlobalStoreUtils.getAppMode(state);
  //Component State
  const [
    hasUserTriedToChangeRuleStatus,
    setHasUserTriedToChangeRuleStatus,
  ] = useState(false);
  const [userPlanName, setUserPlanName] = useState("Free");
  const [isLimitReachedModalActive, setIsLimitReachedModalActive] = useState(
    false
  );

  // fetch planName from global state
  const planNameFromState =
    user.details?.planDetails?.planName ||
    APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE;

  const toggleLimitReachedModal = () => {
    setIsLimitReachedModalActive(isLimitReachedModalActive ? false : true);
  };

  const isRuleCurrentlyActive = () => {
    return (
      currentlySelectedRuleData.status === GLOBAL_CONSTANTS.RULE_STATUS.ACTIVE
    );
  };

  const changeRuleStatus = (newValue) => {
    if (newValue !== currentlySelectedRuleData.status)
      setCurrentlySelectedRule(dispatch, {
        ...currentlySelectedRuleData,
        status: newValue,
      });

    const callback = () =>
      newValue === GLOBAL_CONSTANTS.RULE_STATUS.ACTIVE
        ? toast.success("Rule saved and activated")
        : toast.success("Rule saved and deactivated");

    const isCreateMode = location.pathname.indexOf("create") !== -1;

    !isCreateMode &&
      saveRule(
        appMode,
        null,
        {
          ...currentlySelectedRuleData,
          status: newValue,
        },
        null,
        callback
      );
  };

  const stableChangeRuleStatus = useCallback(changeRuleStatus, [
    appMode,
    currentlySelectedRuleData,
    dispatch,
    location.pathname,
  ]);

  const toggleRuleStatus = (event) => {
    // event.preventDefault();
    setHasUserTriedToChangeRuleStatus(true);
    //Check limit only when activating the rule
    if (isRuleCurrentlyActive()) {
      changeRuleStatus(GLOBAL_CONSTANTS.RULE_STATUS.INACTIVE);
    } else {
      const currentNumberOfActiveRules = allRules.filter(
        (rule) => rule.status === GLOBAL_CONSTANTS.RULE_STATUS.ACTIVE
      ).length;

      const planName = planNameFromState;
      const checkIfActiveRulesLimitReached = FeatureManager.checkIfLimitReached(
        currentNumberOfActiveRules,
        APP_CONSTANTS.FEATURES.ACTIVE_RULES,
        user,
        planName
      );

      if (checkIfActiveRulesLimitReached) {
        //Update state to reflect changes in modal
        setUserPlanName(planName);
        //Activate modal to notify user to upgrade
        setIsLimitReachedModalActive(true);
        let uid = user?.details?.profile?.uid || null;
        trackActiveRuleLimitReachedEvent(uid, currentNumberOfActiveRules);
      } else {
        //Continue allowing activating rule
        changeRuleStatus(GLOBAL_CONSTANTS.RULE_STATUS.ACTIVE);
      }
    }
  };

  useEffect(() => {
    if (!hasUserTriedToChangeRuleStatus) {
      //Check if rules limit violated or not. If not enable the rule
      const currentNumberOfActiveRules = allRules.filter(
        (rule) => rule.status === GLOBAL_CONSTANTS.RULE_STATUS.ACTIVE
      ).length;

      const planName = planNameFromState;
      const checkIfActiveRulesLimitReached = FeatureManager.checkIfLimitReached(
        currentNumberOfActiveRules,
        APP_CONSTANTS.FEATURES.ACTIVE_RULES,
        user,
        planName
      );
      //sets the status of rule as active only if the rule is being created
      //status of rule remains same if the rule is being edited
      if (location.pathname.indexOf("create") !== -1) {
        if (!checkIfActiveRulesLimitReached) {
          stableChangeRuleStatus(GLOBAL_CONSTANTS.RULE_STATUS.ACTIVE);
        }
      }
    }
  }, [
    allRules,
    stableChangeRuleStatus,
    user,
    location.pathname,
    hasUserTriedToChangeRuleStatus,
    planNameFromState,
  ]);

  return (
    <React.Fragment>
      <Switch
        size="small"
        checked={isRuleCurrentlyActive()}
        onChange={toggleRuleStatus}
      />
      {/* MODALS */}
      {isLimitReachedModalActive ? (
        <LimitReachedModal
          isOpen={isLimitReachedModalActive}
          toggle={toggleLimitReachedModal}
          featureName={APP_CONSTANTS.FEATURES.ACTIVE_RULES}
          userPlanName={userPlanName}
        />
      ) : null}
    </React.Fragment>
  );
};

export default Status;
