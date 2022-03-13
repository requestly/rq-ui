/* PAGES */
export const PAGES = {
  RULES: {
    INDEX_PAGE: "rules_index_page",
  },
  SHARED_LISTS: {
    INDEX_PAGE: "shared_lists_index_page",
  },
};

/* EVENTS */

/* Auth */
export const SIGNUP_ATTEMPTED = "signup_attempted";
export const SIGNUP_FAILED = "signup_failed";
export const SIGNUP_SUCCESS = "signup_success";
export const LOGIN_ATTEMPTED = "login_attempted";
export const LOGIN_REQUESTED = "login_requested";
export const LOGIN_SUCCESS = "login_success";
export const LOGIN_FAILED = "login_failed";
export const FORGOT_PASSWORD_ATTEMPTED = "forgot_password_attempted";
export const FORGOT_PASSWORD_SUCCESS = "forgot_password_success";
export const FORGOT_PASSWORD_FAILED = "forgot_password_failed";
export const VERIFY_OOBCODE_ATTEMPTED = "verify_oobcode_attempted";
export const VERIFY_OOBCODE_FAILED = "verify_oobcode_failed";
export const VERIFY_OOBCODE_SUCCESS = "verify_oobcode_success";
export const RESET_PASSWORD_ATTEMPTED = "reset_password_attempted";
export const RESET_PASSWORD_SUCCESS = "reset_password_success";
export const RESET_PASSWORD_FAILED = "reset_password_failed";

/* Rules */
export const RULE_CREATED = "rule_created";
export const RULE_EDITED = "rule_edited";
export const RULE_DELETED = "rule_deleted";
export const RULES_DELETED = "rules_deleted";
export const RULE_EXPORTED = "rule_exported";
export const RULES_EXPORTED = "rules_exported";
export const RULES_IMPORTED = "rules_imported";
export const RULE_PAIR_CREATED = "rule_pair_created";
export const RULE_DUPLICATED = "rule_duplicated";
export const RULE_TRASH = "rules_moved_to_trash";
export const RULE_TEMPLATE_CLICKED = "rule_templates_clicked";

export const GROUP_CHANGED = "group_changed";
export const GROUP_CREATED = "group_created";

export const ACTIVE_RULE_LIMIT_REACHED = "active_rule_limit_reached";
export const CREATE_RULE_LIMIT_REACHED = "create_rule_limit_reached";
export const EDIT_RULE_LIMIT_REACHED = "edit_rule_limit_reached";

export const SIMULATE_RULE = "rule_simulated";
export const EXECUTION_LOGS = "execution_logs";
export const NEW_RULE_SELECTOR_EXAMPLE_USECASE_CLICKED =
  "new_rule_selector_example_usecase_clicked";

/* AUTH PROVIDERS */
export const AUTH_PROVIDERS = {
  EMAIL: "email",
  GMAIL: "gmail",
  APPLE: "apple",
  MICROSOFT: "microsoft",
  EMAIL_LINK: "email_link",
};

/* Referral  */
export const REFERRAL = {
  APPLIED: "referral_applied",
  FAILED: "referral_failed",
};

/* Feedback */
export const FEEDBACK = {
  SUBMITTED: "feedback_submitted",
};

/* Shared Lists */
export const SHARED_LIST = {};

/* Desktop App */
export const DESKTOP_APP = {
  /* Desktop App - Process Management*/
  PROCESS_MANAGEMENT: {
    BACKGROUND: {
      PROCESS_STARTED: "background_process_started",
    },
  },
  PROXY_SERVER: {
    STARTED: "proxy_server_started",
  },
  APPS: {
    APP_DETECTED: "app_detected",
    APP_CONNECTED: "app_connected",
    APP_DISCONNECTED: "app_disconnected",
    APP_CONNECT_FAILURE: "app_connect_failure",
  },
  MISC: {
    APP_STARTED: "desktop_app_started",
  },
};

export const MOCK_SERVER = {
  MOCKS: {
    DELETED: "mock_deleted",
    UPDATED: "mock_updated",
    CREATED: "mock_created",
  },
  FILES: {
    DELETED: "file_deleted",
    UPDATED: "file_updated",
    CREATED: "file_created",
  },
};

export const BUSINESS = {
  FREE_LIMITS: {
    REMOVE_CLICKED: "remove_limits_clicked",
    LIMIT_REACHED: "limit_reached",
  },
};

export const APP_LIFECYCLE = {
  EXTENSION_INSTALLED: "extension_installed",
  DESKTOP_APP_INSTALLED: "desktop_app_installed",
};

export const MISC = {
  UNINSTALL_FEEDBACK: "uninstall_feedback",
};
