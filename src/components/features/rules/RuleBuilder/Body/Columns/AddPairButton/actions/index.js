//Actions
import { getEmptyPair, setCurrentlySelectedRule } from "../../../../actions";

export const addEmptyPair = (
  currentlySelectedRuleData,
  currentlySelectedRuleConfig,
  dispatch
) => {
  const copyOfCurrentlySelectedRule = JSON.parse(
    JSON.stringify(currentlySelectedRuleData)
  );
  copyOfCurrentlySelectedRule.pairs.push(
    getEmptyPair(currentlySelectedRuleConfig)
  );
  setCurrentlySelectedRule(dispatch, copyOfCurrentlySelectedRule);
};
