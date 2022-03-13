import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import isEmpty from "is-empty";
//STORE
import { store } from "../../../../store";
import { getUpdateRulesAndGroupsActionObject } from "../../../../store/action-objects";
import { getToggleActiveModalActionObject } from "../../../../../../app/src/store/action-objects";
//COMPONENTS
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";
import ChangeRuleGroupModal from "../ChangeRuleGroupModal";
import SpinnerCard from "../../../misc/SpinnerCard";
import LimitReachedModal from "../../../../../src/components/user/LimitReachedModal";
import CreateSharedListModal from "../../../../components/features/sharedLists/CreateSharedListModal";
//CONSTANTS
import APP_CONSTANTS from "../../../../config/constants";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
//EXTERNALS
import { StorageService } from "../../../../init";
//ACTIONS
import {
  getModeData,
  setCurrentlySelectedRule,
  initiateBlankCurrentlySelectedRule,
  setCurrentlySelectedRuleConfig,
  cleanup,
  getSelectedRules,
} from "./actions";
import { fetchSharedLists } from "../../../../components/features/sharedLists/SharedListsIndexPage/actions";
//UTILITIES
import * as GlobalStoreUtils from "../../../../utils/GlobalStoreUtils";
import * as RedirectionUtils from "../../../../utils/RedirectionUtils";
import { getPlanName } from "../../../../utils/PremiumUtils";
import { getFeatureLimits } from "../../../../utils/FeatureManager";

//CONSTANTS
const {
  RULE_EDITOR_CONFIG,
  RULE_TYPES_CONFIG,
  RULES_LIST_TABLE_CONSTANTS,
} = APP_CONSTANTS;
const UNGROUPED_GROUP_ID = RULES_LIST_TABLE_CONSTANTS.UNGROUPED_GROUP_ID;
const UNGROUPED_GROUP_NAME = RULES_LIST_TABLE_CONSTANTS.UNGROUPED_GROUP_NAME;

