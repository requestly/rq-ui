const ACTION_TYPES = {
  /** User */
  UPDATE_USER_INFO: "update-user-info",
  UPDATE_USER_PROFILE: "update-user-profile",
  UPDATE_USER_PLAN_DETAILS: "update-user-plan-details",

  /** App Mode */
  UPDATE_APP_MODE: "update-app-mode",

  /** App Theme */
  UPDATE_APP_THEME: "update-app-theme",

  /** Search */
  UPDATE_SEARCH: "update-search",

  /** Modals */
  TOGGLE_ACTIVE_MODAL: "toggle-active-modal",

  /** Feature - Rules */
  UPDATE_BACKUP_INFO: "update-backup-info",
  UPDATE_GROUPS: "update-groups",
  UPDATE_RULES_AND_GROUPS: "update-rules-and-groups",
  ADD_RULES_AND_GROUPS: "add-rules-and-groups",
  UPDATE_REFRESH_PENDING_STATUS: "update-refresh-pending-status",
  UPDATE_HARD_REFRESH_PENDING_STATUS: "update-hard-refresh-pending-status",
  TOGGLE_SELECTED_RULE: "toggle-selected-rule-2",
  SET_SELECTED_RULES: "set-selected-rules",
  SET_SELECT_ALL_RULES_OF_A_GROUP: "set-select-all-rules-of-a-group",
  CLEAR_SELECTED_RULES: "clear-selected-rules",
  UPDATE_RULES_TO_POPULATE: "update-rules-to-populate",
  UPDATE_GROUPWISE_RULES_TO_POPULATE: "update-groupwise-rules-to-populate",
  UPDATE_CURRENTLY_SELECTED_RULE_DATA: "update-currently-selected-rule-data",
  UPDATE_CURRENTLY_SELECTED_RULE_CONFIG:
    "update-currently-selected-rule-config",
  CLEAR_CURRENTLY_SELECTED_RULE_AND_CONFIG:
    "clear-currently-selected-rule-and-config",
  SELECT_ALL_RULES: "select-all-rules",

  /** Feature - SharedLists */
  UPDATE_SELECTED_SHARED_LISTS: "update-selected-shared-lists",

  /** Marketplace */
  UPDATE_MARKETPLACE_RULES: "update-marketplace-rules",
  TOGGLE_MARKETPLACE_RULES: "toggle-marketplace-rules",

  /** App Mode Specific */
  UPDATE_DESKTOP_SPECIFIC_DETAILS: "update-desktop-specific-details",

  /** Country */
  UPDATE_USER_COUNTRY: "update_user_country",

  /** Update if user part of trial mode */
  UPDATE_TRIAL_MODE_ENABLED: "update-trial-mode-enabled",
};

export default ACTION_TYPES;
