import React, { useContext, useEffect, useState } from "react";
import { Button, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "utils/Toast.js";
//Global Store
import { store } from "../../../../../../../store";
//UTILS
import * as GlobalStoreUtils from "../../../../../../../utils/GlobalStoreUtils";
import { trackRQLastActivity } from "../../../../../../../utils/AnalyticsUtils";
//Actions
import { saveRule } from "../actions";
import { getModeData } from "../../../actions";
import { validateRule } from "./actions";
//Constants
import APP_CONSTANTS from "../../../../../../../config/constants";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import { redirectToRuleEditor } from "utils/RedirectionUtils";
import { CheckOutlined, LockOutlined } from "@ant-design/icons";
import { getStorageType } from "actions/ExtensionActions";
import { trackRuleCreatedEvent } from "utils/analytics/rules/created";
import { trackRuleEditedEvent } from "utils/analytics/rules/edited";
// Static
import LimitReachedModal from "components/user/LimitReachedModal";
import { checkIfLimitReached, isRuleTypeEnabled } from "utils/FeatureManager";
import { trackEditRuleLimitReachedEvent } from "utils/analytics/rules/edit_rule_limit";
import { ruleModifiedAnalytics } from "./actions";

const CreateRuleButton = (props) => {
  //Constants
  const navigate = useNavigate();
  const { MODE } = getModeData(props.location);
  //Global State
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const currentlySelectedRuleData = GlobalStoreUtils.getCurrentlySelectedRuleData(
    state
  );
  // const rules = GlobalStoreUtils.getAllRules(state);
  const user = GlobalStoreUtils.getUserAuthDetails(state);
  const appMode = GlobalStoreUtils.getAppMode(state);
  const allRules = GlobalStoreUtils.getAllRules(state);

  // component state
  const [tooltipText, setTooltipText] = useState("Ctrl+S");
  // const [storageType, setStorageType] = useState(null);
  const [isLimitReachedModalActive, setIsLimitReachedModalActive] = useState(
    false
  );
  const [userPlanName, setUserPlanName] = useState("Free");
  const [isCurrentRuleLocked, setIsCurrentRuleLocked] = useState(false);

  // fetch planName from global state
  const planNameFromState =
    user.details?.planDetails?.planName ||
    APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE;

  const toggleLimitReachedModal = () => {
    setIsLimitReachedModalActive(isLimitReachedModalActive ? false : true);
  };

  // Checks if its response rule or script rule as they are available from basic plan onwards
  const isRuleTypeLocked = () => {
    if (MODE === APP_CONSTANTS.RULE_EDITOR_CONFIG.MODES.EDIT) {
      return false;
    }

    return !isRuleTypeEnabled(
      currentlySelectedRuleData.ruleType,
      user,
      planNameFromState
    );
  };

  const getCurrentActionText = () => {
    return MODE === APP_CONSTANTS.RULE_EDITOR_CONFIG.MODES.EDIT
      ? "Save"
      : "Create";
  };
  const handleBtnOnClick = async () => {
    // If user is logged in & belongs to given org & trying to update existing Rule, check his limits
    if (
      MODE === APP_CONSTANTS.RULE_EDITOR_CONFIG.MODES.EDIT &&
      user?.details?.profile?.email
    ) {
      const currentNumberOfRules = allRules.length;
      const planName = planNameFromState;
      const hasRulesLimitReached = checkIfLimitReached(
        currentNumberOfRules - 1, // -1 since user here isn't trying to create a new rule. He just wants to update an existing rule
        APP_CONSTANTS.FEATURES.RULES,
        user,
        planName
      );

      if (hasRulesLimitReached) {
        //Update state to reflect changes in modal
        setUserPlanName(planName);
        //Activate modal to notify user to upgrade
        setIsLimitReachedModalActive(true);
        let uid = user?.details?.profile?.uid || null;
        trackEditRuleLimitReachedEvent(uid, currentNumberOfRules);
        return;
      }
    }

    let storageType = null;

    if (appMode === GLOBAL_CONSTANTS.APP_MODES.EXTENSION) {
      const { storageType: actualStorageType } = await getStorageType();
      storageType = actualStorageType;
    } else if (appMode === GLOBAL_CONSTANTS.APP_MODES.DESKTOP) {
      storageType = "local";
    }

    if (!storageType) {
      alert(
        "Storage problem occurred. Please send a screenshot of this to us at contact@requestly.io"
      );
      return;
    }

    const createdBy = user?.details?.profile?.uid || null;
    const currentOwner = user?.details?.profile?.uid || null;
    const lastModifiedBy = user?.details?.profile?.uid || null;

    //Validation
    const ruleValidation = validateRule(
      currentlySelectedRuleData,
      user,
      appMode,
      storageType
    );
    if (ruleValidation.result) {
      saveRule(
        appMode,
        dispatch,
        {
          ...currentlySelectedRuleData,
          createdBy,
          currentOwner,
          lastModifiedBy,
        },
        navigate
      ).then(async () => {
        toast.success(
          `Successfully ${getCurrentActionText().toLowerCase()}d the rule`
        );

        /* @sahil865gupta: Testing GA4 events and blending BQ data. Move this to separate module*/

        let rule_type = null;

        if (currentlySelectedRuleData && currentlySelectedRuleData.ruleType) {
          rule_type = currentlySelectedRuleData.ruleType;
        }
        if (MODE === APP_CONSTANTS.RULE_EDITOR_CONFIG.MODES.CREATE) {
          trackRuleCreatedEvent(rule_type);
        } else if (MODE === APP_CONSTANTS.RULE_EDITOR_CONFIG.MODES.EDIT) {
          trackRuleEditedEvent(rule_type);
        }
        ruleModifiedAnalytics(user);
        trackRQLastActivity("rule_saved");

        const ruleId = currentlySelectedRuleData.id;
        redirectToRuleEditor(navigate, ruleId);
      });
    } else {
      toast.warn(ruleValidation.message, {
        hideProgressBar: true,
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveFn = (event) => {
    if (isCurrentRuleLocked) {
      return;
    }

    if (
      (navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) &&
      event.key.toLowerCase() === "s"
    ) {
      event.preventDefault();
      handleBtnOnClick();
    }
  };

  const generateButtonTooltipText = () => {
    if (isCurrentRuleLocked) {
      setTooltipText("This rule is available basic plan onwards");
      return;
    }
    if (navigator.platform.match("Mac")) {
      setTooltipText("⌘+S");
    }
  };

  useEffect(() => {
    generateButtonTooltipText();
    setIsCurrentRuleLocked(isRuleTypeLocked());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentlySelectedRuleData]);

  useEffect(() => {
    document.addEventListener("keydown", saveFn);
    return () => {
      document.removeEventListener("keydown", saveFn);
    };
  }, [saveFn]);

  return (
    <>
      <Tooltip title={tooltipText} placement="bottom">
        <Button
          className="btn-icon btn-3"
          type="primary"
          onClick={handleBtnOnClick}
          icon={isCurrentRuleLocked ? <LockOutlined /> : <CheckOutlined />}
          disabled={isCurrentRuleLocked}
        >
          {getCurrentActionText()} Rule
        </Button>
      </Tooltip>
      {/* MODALS */}
      {isLimitReachedModalActive ? (
        <LimitReachedModal
          isOpen={isLimitReachedModalActive}
          toggle={toggleLimitReachedModal}
          featureName={APP_CONSTANTS.FEATURES.RULES}
          userPlanName={userPlanName}
        />
      ) : null}
    </>
  );
};

export default CreateRuleButton;
