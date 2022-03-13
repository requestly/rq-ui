import React, { useState, useContext, useEffect } from "react";

import ProCard from "@ant-design/pro-card";
//STORE
import { store } from "../../../../store/index";
import { getToggleActiveModalActionObject } from "../../../../store/action-objects";
//Sub Components
import NewRuleSelector from "../NewRuleSelector";
import CreateNewRuleGroupModal from "../CreateNewRuleGroupModal";
import ExportRulesModal from "../ExportRulesModal";
import DeleteRulesModal from "../DeleteRulesModal";
import ImportRulesModal from "../ImportRulesModal";
import ChangeRuleGroupModal from "../ChangeRuleGroupModal";
import RenameGroupModal from "../RenameGroupModal";
import CreateSharedListModal from "../../sharedLists/CreateSharedListModal";
import LimitReachedModal from "../../../user/LimitReachedModal";
//UTILS
import { StorageService } from "../../../../init";
import {
  getRulesSelection,
  getUserAuthDetails,
  getAllRules,
  getActiveModals,
  getAppMode,
} from "../../../../utils/GlobalStoreUtils";
import * as FeatureManager from "../../../../utils/FeatureManager";
import {
  submitEventUtil,
  submitAttrUtil,
  trackRQLastActivity,
} from "../../../../utils/AnalyticsUtils";
//ACTIONS
import { getSelectedRules } from "../actions";
import { fetchSharedLists } from "../../sharedLists/SharedListsIndexPage/actions";
//CONSTANTS
import APP_CONSTANTS from "../../../../config/constants";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import RulesTable from "./RulesTable";
import { trackCreateRuleLimitReachedEvent } from "utils/analytics/rules/create_rule_limit";

