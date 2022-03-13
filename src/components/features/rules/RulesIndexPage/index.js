import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { store } from "../../../../store";
//Components
import MigrationCheckModal from "../../../misc/MigrationCheckModal";
import StorageMigrationCheckModal from "components/misc/StorageMigrationCheckModal";
import CreateRuleCTA from "../CreateRuleCTA";
import RulesListContainer from "../RulesListContainer";
import SpinnerCard from "../../../misc/SpinnerCard";
//Externals
import { StorageService } from "../../../../init";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
//REDUCER ACTION OBJECTS
import { getUpdateRulesAndGroupsActionObject } from "../../../../store/action-objects";
//UTILS
import { submitAttrUtil } from "../../../../utils/AnalyticsUtils";
import {
  getAllRules,
  getAppMode,
  getIsRefreshRulesPending,
  getIsHardRefreshRulesPending,
} from "../../../../utils/GlobalStoreUtils";
import { isGroupsSanitizationPassed } from "./actions";

const TRACKING = GLOBAL_CONSTANTS.GA_EVENTS;

const RulesIndexPage = () => {
  const useHasChanged = (val) => {
    const prevVal = usePrevious(val);
    return prevVal !== val;
  };

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };
  //Global State
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const rules = getAllRules(state);

  const isRulesListRefreshPending = getIsRefreshRulesPending(state);
  const isRulesListHardRefreshPending = getIsHardRefreshRulesPending(state);
  const appMode = getAppMode(state);
  //Component State
  const [
    fetchRulesAndGroupsComplete,
    setFetchRulesAndGroupsComplete,
  ] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);

  const stableDispatch = useCallback(dispatch, [dispatch]);

  const hasIsRulesListRefreshPendingChanged = useHasChanged(
    isRulesListRefreshPending
  );
  const hasIsRulesListHardRefreshPendingChanged = useHasChanged(
    isRulesListHardRefreshPending
  );

  useEffect(() => {
    if (hasIsRulesListHardRefreshPendingChanged) setIsTableLoading(true);
    const groupsPromise = StorageService(appMode).getRecords(
      GLOBAL_CONSTANTS.OBJECT_TYPES.GROUP
    );
    const rulesPromise = StorageService(appMode).getRecords(
      GLOBAL_CONSTANTS.OBJECT_TYPES.RULE
    );
    Promise.all([groupsPromise, rulesPromise]).then(async (data) => {
      const groups = data[0];
      const rules = data[1];

      const isGroupsSanitizationPassedResult = await isGroupsSanitizationPassed(
        { rules, groups, appMode }
      );

      if (isGroupsSanitizationPassedResult.success === false) {
        // Sanitization has updated the storage! but we dont need to fetch again as we have the updated copy
        stableDispatch(
          getUpdateRulesAndGroupsActionObject(
            isGroupsSanitizationPassedResult.updatedRules,
            groups
          )
        );
      } else {
        // Sanitization required doing nothing, so continue as it is
        stableDispatch(
          getUpdateRulesAndGroupsActionObject(
            isGroupsSanitizationPassedResult.updatedRules,
            groups
          )
        );
      }

      if (!fetchRulesAndGroupsComplete) setFetchRulesAndGroupsComplete(true);
      setIsTableLoading(false);

      //ANALYTICS
      submitAttrUtil(TRACKING.ATTR.NUM_RULES, rules.length);
      submitAttrUtil(
        TRACKING.ATTR.NUM_ACTIVE_RULES,
        rules.filter(
          (rule) => rule.status === GLOBAL_CONSTANTS.RULE_STATUS.ACTIVE
        ).length
      );
      submitAttrUtil(TRACKING.ATTR.NUM_GROUPS, groups.length);
      submitAttrUtil(
        TRACKING.ATTR.NUM_ACTIVE_GROUPS,
        groups.filter(
          (group) => group.status === GLOBAL_CONSTANTS.GROUP_STATUS.ACTIVE
        ).length
      );
    });
  }, [
    stableDispatch,
    isRulesListRefreshPending,
    appMode,
    fetchRulesAndGroupsComplete,
    hasIsRulesListRefreshPendingChanged,
    hasIsRulesListHardRefreshPendingChanged,
  ]);

  return (
    <React.Fragment>
      <MigrationCheckModal />
      <StorageMigrationCheckModal />
      {fetchRulesAndGroupsComplete ? (
        rules.length !== 0 ? (
          <RulesListContainer isTableLoading={isTableLoading} />
        ) : (
          <CreateRuleCTA />
        )
      ) : (
        <SpinnerCard customLoadingMessage="Loading Rules" skeletonType="list" />
      )}
    </React.Fragment>
  );
};
export default RulesIndexPage;
