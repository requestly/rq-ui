import React, { useContext } from "react";
import { Row, Col } from "antd";
import ReactSelect from "react-select";
//STORE
import { store } from "../../../../../../../../store";
//REDUCER ACTION OBJECTS
import { getUpdateCurrentlySelectedRuleDataActionObject } from "../../../../../../../../store/action-objects";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
//UTILS
import { getCurrentlySelectedRuleData } from "../../../../../../../../utils/GlobalStoreUtils";

var set = require("lodash/set");
var get = require("lodash/get");

const getAvailableScriptsOptions = () => {
  return Object.keys(GLOBAL_CONSTANTS.SCRIPT_LIBRARIES).map((library) => {
    return {
      value: library,
      label: GLOBAL_CONSTANTS.SCRIPT_LIBRARIES[library].name,
    };
  });
};

const AvailableScriptsRow = ({ rowIndex, pairIndex, isInputDisabled }) => {
  //Global State
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const currentlySelectedRuleData = getCurrentlySelectedRuleData(state);
  const setCurrentlySelectedRule = (newRule) =>
    dispatch(getUpdateCurrentlySelectedRuleDataActionObject(newRule));

  const getReactSelectValue = (arrayPath, allOptions) => {
    const currentArray = get(
      currentlySelectedRuleData.pairs[pairIndex],
      arrayPath,
      []
    );
    return allOptions.filter((value) => currentArray.includes(value.value));
  };

  const reactSelectOnChangeHandler = (incomingValues, targetPath) => {
    const copyOfCurrentlySelectedRule = JSON.parse(
      JSON.stringify(currentlySelectedRuleData)
    );
    let newValues = [];
    if (incomingValues) {
      newValues = incomingValues.map((value) => value.value);
    }
    set(copyOfCurrentlySelectedRule.pairs[pairIndex], targetPath, newValues);
    setCurrentlySelectedRule(copyOfCurrentlySelectedRule);
  };

  return (
    <Row
      className=" margin-top-one"
      key={rowIndex}
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Col
        className="my-auto"
        // xl={{ size: "auto" }} lg={{ size: "auto" }}
        span={4}
      >
        <span>Insert Libraries</span>
      </Col>
      <Col
        // xl="5"
        // lg="6"
        span={20}
        className="my-auto margin-bottom-1-when-xs margin-bottom-1-when-sm"
      >
        <ReactSelect
          isMulti={true}
          isDisabled={isInputDisabled}
          name="resource-type"
          options={getAvailableScriptsOptions()}
          placeholder="None"
          value={getReactSelectValue(
            GLOBAL_CONSTANTS.PATH_FROM_PAIR.SCRIPT_LIBRARIES,
            getAvailableScriptsOptions()
          )}
          onChange={(incomingValues) =>
            reactSelectOnChangeHandler(
              incomingValues,
              GLOBAL_CONSTANTS.PATH_FROM_PAIR.SCRIPT_LIBRARIES
            )
          }
        />
      </Col>
    </Row>
  );
};

export default AvailableScriptsRow;
