import * as ACTION_OBJECTS from "../../../../store/action-objects";

export const unselectAllRules = (dispatch) => {
  //Unselect All Rules
  dispatch(ACTION_OBJECTS.getClearSelectedRulesActionObject());
};

export const getSelectedRules = (rulesSelection) => {
  return Object.keys(rulesSelection).filter((ruleId) => rulesSelection[ruleId]);
};
