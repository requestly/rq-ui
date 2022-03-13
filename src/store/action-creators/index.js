import APP_CONSTANTS from "../../config/constants";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";

const { RULES_LIST_TABLE_CONSTANTS } = APP_CONSTANTS;

const ACTION_CREATORS = {
  /** User */

  UPDATE_USER_INFO: (prevState, action) => {
    return {
      ...prevState,
      user: {
        loggedIn: action.payload.loggedIn,
        details: action.payload.details,
      },
    };
  },

  UPDATE_USER_PROFILE: (prevState, action) => {
    return {
      ...prevState,
      user: {
        ...prevState["user"],
        details: {
          ...prevState["user"]["details"],
          profile: action.payload.userProfile,
          isSyncEnabled: action.payload.userProfile?.isSyncEnabled || false,
          isBackupEnabled: action.payload.userProfile?.isBackupEnabled || false,
        },
      },
    };
  },

  UPDATE_USER_PLAN_DETAILS: (prevState, action) => {
    return {
      ...prevState,
      user: {
        ...prevState["user"],
        details: {
          ...prevState["user"]["details"],
          planDetails: action.payload.userPlanDetails,
          isPremium: action.payload.isUserPremium,
        },
      },
    };
  },

  UPDATE_APP_MODE: (prevState, action) => {
    return {
      ...prevState,
      appMode: action.payload.appMode
        ? action.payload.appMode
        : prevState.appMode,
    };
  },

  UPDATE_APP_THEME: (prevState, action) => {
    return {
      ...prevState,
      appTheme: action.payload.appTheme,
    };
  },

  /** Search */

  UPDATE_SEARCH: (prevState, action) => {
    return {
      ...prevState,
      search: {
        ...prevState["search"],
        [action.payload.searchType]: action.payload.value,
      },
    };
  },

  /** Modals */

  TOGGLE_ACTIVE_MODAL: (prevState, action) => {
    return {
      ...prevState,
      activeModals: {
        ...prevState["activeModals"],
        [action.payload.modalName]: {
          isActive:
            typeof action.payload.newValue !== "undefined"
              ? action.payload.newValue
              : !prevState["activeModals"][action.payload.modalName].isActive,
          props:
            action.payload.newProps ||
            prevState["activeModals"][action.payload.modalName].props,
        },
      },
    };
  },

  /** Feature - Rules */
  UPDATE_BACKUP_INFO: (prevState, action) => {
    return {
      ...prevState,
      rules: {
        ...prevState["rules"],
        lastBackupTimeStamp: action.payload,
      },
    };
  },

  UPDATE_GROUPS: (prevState, action) => {
    return {
      ...prevState,
      rules: {
        ...prevState["rules"],
        allRules: {
          ...prevState["rules"]["allRules"],
          groups: action.payload,
        },
      },
    };
  },

  UPDATE_RULES_AND_GROUPS: (prevState, action) => {
    return {
      ...prevState,
      rules: {
        ...prevState["rules"],
        allRules: {
          rules: action.payload.rules,
          groups: action.payload.groups,
        },
      },
    };
  },

  ADD_RULES_AND_GROUPS: (prevState, action) => {
    return {
      ...prevState,
      rules: {
        ...prevState["rules"],
        allRules: {
          rules: [
            ...prevState["rules"]["allRules"]["rules"],
            ...action.payload.rules,
          ],
          groups: [
            ...prevState["rules"]["allRules"]["groups"],
            ...action.payload.groups,
          ],
        },
      },
    };
  },

  UPDATE_RULES_TO_POPULATE: (prevState, action) => {
    return {
      ...prevState,
      rules: {
        ...prevState["rules"],
        rulesToPopulate: action.payload,
      },
    };
  },

  UPDATE_GROUPWISE_RULES_TO_POPULATE: (prevState, action) => {
    return {
      ...prevState,
      rules: {
        ...prevState["rules"],
        groupwiseRulesToPopulate: action.payload,
      },
    };
  },

  TOGGLE_SELECTED_RULE: (prevState, action) => {
    const currentValue =
      prevState["rules"]["selectedRules"][action.payload.ruleId];
    return {
      ...prevState,
      rules: {
        ...prevState["rules"],
        selectedRules: {
          ...prevState["rules"]["selectedRules"],
          [action.payload.ruleId]: currentValue ? false : true,
        },
      },
    };
  },

  SET_SELECTED_RULES: (prevState, action) => {
    return {
      ...prevState,
      rules: {
        ...prevState["rules"],
        selectedRules: action.payload,
      },
    };
  },

  SET_SELECT_ALL_RULES_OF_A_GROUP: (prevState, action) => {
    const groupId = action.payload.groupId;
    const allRulesUnderThisGroup =
      prevState["rules"]["groupwiseRulesToPopulate"][groupId][
        RULES_LIST_TABLE_CONSTANTS.GROUP_RULES
      ];
    const newSelectedRulesObject = {};
    allRulesUnderThisGroup.forEach((rule) => {
      newSelectedRulesObject[rule.id] = action.payload.newValue;
    });

    return {
      ...prevState,
      rules: {
        ...prevState["rules"],
        selectedRules: {
          ...prevState["rules"]["selectedRules"],
          ...newSelectedRulesObject,
        },
      },
    };
  },

  CLEAR_SELECTED_RULES: (prevState) => {
    return {
      ...prevState,
      rules: {
        ...prevState["rules"],
        selectedRules: {},
      },
    };
  },

  UPDATE_CURRENTLY_SELECTED_RULE_DATA: (prevState, action) => {
    return {
      ...prevState,
      rules: {
        ...prevState["rules"],
        currentlySelectedRule: {
          ...prevState["rules"]["currentlySelectedRule"],
          data: action.payload,
        },
      },
    };
  },

  UPDATE_CURRENTLY_SELECTED_RULE_CONFIG: (prevState, action) => {
    return {
      ...prevState,
      rules: {
        ...prevState["rules"],
        currentlySelectedRule: {
          ...prevState["rules"]["currentlySelectedRule"],
          config: action.payload,
        },
      },
    };
  },

  CLEAR_CURRENTLY_SELECTED_RULE_AND_CONFIG: (prevState, action) => {
    return {
      ...prevState,
      rules: {
        ...prevState["rules"],
        currentlySelectedRule: {
          config: false,
          data: false,
        },
      },
    };
  },

  UPDATE_REFRESH_PENDING_STATUS: (prevState, action) => {
    return {
      ...prevState,
      pendingRefresh: {
        ...prevState["pendingRefresh"],
        [action.payload.type]: action.payload.newValue
          ? action.payload.newValue
          : !prevState["pendingRefresh"][action.payload.type],
      },
    };
  },

  UPDATE_HARD_REFRESH_PENDING_STATUS: (prevState, action) => {
    return {
      ...prevState,
      pendingHardRefresh: {
        ...prevState["pendingHardRefresh"],
        [action.payload.type]: action.payload.newValue
          ? action.payload.newValue
          : !prevState["pendingHardRefresh"][action.payload.type],
      },
    };
  },

  SELECT_ALL_RULES: (prevState, action) => {
    const { newValue } = action.payload;

    const newSelectedRules = {};

    prevState.rules.rulesToPopulate.forEach((rule) => {
      newSelectedRules[rule.id] = newValue;
    });

    return {
      ...prevState,
      rules: {
        ...prevState.rules,
        selectedRules: newSelectedRules,
      },
    };
  },

  /** Feature - SharedLists */

  UPDATE_SELECTED_SHARED_LISTS: (prevState, action) => {
    return {
      ...prevState,
      sharedLists: {
        ...prevState["sharedLists"],
        selectedLists: action.payload,
      },
    };
  },
  /** Marketplace */

  UPDATE_MARKETPLACE_RULES: (prevState, action) => {
    return {
      ...prevState,
      marketplace: {
        ...prevState["marketplace"],
        ruleStatus: {
          ...prevState["marketplace"]["ruleStatus"],
          ...action.payload,
        },
      },
    };
  },

  TOGGLE_MARKETPLACE_RULES: (prevState, action) => {
    const currentValue = prevState["marketplace"]["ruleStatus"][action.payload];

    return {
      ...prevState,
      marketplace: {
        ...prevState["marketplace"],
        ruleStatus: {
          ...prevState["marketplace"]["ruleStatus"],
          [action.payload]:
            currentValue === GLOBAL_CONSTANTS.RULE_STATUS.ACTIVE
              ? GLOBAL_CONSTANTS.RULE_STATUS.INACTIVE
              : GLOBAL_CONSTANTS.RULE_STATUS.ACTIVE,
        },
      },
    };
  },

  UPDATE_DESKTOP_SPECIFIC_DETAILS: (prevState, action) => {
    return {
      ...prevState,
      desktopSpecificDetails: {
        ...prevState.desktopSpecificDetails,
        ...action.payload,
      },
    };
  },

  /** Update User Country */
  UPDATE_USER_COUNTRY: (prevState, action) => {
    return {
      ...prevState,
      country: action.payload,
    };
  },

  /** Update User Country */
  UPDATE_TRIAL_MODE_ENABLED: (prevState, action) => {
    return {
      ...prevState,
      trialModeEnabled: action.payload,
    };
  },
};

export default ACTION_CREATORS;