const RulesListContainer = ({ isTableLoading = false }) => {
  //Global State
  const globalState = useContext(store);
  const { state, dispatch } = globalState;
  const rulesSelection = getRulesSelection(state);
  const user = getUserAuthDetails(state);
  const allRules = getAllRules(state);
  const activeModals = getActiveModals(state);
  const appMode = getAppMode(state);
  const availableRuleTypeArray = Object.values(GLOBAL_CONSTANTS.RULE_TYPES);

  //Component State
  const [userPlanName, setUserPlanName] = useState("");
  const [activeLimitedFeatureName, setActiveLimitedFeatureName] = useState(
    APP_CONSTANTS.FEATURES.RULES
  );
  const [selectedRules, setSelectedRules] = useState(
    getSelectedRules(rulesSelection)
  );

  //RULES COUNT OF USER TO DISPLAY ON TOP
  const [totalRulesCount, setTotalRulesCount] = useState(0);

  //TO HANDLE MOBILE VIEW
  const [isMobile, setIsMobile] = useState(false);

  //Modals
  const [
    isNewRuleSelectorModalActive,
    setIsNewRuleSelectorModalActive,
  ] = useState(false);
  const [
    isCreateNewRuleGroupModalActive,
    setIsCreateNewRuleGroupModalActive,
  ] = useState(false);
  const [isChangeGroupModalActive, setIsChangeGroupModalActive] = useState(
    false
  );
  const [isExportRulesModalActive, setIsExportRulesModalActive] = useState(
    false
  );
  const [isDeleteRulesModalActive, setIsDeleteRulesModalActive] = useState(
    false
  );
  const [isImportRulesModalActive, setIsImportRulesModalActive] = useState(
    false
  );
  const [isShareRulesModalActive, setIsShareRulesModalActive] = useState(false);
  const [isLimitReachedModalActive, setIsLimitReachedModalActive] = useState(
    false
  );

  // fetch planName from global state
  const planName =
    user.details?.planDetails?.planName ||
    APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE;

  const toggleNewRuleSelectorModal = () => {
    setIsNewRuleSelectorModalActive(
      isNewRuleSelectorModalActive ? false : true
    );
  };
  const toggleCreateNewRuleGroupModal = () => {
    setIsCreateNewRuleGroupModalActive(
      isCreateNewRuleGroupModalActive ? false : true
    );
  };
  const toggleChangeGroupModal = () => {
    setIsChangeGroupModalActive(isChangeGroupModalActive ? false : true);
  };
  const toggleExportRulesModal = () => {
    setIsExportRulesModalActive(isExportRulesModalActive ? false : true);
  };
  const toggleDeleteRulesModal = () => {
    setIsDeleteRulesModalActive(isDeleteRulesModalActive ? false : true);
  };
  const toggleImportRulesModal = () => {
    setIsImportRulesModalActive(isImportRulesModalActive ? false : true);
  };
  const toggleShareRulesModal = () => {
    setIsShareRulesModalActive(isShareRulesModalActive ? false : true);
  };

  const toggleLimitReachedModal = () => {
    setIsLimitReachedModalActive(isLimitReachedModalActive ? false : true);
  };

  const toggleRenameGroupModal = () => {
    dispatch(getToggleActiveModalActionObject("renameGroupModal"));
  };

  const promptUserToLogIn = () => {
    dispatch(
      getToggleActiveModalActionObject("authModal", true, {
        redirectURL: window.location.href,
        src: APP_CONSTANTS.FEATURES.RULES,
        callback: () => setIsNewRuleSelectorModalActive(true),
      })
    );
  };
  const promptUserToLogInWithoutCallback = () => {
    dispatch(
      getToggleActiveModalActionObject("authModal", true, {
        redirectURL: window.location.href,
        src: APP_CONSTANTS.FEATURES.RULES,
      })
    );
  };

  const checkRulesLength = async () => {
    const records = await StorageService(appMode).getAllRecords();
    const currentDate = new Date().getTime();
    let lastDate = null;

    try {
      lastDate =
        window.localStorage.getItem("authModalShownLastOn") ||
        records.user_info.installationDate;
    } catch (error) {
      promptUserToLogIn();
      window.localStorage.setItem("authModalShownLastOn", currentDate);
    }

    const lastShownBefore = (currentDate - lastDate) / (1000 * 60 * 60 * 24);

    if (
      allRules.length >= APP_CONSTANTS.NO_LOGIN_RULES_LIMIT ||
      lastShownBefore >= 15
    ) {
      window.localStorage.setItem("authModalShownLastOn", currentDate);
      promptUserToLogIn();
    } else {
      setIsNewRuleSelectorModalActive(true);
    }
  };

  const handleNewRuleOnClick = (e) => {
    user.loggedIn ? verifyRulesLimit() : checkRulesLength();
  };

  const verifyRulesLimit = () => {
    const checkIfActiveRulesLimitReached = FeatureManager.checkIfLimitReached(
      allRules.length,
      APP_CONSTANTS.FEATURES.RULES,
      user,
      planName
    );

    if (checkIfActiveRulesLimitReached) {
      //Update state to reflect changes in modal
      setUserPlanName(planName);
      setActiveLimitedFeatureName(APP_CONSTANTS.FEATURES.RULES);
      //Activate modal to notify user to upgrade
      setIsLimitReachedModalActive(true);

      let uid = user?.details?.profile?.uid || null;
      trackCreateRuleLimitReachedEvent(uid, allRules.length);
    } else {
      //Continue creating new rules
      setIsNewRuleSelectorModalActive(true);
    }
  };

  const handleShareRulesOnClick = () => {
    user.loggedIn
      ? verifySharedListsLimit()
      : promptUserToLogInWithoutCallback();
  };

  const getCurrentSharedListsCount = (result) => {
    if (result) {
      return Object.keys(result).length;
    } else {
      return 0;
    }
  };

  const verifySharedListsLimit = () => {
    //Activate loading modal
    dispatch(getToggleActiveModalActionObject("loadingModal", true));

    fetchSharedLists(user.details.profile.uid).then((result) => {
      const currentSharedListsCount = getCurrentSharedListsCount(result);

      const ifSharedListsLimitReached = FeatureManager.checkIfLimitReached(
        currentSharedListsCount,
        APP_CONSTANTS.FEATURES.SHARED_LISTS,
        user,
        planName
      );

      if (ifSharedListsLimitReached) {
        //Update state to reflect changes in modal
        setUserPlanName(planName);
        setActiveLimitedFeatureName(APP_CONSTANTS.FEATURES.SHARED_LISTS);
        //Activate modal to notify user to upgrade
        setIsLimitReachedModalActive(true);
      } else {
        //Continue creating new shared list
        setSelectedRules(getSelectedRules(rulesSelection));
        setIsShareRulesModalActive(true);
        //Analytics
        submitEventUtil(
          GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULE,
          "rules",
          GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.SHARED
        );
        trackRQLastActivity("sharedList_created");
      }
      //Deactivate loading modal
      dispatch(getToggleActiveModalActionObject("loadingModal", false));
    });
  };

  const handleImportRulesOnClick = (e) => {
    user.loggedIn ? verifyImportRulesLimitAndContinue() : promptUserToLogIn();
  };

  const verifyImportRulesLimitAndContinue = () => {
    setIsImportRulesModalActive(true);
  };

  const handleExportRulesOnClick = () => {
    user.loggedIn ? verifyExportRulesLimitAndContinue() : promptUserToLogIn();
  };

  const verifyExportRulesLimitAndContinue = () => {
    const isExportRulesAllowed = FeatureManager.isFeatureEnabled(
      APP_CONSTANTS.FEATURES.EXPORT,
      user,
      planName
    );
    if (isExportRulesAllowed) {
      setSelectedRules(getSelectedRules(rulesSelection));
      setIsExportRulesModalActive(true);
    } else {
      //Update state to reflect changes in modal
      setUserPlanName(planName);
      setActiveLimitedFeatureName(APP_CONSTANTS.FEATURES.EXPORT);
      //Activate modal to notify user to upgrade
      setIsLimitReachedModalActive(true);
    }
  };

  //TO SET MOBILE VIEW WIDTH BY CHECKING THROUGH WINDOW OBJECT
  const updateWidth = () => setIsMobile(window.innerWidth < 620);
  window.clearRulesSelection = false;

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [isMobile]);

  //TO SUBMIT ATTRIBUTE OF TYPES OF RULES MADE BY USER AS USER ATTRIBUTES IN FIREBASE
  useEffect(() => {
    availableRuleTypeArray.forEach((ruleType) => {
      const thatRuleTypeUserRulesArray = allRules.filter(
        (rule) => rule.ruleType === ruleType
      );
      //TO SUBMIT NO OF TYPE THAT RULE ON FIREBASE ATTRIBUTES
      submitAttrUtil(ruleType + "_rules", thatRuleTypeUserRulesArray.length);
    });

    /* To set initial sharedlist count of user when it 
    continuous login again from another account to not 
    get false status on onboarding page */

    if (user && user.details && user.details.profile) {
      fetchSharedLists(user.details.profile.uid).then((result) => {
        const currentSharedListsCount = getCurrentSharedListsCount(result);
        submitAttrUtil(
          GLOBAL_CONSTANTS.GA_EVENTS.ATTR.NUM_SHARED_LISTS,
          currentSharedListsCount
        );
        if (currentSharedListsCount > 0) {
          submitAttrUtil("iscreatesharedlisttask", true);
        }
      });
    } else {
      submitAttrUtil(GLOBAL_CONSTANTS.GA_EVENTS.ATTR.NUM_SHARED_LISTS, 0);
      submitAttrUtil("iscreatesharedlisttask", false);
    }
  }, [allRules, availableRuleTypeArray, user]);

  //TO SET COUNT OF RULES MADE BY USER TO DISPLAY ON TOP OF RULES PAGE
  useEffect(() => {
    setTotalRulesCount(allRules.length);
  }, [allRules]);

  const recordsToDelete = allRules.filter((rule) =>
    selectedRules.some((ruleId) => ruleId === rule.id)
  );

  return (
    <>
      {/* Page content */}

      {/* Table */}
      <ProCard
        className="primary-card github-like-border rules-table-container"
        title={null}
      >
        <RulesTable
          isTableLoading={isTableLoading}
          handleChangeGroupOnClick={() => {
            setSelectedRules(getSelectedRules(rulesSelection));
            setIsChangeGroupModalActive(true);
          }}
          handleShareRulesOnClick={handleShareRulesOnClick}
          handleExportRulesOnClick={handleExportRulesOnClick}
          handleDeleteRulesOnClick={() => {
            setSelectedRules(getSelectedRules(rulesSelection));
            setIsDeleteRulesModalActive(true);
          }}
          handleImportRulesOnClick={handleImportRulesOnClick}
          totalRulesCount={totalRulesCount}
          handleNewGroupOnClick={() => {
            setSelectedRules(getSelectedRules(rulesSelection));
            setIsCreateNewRuleGroupModalActive(true);
          }}
          handleNewRuleOnClick={handleNewRuleOnClick}
          options={{
            disableSelection: false,
            disableEditing: false,
            disableActions: false,
            disableFavourites: false,
            disableStatus: false,
          }}
        />
      </ProCard>
      {/* Modals */}
      {isNewRuleSelectorModalActive ? (
        <NewRuleSelector
          isOpen={isNewRuleSelectorModalActive}
          toggle={toggleNewRuleSelectorModal}
          onClickHandler={toggleNewRuleSelectorModal}
        />
      ) : null}

      {isCreateNewRuleGroupModalActive ? (
        <CreateNewRuleGroupModal
          isOpen={isCreateNewRuleGroupModalActive}
          toggle={toggleCreateNewRuleGroupModal}
        />
      ) : null}

      {isChangeGroupModalActive ? (
        <ChangeRuleGroupModal
          isOpen={isChangeGroupModalActive}
          toggle={toggleChangeGroupModal}
          mode="SELECTED_RULES"
        />
      ) : null}

      {isExportRulesModalActive ? (
        <ExportRulesModal
          isOpen={isExportRulesModalActive}
          toggle={toggleExportRulesModal}
          rulesToExport={selectedRules}
        />
      ) : null}
      {isDeleteRulesModalActive ? (
        <DeleteRulesModal
          isOpen={isDeleteRulesModalActive}
          toggle={toggleDeleteRulesModal}
          ruleIdsToDelete={selectedRules}
          recordsToDelete={recordsToDelete}
        />
      ) : null}
      {isImportRulesModalActive ? (
        <ImportRulesModal
          isOpen={isImportRulesModalActive}
          toggle={toggleImportRulesModal}
        />
      ) : null}
      {isShareRulesModalActive ? (
        <CreateSharedListModal
          isOpen={isShareRulesModalActive}
          toggle={toggleShareRulesModal}
          rulesToShare={selectedRules}
        />
      ) : null}

      {isLimitReachedModalActive ? (
        <LimitReachedModal
          isOpen={isLimitReachedModalActive}
          toggle={toggleLimitReachedModal}
          featureName={activeLimitedFeatureName}
          userPlanName={userPlanName}
          mode={
            !FeatureManager.isFeatureEnabled(
              activeLimitedFeatureName,
              user,
              userPlanName
            )
              ? APP_CONSTANTS.LIMIT_REACHED_MODAL.MODES.CHECK_IF_ENABLED
              : APP_CONSTANTS.LIMIT_REACHED_MODAL.MODES.CHECK_LIMIT
          }
        />
      ) : null}

      {activeModals.renameGroupModal.isActive ? (
        <RenameGroupModal
          isOpen={activeModals.renameGroupModal.isActive}
          toggle={toggleRenameGroupModal}
          {...activeModals.renameGroupModal.props}
        />
      ) : null}
    </>
  );
};

export default RulesListContainer;
