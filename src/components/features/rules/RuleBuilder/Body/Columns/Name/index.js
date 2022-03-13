import React, { useContext } from "react";
import { Input } from "reactstrap";
//Global Store
import { store } from "../../../../../../../store";
//Actions
import { onChangeHandler } from "../../actions/index";
import * as GlobalStoreUtils from "../../../../../../../utils/GlobalStoreUtils";

const Name = () => {
  //Global State
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const currentlySelectedRuleData = GlobalStoreUtils.getCurrentlySelectedRuleData(
    state
  );
  return (
    <Input
      placeholder="Rule Name"
      name="name"
      type="text"
      className=" has-dark-text height-two-rem"
      value={currentlySelectedRuleData.name}
      onChange={(event) =>
        onChangeHandler(currentlySelectedRuleData, dispatch, event)
      }
      autoFocus
    />
  );
};

export default Name;
