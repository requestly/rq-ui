import APP_CONSTANTS from "../config/constants";
import { getFeatureLimits } from "./FeatureManager";

export const getNumberOfRulesImportAllowed = (
  planName = APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE,
  user,
  currentNumberOfRules = 0
) => {
  const planRulesLimit = getFeatureLimits(
    APP_CONSTANTS.FEATURES.RULES,
    user,
    planName
  );

  const numberOfRulesImportAllowed = planRulesLimit - currentNumberOfRules;

  if (numberOfRulesImportAllowed <= 0) {
    return 0;
  }
  return numberOfRulesImportAllowed;
};

export const checkIfCompleteImportAllowed = (
  planName = APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE,
  user,
  currentNumberOfRules = 0,
  numberOfRulesToImport = 0
) => {
  const numberOfRulesImportAllowed = getNumberOfRulesImportAllowed(
    planName,
    user,
    currentNumberOfRules
  );

  return numberOfRulesToImport <= numberOfRulesImportAllowed;
};

export const checkIfAnyRuleImportAllowed = (
  planName = APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE,
  user,
  currentNumberOfRules = 0
) => {
  if (
    getNumberOfRulesImportAllowed(planName, user, currentNumberOfRules) === 0
  ) {
    return false;
  }
  return true;
};
