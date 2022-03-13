//EXTERNALS
import { StorageService } from "../init";
//CONSTANTS
import APP_CONSTANTS from "../config/constants";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
//FUNCTIONS
import { setIdsOfRulePairs } from "./rules/set-ids-of-rules-pairs";

export const checkIfMigrationStepsAreAlreadyPerformed = (appMode) => {
  return StorageService(appMode).getRecord(APP_CONSTANTS.MIGRATED_TO_NEW_UI);
};

export const setMigrationStepsDone = (appMode) => {
  return StorageService(appMode).saveRecord({
    [APP_CONSTANTS.MIGRATED_TO_NEW_UI]: true,
  });
};

export const executeMigrationSteps = async (appMode) => {
  const rules = await StorageService(appMode).getRecords(
    GLOBAL_CONSTANTS.OBJECT_TYPES.RULE
  );
  const rulesWithPairIdSet = setIdsOfRulePairs(rules);
  StorageService(appMode).saveMultipleRulesOrGroups(rulesWithPairIdSet);
};
