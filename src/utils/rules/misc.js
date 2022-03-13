//UTILS
import { StorageService } from "../../init";
//CONSTANTS
import APP_CONSTANTS from "../../config/constants";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import { addRulesAndGroupsToStorage } from "components/features/rules/ImportRulesModal/actions";
//CONSTANTS
const { RULES_LIST_TABLE_CONSTANTS } = APP_CONSTANTS;
const GROUP_DETAILS = RULES_LIST_TABLE_CONSTANTS.GROUP_DETAILS;

const processRules = (rule, groupIdsArr, isGroupIdAlreadyAdded) => {
  if (rule.groupId !== RULES_LIST_TABLE_CONSTANTS.UNGROUPED_GROUP_ID) {
    if (!isGroupIdAlreadyAdded[rule.groupId]) {
      groupIdsArr.push(rule.groupId);
      isGroupIdAlreadyAdded[rule.groupId] = true;
    }
  }
  return sanitizeRule(rule);
};

const sanitizeRule = (rule) => {
  const sanitizedRule = rule;
  delete sanitizedRule.isFavourite;
  return sanitizedRule;
};

export const getRulesAndGroupsFromRuleIds = (
  appMode,
  selectedRuleIds,
  groupwiseRules
) => {
  return new Promise((resolve) => {
    const groupIdsArr = [];
    const isGroupIdAlreadyAdded = {};

    StorageService(appMode)
      .getAllRecords()
      .then((allRecords) => {
        //Fetch Required Rules
        const rules = selectedRuleIds.map((ruleId) =>
          processRules(allRecords[ruleId], groupIdsArr, isGroupIdAlreadyAdded)
        );

        const groups = [];
        //Fetch Required Groups
        groupIdsArr.forEach((groupId) => {
          groups.push(
            groupwiseRules[groupId][RULES_LIST_TABLE_CONSTANTS.GROUP_DETAILS]
          );
        });

        resolve({
          rules,
          groups,
        });
      });
  });
};

export const getAllRulesAndGroups = (appMode) => {
  return new Promise((resolve) => {
    StorageService(appMode)
      .getAllRecords()
      .then((allRecords) => {
        const groupIdsArr = [];
        const isGroupIdAlreadyAdded = {};
        let allRules = [],
          allGroups = {};
        for (let recordId in allRecords) {
          switch (allRecords[recordId].objectType) {
            case GLOBAL_CONSTANTS.OBJECT_TYPES.RULE:
              allRules.push(allRecords[recordId]);
              break;

            case GLOBAL_CONSTANTS.OBJECT_TYPES.GROUP:
              allGroups[recordId] = allRecords[recordId];
              break;

            default:
              break;
          }
        }

        const rules = allRules.map((rule) => {
          return processRules(rule, groupIdsArr, isGroupIdAlreadyAdded);
        });

        const groups = [];
        //Fetch Required Groups
        groupIdsArr.forEach((groupId) => {
          groups.push(allGroups[groupId]);
        });

        resolve({
          rules,
          groups,
        });
      });
  });
};

export const compareRuleByModificationDate = (object1, object2) => {
  const comparisonKeyForObject1 = object1.modificationDate
    ? object1.modificationDate
    : object1.creationDate;
  const comparisonKeyForObject2 = object2.modificationDate
    ? object2.modificationDate
    : object2.creationDate;

  if (comparisonKeyForObject1 < comparisonKeyForObject2) {
    return 1;
  }
  if (comparisonKeyForObject1 > comparisonKeyForObject2) {
    return -1;
  }
  return 0;
};

export const compareGroupToPopulateByModificationDate = (array1, array2) => {
  const comparisonKeyForArray1 = array1[1][GROUP_DETAILS].modificationDate
    ? array1[1][GROUP_DETAILS].modificationDate
    : array1[1][GROUP_DETAILS].creationDate;
  const comparisonKeyForArray2 = array2[1][GROUP_DETAILS].modificationDate
    ? array2[1][GROUP_DETAILS].modificationDate
    : array2[1][GROUP_DETAILS].creationDate;

  if (comparisonKeyForArray1 < comparisonKeyForArray2) {
    return 1;
  }
  if (comparisonKeyForArray1 > comparisonKeyForArray2) {
    return -1;
  }
  return 0;
};

export const updateCurrentOwnerForAllRules = async (uid, appMode) => {
  try {
    const { rules, groups } = await StorageService(appMode)
      .getAllRecords()
      .then((allRecords) => {
        const groups = [];
        const groupIdsArr = [];
        const isGroupIdAlreadyAdded = {};
        let allRules = [],
          allGroups = {};
        for (let recordId in allRecords) {
          switch (allRecords[recordId].objectType) {
            case GLOBAL_CONSTANTS.OBJECT_TYPES.RULE:
              allRules.push(allRecords[recordId]);
              break;

            case GLOBAL_CONSTANTS.OBJECT_TYPES.GROUP:
              allGroups[recordId] = allRecords[recordId];
              break;

            default:
              break;
          }
        }

        const rules = allRules.map((rule) => {
          if (rule.groupId !== RULES_LIST_TABLE_CONSTANTS.UNGROUPED_GROUP_ID) {
            if (!isGroupIdAlreadyAdded[rule.groupId]) {
              groupIdsArr.push(rule.groupId);
              isGroupIdAlreadyAdded[rule.groupId] = true;
            }
          }
          return rule;
        });

        //Fetch Required Groups
        groupIdsArr.forEach((groupId) => {
          groups.push(allGroups[groupId]);
        });

        return {
          rules,
          groups,
        };
      });

    if (rules.length || groups.length) {
      const updatedRulesAndGroups = [];

      rules.forEach((rule) => {
        const updatedRule = { ...rule, currentOwner: uid };
        updatedRulesAndGroups.push(updatedRule);
      });

      groups.forEach((group) => {
        const updatedGroup = { ...group, currentOwner: uid };
        updatedRulesAndGroups.push(updatedGroup);
      });

      await addRulesAndGroupsToStorage(appMode, updatedRulesAndGroups);
    }
  } catch (error) {}
};

export const getExecutionLogsId = (ruleId) => {
  if (!ruleId) return null;
  return `execution_${ruleId}`;
};
