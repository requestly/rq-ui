import React, { useContext, useEffect, useState } from "react";
import { Button } from "antd";
//CONFIG
import APP_CONSTANTS from "../../../../../../../config/constants";
//STORE
import { store } from "../../../../../../../store";
//ACTIONS
import { addEmptyPair } from "./actions";
//UTILITIES
import * as GlobalStoreUtils from "../../../../../../../utils/GlobalStoreUtils";
import { checkIfLimitReached } from "../../../../../../../utils/FeatureManager";
import {
  submitEventUtil,
  trackRQLastActivity,
} from "../../../../../../../utils/AnalyticsUtils";
//SUB COMPONENTS
import LimitReachedModal from "../../../../../../../components/user/LimitReachedModal";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import { PlusOutlined } from "@ant-design/icons";
import { trackRulePairCreated } from "utils/analytics/rules/pair-created";
import { trackLimitReachedEvent } from "utils/analytics/business/free-limits/limit_reached";
// const { THEME_COLORS } = APP_CONSTANTS;

const AddPairButton = (props) => {
  const { currentlySelectedRuleConfig } = props;
  //Global State
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const user = GlobalStoreUtils.getUserAuthDetails(state);
  const currentlySelectedRuleData = GlobalStoreUtils.getCurrentlySelectedRuleData(
    state
  );

  // fetch planName from global state
  const planName =
    user.details?.planDetails?.planName ||
    APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE;

  //STATE TO MAINTAIN CURRENTLY SELECTED RULE PAIR COUNT
  const [currentlySelectedRuleCount, setCurrentlySelectedRuleCount] = useState(
    0
  );

  //Component State
  const [userPlanName, setUserPlanName] = useState("");
  const [activeLimitedFeatureName, setActiveLimitedFeatureName] = useState(
    APP_CONSTANTS.FEATURES.RULE_PAIRS
  );

  //MODALS
  const [isLimitReachedModalActive, setIsLimitReachedModalActive] = useState(
    false
  );

  const toggleLimitReachedModal = () => {
    setIsLimitReachedModalActive(isLimitReachedModalActive ? false : true);
  };

  //TO SET CURRENTLY OPENED RULE - PAIRS COUNT
  useEffect(() => {
    setCurrentlySelectedRuleCount(currentlySelectedRuleData.pairs.length);
  }, [currentlySelectedRuleData]);

  const handleRulePairsOnClick = () => {
    const ifRulePairsLimitReached = checkIfLimitReached(
      currentlySelectedRuleCount,
      APP_CONSTANTS.FEATURES.RULE_PAIRS,
      user,
      planName
    );
    if (!ifRulePairsLimitReached) {
      addEmptyPair(
        currentlySelectedRuleData,
        currentlySelectedRuleConfig,
        dispatch
      );
      //Analytics
      submitEventUtil(
        GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULE_PAIRS,
        GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.CREATED,
        "rule_pair_created",
        currentlySelectedRuleCount
      );
      trackRQLastActivity("rule_pair_created");
      trackRulePairCreated({ current_pairs_count: currentlySelectedRuleCount });
    } else {
      //Update state to reflect changes in modal
      setUserPlanName(planName);
      setActiveLimitedFeatureName(APP_CONSTANTS.FEATURES.RULE_PAIRS);
      //Activate modal to notify user to upgrade
      setIsLimitReachedModalActive(true);

      //Analytics
      submitEventUtil(
        GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULE_PAIRS,
        GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LIMIT_REACHED,
        "rule_pairs_limit_reached",
        currentlySelectedRuleCount
      );
      trackRQLastActivity("rule_pairs_limit_reached");

      trackLimitReachedEvent({
        type: "rule_pairs",
        current_count: currentlySelectedRuleCount,
      });
    }
  };

  return (
    <>
      <Button
        className="btn-icon btn-3 has-no-box-shadow float-right has-no-border"
        type="secondary"
        onClick={handleRulePairsOnClick}
        icon={<PlusOutlined />}
      >
        Add Condition
      </Button>
      {isLimitReachedModalActive ? (
        <LimitReachedModal
          isOpen={isLimitReachedModalActive}
          toggle={toggleLimitReachedModal}
          featureName={activeLimitedFeatureName}
          userPlanName={userPlanName}
        />
      ) : null}
    </>
  );
};

export default AddPairButton;
