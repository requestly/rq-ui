import React, { createContext, useReducer } from "react";
//ACTION TYPES
import ACTION_TYPES from "./action-types";
//ACTION CREATORS
import ACTION_CREATORS from "./action-creators";
//INITIAL STATE
import INITIAL_STATE from "./initial-state";

const store = createContext(INITIAL_STATE);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((prevState, action) => {
    switch (action.type) {
      /** User */
      case ACTION_TYPES.UPDATE_USER_INFO:
        return ACTION_CREATORS.UPDATE_USER_INFO(prevState, action);

      case ACTION_TYPES.UPDATE_USER_PROFILE:
        return ACTION_CREATORS.UPDATE_USER_PROFILE(prevState, action);

      case ACTION_TYPES.UPDATE_USER_PLAN_DETAILS:
        return ACTION_CREATORS.UPDATE_USER_PLAN_DETAILS(prevState, action);

      /** App Mode */
      case ACTION_TYPES.UPDATE_APP_MODE:
        return ACTION_CREATORS.UPDATE_APP_MODE(prevState, action);

      /** App Theme */
      case ACTION_TYPES.UPDATE_APP_THEME:
        return ACTION_CREATORS.UPDATE_APP_THEME(prevState, action);

      /** Search */

      case ACTION_TYPES.UPDATE_SEARCH:
        return ACTION_CREATORS.UPDATE_SEARCH(prevState, action);

      /** Modals */

      case ACTION_TYPES.TOGGLE_ACTIVE_MODAL:
        return ACTION_CREATORS.TOGGLE_ACTIVE_MODAL(prevState, action);

      /** Feature - SharedLists */
      case ACTION_TYPES.UPDATE_SELECTED_SHARED_LISTS:
        return ACTION_CREATORS.UPDATE_SELECTED_SHARED_LISTS(prevState, action);

      /** Feature - Rules */
      case ACTION_TYPES.UPDATE_BACKUP_INFO:
        return ACTION_CREATORS.UPDATE_BACKUP_INFO(prevState, action);

      case ACTION_TYPES.UPDATE_GROUPS:
        return ACTION_CREATORS.UPDATE_GROUPS(prevState, action);

      case ACTION_TYPES.UPDATE_RULES_AND_GROUPS:
        return ACTION_CREATORS.UPDATE_RULES_AND_GROUPS(prevState, action);

      case ACTION_TYPES.ADD_RULES_AND_GROUPS:
        return ACTION_CREATORS.ADD_RULES_AND_GROUPS(prevState, action);

      case ACTION_TYPES.UPDATE_RULES_TO_POPULATE:
        return ACTION_CREATORS.UPDATE_RULES_TO_POPULATE(prevState, action);

      case ACTION_TYPES.UPDATE_GROUPWISE_RULES_TO_POPULATE:
        return ACTION_CREATORS.UPDATE_GROUPWISE_RULES_TO_POPULATE(
          prevState,
          action
        );

      case ACTION_TYPES.UPDATE_REFRESH_PENDING_STATUS:
        return ACTION_CREATORS.UPDATE_REFRESH_PENDING_STATUS(prevState, action);

      case ACTION_TYPES.UPDATE_HARD_REFRESH_PENDING_STATUS:
        return ACTION_CREATORS.UPDATE_HARD_REFRESH_PENDING_STATUS(
          prevState,
          action
        );

      case ACTION_TYPES.TOGGLE_SELECTED_RULE:
        return ACTION_CREATORS.TOGGLE_SELECTED_RULE(prevState, action);

      case ACTION_TYPES.SET_SELECTED_RULES:
        return ACTION_CREATORS.SET_SELECTED_RULES(prevState, action);

      case ACTION_TYPES.SET_SELECT_ALL_RULES_OF_A_GROUP:
        return ACTION_CREATORS.SET_SELECT_ALL_RULES_OF_A_GROUP(
          prevState,
          action
        );

      case ACTION_TYPES.CLEAR_SELECTED_RULES:
        return ACTION_CREATORS.CLEAR_SELECTED_RULES(prevState);

      case ACTION_TYPES.UPDATE_CURRENTLY_SELECTED_RULE_DATA:
        return ACTION_CREATORS.UPDATE_CURRENTLY_SELECTED_RULE_DATA(
          prevState,
          action
        );

      case ACTION_TYPES.UPDATE_CURRENTLY_SELECTED_RULE_CONFIG:
        return ACTION_CREATORS.UPDATE_CURRENTLY_SELECTED_RULE_CONFIG(
          prevState,
          action
        );

      case ACTION_TYPES.CLEAR_CURRENTLY_SELECTED_RULE_AND_CONFIG:
        return ACTION_CREATORS.CLEAR_CURRENTLY_SELECTED_RULE_AND_CONFIG(
          prevState,
          action
        );

      case ACTION_TYPES.SELECT_ALL_RULES:
        return ACTION_CREATORS.SELECT_ALL_RULES(prevState, action);

      // Marketplace

      case ACTION_TYPES.UPDATE_MARKETPLACE_RULES:
        return ACTION_CREATORS.UPDATE_MARKETPLACE_RULES(prevState, action);

      case ACTION_TYPES.TOGGLE_MARKETPLACE_RULES:
        return ACTION_CREATORS.TOGGLE_MARKETPLACE_RULES(prevState, action);

      // App Mode Specific
      case ACTION_TYPES.UPDATE_DESKTOP_SPECIFIC_DETAILS:
        return ACTION_CREATORS.UPDATE_DESKTOP_SPECIFIC_DETAILS(
          prevState,
          action
        );

      case ACTION_TYPES.UPDATE_USER_COUNTRY:
        return ACTION_CREATORS.UPDATE_USER_COUNTRY(prevState, action);

      case ACTION_TYPES.UPDATE_TRIAL_MODE_ENABLED:
        return ACTION_CREATORS.UPDATE_TRIAL_MODE_ENABLED(prevState, action);

      default:
        throw new Error();
    }
  }, INITIAL_STATE);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
