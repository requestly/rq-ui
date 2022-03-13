import { StorageService } from "../../../../../init";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import APP_CONSTANTS from "../../../../../config/constants";
//FUNCTIONS
import { setIdsOfSingleRulePairs } from "../../../../../utils/rules/set-ids-of-rules-pairs";
import { generateObjectId } from "../../../../../utils/FormattingHelper";
import * as FeatureManager from "../../../../../utils/FeatureManager";
import { generateObjectCreationDate } from "utils/DateTimeUtils";
import { syncRecordUpdates } from "../../../../../utils/syncing/SyncUtils";
//CONSTANTS
const { RULES_LIST_TABLE_CONSTANTS } = APP_CONSTANTS;

export const addRulesAndGroupsToStorage = (appMode, array) => {
  return StorageService(appMode).saveMultipleRulesOrGroups(array);
};

const setInnerIds = (incomingArray) => {
  return incomingArray.forEach((object) => {
    if (object.objectType === GLOBAL_CONSTANTS.OBJECT_TYPES.RULE) {
      return setIdsOfSingleRulePairs(object);
    } else {
      return object;
    }
  });
};

const activateRule = (incomingRule) =>
  (incomingRule.status = GLOBAL_CONSTANTS.RULE_STATUS.ACTIVE);

const deactivateRule = (incomingRule) =>
  (incomingRule.status = GLOBAL_CONSTANTS.RULE_STATUS.INACTIVE);

/**
 * Activates the Rules which are to be imported based plan and capacity
 *
 * @param {Array} incomingRules Rule array which is to be imported
 * @param {Number} numberOfActiveImports The number of rules whose status can be made active
 */
const activateRulesBasedOnPlan = (incomingRules, numberOfActiveImports) => {
  let activeImports = numberOfActiveImports;

  incomingRules.forEach((rule) => {
    if (activeImports > 0) {
      activateRule(rule);
      activeImports--;
    } else {
      deactivateRule(rule);
    }
  });
};

/**
 * Separates the Rules and Groups from incoming array
 *
 * @param {Array} incomingArray
 * @return {Object}
 */
const filterRulesAndGroups = (incomingArray) => {
  const rules = [];
  const groups = [];
  const groupsId = {};

  const pushToGroups = (object) => {
    groups.push(object);
    groupsId[object.id] = true;
  };

  incomingArray.forEach((object) =>
    object.objectType === GLOBAL_CONSTANTS.OBJECT_TYPES.RULE
      ? rules.push(object)
      : object.objectType === GLOBAL_CONSTANTS.OBJECT_TYPES.GROUP
      ? pushToGroups(object)
      : null
  );
  return {
    rules: rules,
    groups: groups,
    groupsId: groupsId,
  };
};

const isObjectValid = (object) => {
  const objectType = [
    GLOBAL_CONSTANTS.OBJECT_TYPES.RULE,
    GLOBAL_CONSTANTS.OBJECT_TYPES.GROUP,
  ];
  const objectStatus = [
    GLOBAL_CONSTANTS.RULE_STATUS.ACTIVE,
    GLOBAL_CONSTANTS.RULE_STATUS.INACTIVE,
  ];

  return objectType.includes(object.objectType) &&
    objectStatus.includes(object.objectStatus) &&
    typeof object.name === "string" &&
    object.description
    ? typeof object.description === "string"
    : true;
};

const setNewCreationDate = (incomingArray) => {
  return incomingArray.forEach((object) => {
    object.creationDate = generateObjectCreationDate();
    return object;
  });
};

const setNewIdofRules = (incomingArray) => {
  return incomingArray.forEach((object) => {
    object.id = `${object.ruleType}_${generateObjectId()}`;
    return object;
  });
};
// const setNewIdofGroups = (incomingArray) => {
//   return incomingArray.map((object) => {
//     object.id = `Group_${generateObjectId()}`;
//     return object;
//   });
// };

const setUnknownGroupIdsToUngroupped = (rulesArray, groupsIdObject) => {
  return rulesArray.forEach((rule) => {
    rule.groupId = groupsIdObject[rule.groupId]
      ? rule.groupId
      : RULES_LIST_TABLE_CONSTANTS.UNGROUPED_GROUP_ID;

    return rule;
  });
};

export const processDataToImport = (incomingArray, user, allRules) => {
  const data = filterRulesAndGroups(incomingArray);
  //Filter valid rules
  const rules = data.rules.filter((object) => isObjectValid(object));
  //Filter valid groups
  const groups = data.groups.filter((object) => isObjectValid(object));
  //Set new Creation Date
  setNewCreationDate(rules);
  setNewCreationDate(groups);
  //Set new IDs of rules
  setNewIdofRules(rules);
  //Set IDs of Rule Pairs
  setInnerIds(rules);

  // fetch planName from global state
  const planName =
    user.details?.planDetails?.planName ||
    APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE;

  const planActiveRulesLimit = FeatureManager.getFeatureLimits(
    APP_CONSTANTS.FEATURES.ACTIVE_RULES,
    user,
    planName
  );

  const currentNumberOfActiveRules = allRules.filter(
    (rule) => rule.status === GLOBAL_CONSTANTS.RULE_STATUS.ACTIVE
  ).length;

  //If User is not on active plan, activate rules based on count left
  if (!user?.details?.isPremium) {
    const numberOfActiveImports =
      planActiveRulesLimit - currentNumberOfActiveRules;

    activateRulesBasedOnPlan(rules, numberOfActiveImports);
  }
  //For Rules which do not have a valid Group associated, move them to Ungrouped
  setUnknownGroupIdsToUngroupped(rules, data.groupsId);
  //Merge valid rules & groups
  const importedRulesAndGroups = rules.concat(groups);
  // Change currentOwner
  const currentOwner = user?.details?.profile?.uid || null;

  const combinedRulesAndGroups = [];
  if (rules.length || groups.length) {
    importedRulesAndGroups.forEach((data) => {
      const updatedData = { ...data, currentOwner };
      combinedRulesAndGroups.push(updatedData);
    });
  }
  //Return promise
  return new Promise(function (resolve) {
    resolve({
      data: combinedRulesAndGroups,
      rulesCount: rules.length,
      groupsCount: groups.length,
    });
  });
};
