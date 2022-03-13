import ACTION_TYPES from "../action-types";

export const getUpdateUserInfoActionObject = (isLoggedIn, details) => {
  return {
    type: ACTION_TYPES.UPDATE_USER_INFO,
    payload: {
      loggedIn: isLoggedIn,
      details: details,
    },
  };
};

export const getUpdateUserProfile = (userProfile) => {
  return {
    type: ACTION_TYPES.UPDATE_USER_PROFILE,
    payload: {
      userProfile,
    },
  };
};

export const getUpdateUserPlanDetails = (userPlanDetails, isUserPremium) => {
  return {
    type: ACTION_TYPES.UPDATE_USER_PLAN_DETAILS,
    payload: {
      userPlanDetails,
      isUserPremium,
    },
  };
};

export const getUpdateAppModeActionObject = (appMode) => {
  return {
    type: ACTION_TYPES.UPDATE_APP_MODE,
    payload: {
      appMode: appMode,
    },
  };
};

export const getUpdateAppThemeActionObject = (appTheme) => {
  return {
    type: ACTION_TYPES.UPDATE_APP_THEME,
    payload: {
      appTheme: appTheme,
    },
  };
};

export const getUpdateLastBackupTimeStampActionObject = (
  lastBackupTimeStamp
) => {
  return {
    type: ACTION_TYPES.UPDATE_BACKUP_INFO,
    payload: lastBackupTimeStamp,
  };
};

export const getUpdateGroupsActionObject = (groups) => {
  return {
    type: ACTION_TYPES.UPDATE_GROUPS,
    payload: groups,
  };
};

export const getUpdateRulesAndGroupsActionObject = (rules, groups) => {
  return {
    type: ACTION_TYPES.UPDATE_RULES_AND_GROUPS,
    payload: {
      rules: [...rules],
      groups: [...groups],
    },
  };
};

export const getAddRulesAndGroups = (rules, groups) => {
  return {
    type: ACTION_TYPES.ADD_RULES_AND_GROUPS,
    payload: {
      rules: [...rules],
      groups: [...groups],
    },
  };
};

export const getUpdateRulesToPopulateActionObject = (rules) => {
  return {
    type: ACTION_TYPES.UPDATE_RULES_TO_POPULATE,
    payload: rules,
  };
};

export const getUpdateGroupwiseRulesToPopulateActionObject = (
  groupwiseRules
) => {
  return {
    type: ACTION_TYPES.UPDATE_GROUPWISE_RULES_TO_POPULATE,
    payload: groupwiseRules,
  };
};

export const getUpdateRefreshPendingStatusActionObject = (type, newValue) => {
  // If newValue is undefined, the old value is toggled
  return {
    type: ACTION_TYPES.UPDATE_REFRESH_PENDING_STATUS,
    payload: {
      type: type,
      newValue: newValue,
    },
  };
};

export const getUpdateHardRefreshPendingStatusActionObject = (
  type,
  newValue
) => {
  // If newValue is undefined, the old value is toggled
  return {
    type: ACTION_TYPES.UPDATE_HARD_REFRESH_PENDING_STATUS,
    payload: {
      type: type,
      newValue: newValue,
    },
  };
};

export const getToggleSelectedRuleActionObject = (ruleId) => {
  return {
    type: ACTION_TYPES.TOGGLE_SELECTED_RULE,
    payload: {
      ruleId: ruleId,
    },
  };
};

export const getSetSelectedRulesActionObject = (newRulesSelectionObject) => {
  return {
    type: ACTION_TYPES.SET_SELECTED_RULES,
    payload: newRulesSelectionObject,
  };
};

export const getSetSelectAllRulesOfAGroupActionObject = (
  groupId,
  newValue = false
) => {
  return {
    type: ACTION_TYPES.SET_SELECT_ALL_RULES_OF_A_GROUP,
    payload: {
      groupId: groupId,
      newValue: newValue,
    },
  };
};

export const getClearSelectedRulesActionObject = () => {
  return {
    type: ACTION_TYPES.CLEAR_SELECTED_RULES,
  };
};

export const getSelectAllRulesActionObject = (newValue) => {
  return {
    type: ACTION_TYPES.SELECT_ALL_RULES,
    payload: {
      newValue,
    },
  };
};

export const getUpdateCurrentlySelectedRuleDataActionObject = (newRule) => {
  return {
    type: ACTION_TYPES.UPDATE_CURRENTLY_SELECTED_RULE_DATA,
    payload: newRule,
  };
};

export const getUpdateCurrentlySelectedRuleConfigActionObject = (newConfig) => {
  return {
    type: ACTION_TYPES.UPDATE_CURRENTLY_SELECTED_RULE_CONFIG,
    payload: newConfig,
  };
};

export const getUpdateSearchActionObject = (searchType, newValue) => {
  return {
    type: ACTION_TYPES.UPDATE_SEARCH,
    payload: {
      searchType: searchType,
      value: newValue,
    },
  };
};

export const getClearCurrentlySelectedRuleAndConfigActionObject = () => {
  return {
    type: ACTION_TYPES.CLEAR_CURRENTLY_SELECTED_RULE_AND_CONFIG,
  };
};

export const getUpdateSelectedSharedListsActionObject = (newValue) => {
  return {
    type: ACTION_TYPES.UPDATE_SELECTED_SHARED_LISTS,
    payload: newValue,
  };
};

export const getToggleActiveModalActionObject = (
  modalName,
  newValue,
  newProps
) => {
  return {
    type: ACTION_TYPES.TOGGLE_ACTIVE_MODAL,
    payload: {
      modalName,
      newValue,
      newProps,
    },
  };
};

// Marketplace

export const getUpdateMarketplaceRules = (rules) => {
  return {
    type: ACTION_TYPES.UPDATE_MARKETPLACE_RULES,
    payload: rules,
  };
};

export const getToggleMarketplaceRules = (MKTRuleID) => {
  return {
    type: ACTION_TYPES.TOGGLE_MARKETPLACE_RULES,
    payload: MKTRuleID,
  };
};

// App Mode Specific
export const getUpdateDesktopSpecificDetails = (newDesktopSpecificDetails) => {
  return {
    type: ACTION_TYPES.UPDATE_DESKTOP_SPECIFIC_DETAILS,
    payload: newDesktopSpecificDetails,
  };
};

// User Country
export const getUpdateUserCountry = (country) => {
  return {
    type: ACTION_TYPES.UPDATE_USER_COUNTRY,
    payload: country,
  };
};

// if trial user
export const getUpdateTrialModeEnabled = (value) => {
  return {
    type: ACTION_TYPES.UPDATE_TRIAL_MODE_ENABLED,
    payload: value,
  };
};