const RuleBuilder = (props) => {
  //Constants
  const { MODE, RULE_TYPE_TO_CREATE, RULE_TO_EDIT_ID } = getModeData(
    props.location,
    props.isSharedListViewRule
  );
  const navigate = useNavigate();

  //Global State
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const currentlySelectedRuleData = GlobalStoreUtils.getCurrentlySelectedRuleData(
    state
  );
  const currentlySelectedRuleConfig = GlobalStoreUtils.getCurrentlySelectedRuleConfig(
    state
  );
  const allRules = GlobalStoreUtils.getAllRules(state);
  const appMode = GlobalStoreUtils.getAppMode(state);
  const user = GlobalStoreUtils.getUserAuthDetails(state);
  //References
  const isCleaningUpRef = useRef(false);
  //Component State
  const ruleSelection = {};
  ruleSelection[currentlySelectedRuleData.id] = true;
  const [userPlanName, setUserPlanName] = useState("");
  const [activeLimitedFeatureName, setActiveLimitedFeatureName] = useState(
    APP_CONSTANTS.FEATURES.RULES
  );
  const [isShareRulesModalActive, setIsShareRulesModalActive] = useState(false);
  const [isLimitReachedModalActive, setIsLimitReachedModalActive] = useState(
    false
  );
  const [fetchAllRulesComplete, setFetchAllRulesComplete] = useState(false);
  const [currentlySelectedGroup, setCurrentlySelectedGroup] = useState("");
  const [
    isChangeRuleGroupModalActive,
    setIsChangeRuleGroupModalActive,
  ] = useState(false);
  const [activeLimitedFeatureLimit, setActiveLimitedFeatureLimit] = useState(0);
  const [selectedRules, setSelectedRules] = useState(
    getSelectedRules(ruleSelection)
  );
  const toggleChangeRuleGroupModal = () => {
    setIsChangeRuleGroupModalActive(
      isChangeRuleGroupModalActive ? false : true
    );
  };
  const toggleShareRulesModal = () => {
    setIsShareRulesModalActive(isShareRulesModalActive ? false : true);
  };
  const toggleLimitReachedModal = () => {
    setIsLimitReachedModalActive(isLimitReachedModalActive ? false : true);
  };
  const getCurrentSharedListsCount = (result) => {
    if (result) {
      return Object.keys(result).length;
    } else {
      return 0;
    }
  };

  const shareRuleClickHandler = () => {
    if (user.loggedIn) {
      verifySharedListsLimit();
    } else {
      dispatch(getToggleActiveModalActionObject("authModal", true));
    }
  };

  const verifySharedListsLimit = () => {
    dispatch(getToggleActiveModalActionObject("loadingModal", true));
    const planName = user?.details?.planDetails?.planName;
    const planSharedListsLimit = getFeatureLimits(
      APP_CONSTANTS.FEATURES.SHARED_LISTS,
      user,
      planName
    );

    fetchSharedLists(user.details.profile.uid).then((result) => {
      const currentSharedListsCount = getCurrentSharedListsCount(result);
      if (currentSharedListsCount >= planSharedListsLimit) {
        //Update state to reflect changes in modal
        setActiveLimitedFeatureLimit(planSharedListsLimit);
        setUserPlanName(planName);
        setActiveLimitedFeatureName(APP_CONSTANTS.FEATURES.SHARED_LISTS);
        //Activate modal to notify user to upgrade
        setIsLimitReachedModalActive(true);
      } else {
        //Continue creating new shared list
        setSelectedRules(getSelectedRules(ruleSelection));
        setIsShareRulesModalActive(true);
        //Analytics
      }
      //Deactivate loading modal
      dispatch(getToggleActiveModalActionObject("loadingModal", false));
    });
  };
  const stableSetCurrentlySelectedRuleConfig = useCallback(
    setCurrentlySelectedRuleConfig,
    [setCurrentlySelectedRuleConfig]
  );

  const stableSetCurrentlySelectedRule = useCallback(setCurrentlySelectedRule, [
    setCurrentlySelectedRule,
  ]);

  const stableInitiateBlankCurrentlySelectedRule = useCallback(
    initiateBlankCurrentlySelectedRule,
    [currentlySelectedRuleConfig]
  );

  useEffect(() => {
    if (
      currentlySelectedRuleData === false ||
      (MODE === RULE_EDITOR_CONFIG.MODES.CREATE &&
        currentlySelectedRuleData.ruleType !== RULE_TYPE_TO_CREATE) ||
      (MODE === RULE_EDITOR_CONFIG.MODES.CREATE &&
        currentlySelectedRuleConfig.TYPE !== RULE_TYPE_TO_CREATE) ||
      (MODE === RULE_EDITOR_CONFIG.MODES.CREATE &&
        currentlySelectedRuleConfig.TYPE !== currentlySelectedRuleData.ruleType)
    ) {
      if (MODE === RULE_EDITOR_CONFIG.MODES.CREATE) {
        stableInitiateBlankCurrentlySelectedRule(
          dispatch,
          currentlySelectedRuleConfig,
          RULE_TYPE_TO_CREATE,
          setCurrentlySelectedRule
        );
        stableSetCurrentlySelectedRuleConfig(
          dispatch,
          RULE_TYPES_CONFIG[RULE_TYPE_TO_CREATE],
          navigate
        );
      } else if (MODE === RULE_EDITOR_CONFIG.MODES.EDIT) {
        StorageService(appMode)
          .getRecord(RULE_TO_EDIT_ID)
          .then((rule) => {
            if (rule === undefined) {
              RedirectionUtils.redirectTo404(navigate);
            } else {
              //Prevent updating state when component is about to unmount
              if (!isCleaningUpRef.current) {
                stableSetCurrentlySelectedRule(dispatch, rule);
                stableSetCurrentlySelectedRuleConfig(
                  dispatch,
                  RULE_TYPES_CONFIG[rule.ruleType],
                  navigate
                );
              }
            }
          });
      } else if (MODE === RULE_EDITOR_CONFIG.MODES.SHARED_LIST_RULE_VIEW) {
        //View only
        if (props.rule) {
          //Prevent updating state when component is about to unmount
          if (!isCleaningUpRef.current) {
            stableSetCurrentlySelectedRule(dispatch, props.rule);
            stableSetCurrentlySelectedRuleConfig(
              dispatch,
              RULE_TYPES_CONFIG[props.rule.ruleType],
              navigate
            );
          }
        }
      } else {
        RedirectionUtils.redirectTo404(navigate);
      }
    }
  }, [
    currentlySelectedRuleConfig,
    currentlySelectedRuleData,
    MODE,
    stableInitiateBlankCurrentlySelectedRule,
    stableSetCurrentlySelectedRule,
    RULE_TO_EDIT_ID,
    RULE_TYPE_TO_CREATE,
    dispatch,
    navigate,
    stableSetCurrentlySelectedRuleConfig,
    props.rule,
    appMode,
    props.location,
  ]);

  useEffect(() => {
    if (currentlySelectedRuleData.groupId === UNGROUPED_GROUP_ID) {
      setCurrentlySelectedGroup(UNGROUPED_GROUP_NAME);
    } else if (currentlySelectedRuleData.groupId !== undefined) {
      StorageService(appMode)
        .getRecord(currentlySelectedRuleData.groupId)
        .then((group) => {
          if (group) {
            setCurrentlySelectedGroup(group.name);
          } else {
            setCurrentlySelectedGroup(UNGROUPED_GROUP_NAME);
          }
        });
    }
  }, [currentlySelectedRuleData.groupId, appMode]);

  //If "all rules" are not already there in state, fetch them.
  //To apply feature limit: Limit Active Rules
  // useEffect(() => {
  if (!fetchAllRulesComplete && isEmpty(allRules)) {
    StorageService(appMode)
      .getRecords(GLOBAL_CONSTANTS.OBJECT_TYPES.RULE)
      .then((rules) => {
        //Set Flag to prevent loop
        setFetchAllRulesComplete(true);

        dispatch(getUpdateRulesAndGroupsActionObject(rules, []));
      });
  }
  // });

  useEffect(() => {
    return () => {
      //Flag to prevent future state update when component is about to unmount
      isCleaningUpRef.current = true;
      cleanup(dispatch);
    };
  }, [dispatch]);

  // Clear currently-selected-rule when URL is changed.
  // This is imp since changing url from http://localhost:3000/rules/editor/edit/Redirect_s8g1y to http://localhost:3000/rules/editor/create/Redirect won't cause the parent component to re-render, so we need to handle it specifically.
  useEffect(() => {
    // https://stackoverflow.com/questions/39288915/detect-previous-path-in-react-router
    // prevPath will be sent by ProLayout navigation menu item
    if (
      props &&
      props.location &&
      props.location.pathname.includes("/rules/editor/create/") &&
      props.location.state &&
      props.location.state.prevPath &&
      props.location.state.prevPath.includes("/rules/editor/edit/")
    )
      cleanup(dispatch);
  }, [dispatch, props]);

  if (
    currentlySelectedRuleConfig === false ||
    currentlySelectedRuleConfig === undefined ||
    currentlySelectedRuleConfig.NAME === undefined ||
    currentlySelectedRuleData.name === undefined ||
    (MODE === RULE_EDITOR_CONFIG.MODES.CREATE &&
      currentlySelectedRuleData.ruleType !== RULE_TYPE_TO_CREATE)
  ) {
    return <SpinnerCard renderHeader />;
  }

  //OBJECT WITH DETAILS REQUIRED FOR TOP COUNT
  const topCountShowRequiredDataObject = {
    numOfRulePairsOfUser: currentlySelectedRuleData.pairs.length,
    planName: getPlanName(user),
    planRulePairLimit: getFeatureLimits(
      APP_CONSTANTS.FEATURES.RULE_PAIRS,
      user,
      getPlanName(user)
    ),
  };
  return (
    <>
      {MODE !== RULE_EDITOR_CONFIG.MODES.SHARED_LIST_RULE_VIEW ? (
        <Header
          currentlySelectedRuleConfig={currentlySelectedRuleConfig}
          topCountShowRequiredDataObject={topCountShowRequiredDataObject}
          shareBtnClickHandler={shareRuleClickHandler}
          location={props.location}
        />
      ) : null}
      <br />
      <Body
        currentlySelectedRuleConfig={currentlySelectedRuleConfig}
        setIsChangeRuleGroupModalActive={setIsChangeRuleGroupModalActive}
        currentlySelectedGroup={currentlySelectedGroup}
        mode={MODE}
      />
      <Footer
        currentlySelectedRuleConfig={currentlySelectedRuleConfig}
        clickHandler={shareRuleClickHandler}
        location={props.location}
      />

      {/* Modals */}
      {isChangeRuleGroupModalActive ? (
        <ChangeRuleGroupModal
          isOpen={isChangeRuleGroupModalActive}
          toggle={toggleChangeRuleGroupModal}
          mode="CURRENT_RULE"
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
          featureLimit={activeLimitedFeatureLimit}
          userPlanName={userPlanName}
          mode={
            activeLimitedFeatureLimit === 0
              ? APP_CONSTANTS.LIMIT_REACHED_MODAL.MODES.CHECK_IF_ENABLED
              : APP_CONSTANTS.LIMIT_REACHED_MODAL.MODES.CHECK_LIMIT
          }
        />
      ) : null}
    </>
  );
};

export default RuleBuilder;
