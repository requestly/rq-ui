import React, { useContext } from "react";
import { Input } from "antd";
//Global Store
import { store } from "../../../../../../../store";
//Actions
import { onChangeHandler } from "../../actions/index";
//UTILITIES
import * as GlobalStoreUtils from "../../../../../../../utils/GlobalStoreUtils";

const Description = () => {
  //Global State
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const currentlySelectedRuleData = GlobalStoreUtils.getCurrentlySelectedRuleData(
    state
  );
  return (
    <Input
      placeholder="Description (optional)"
      name="description"
      type="text"
      className=" has-dark-text"
      value={currentlySelectedRuleData.description}
      onChange={(event) =>
        onChangeHandler(currentlySelectedRuleData, dispatch, event)
      }
    />
  );
};

export default Description;
