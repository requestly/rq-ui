//Actions
import { setCurrentlySelectedRule } from "../../actions";

export const onChangeHandler = (currentlySelectedRuleData, dispatch, event) => {
  setCurrentlySelectedRule(dispatch, {
    ...currentlySelectedRuleData,
    [event.target.name]: event.target.value,
  });
};
