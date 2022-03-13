import React, { useContext, useState } from "react";
import { Row, Col } from "antd";
//STORE
import { store } from "../../../../store";
//REDUCER ACTION OBJECTS
import { getUpdateCurrentlySelectedRuleDataActionObject } from "../../../../store/action-objects";
//Sub Components
import Filters from "./Filters";
// Pair markups of all rule types
import RedirectRulePair from "./Pairs/RedirectRulePair";
import CancelRulePair from "./Pairs/CancelRulePair";
import HeadersRulePair from "./Pairs/HeadersRulePair";
import ReplaceRulePair from "./Pairs/ReplaceRulePair";
import QueryParamRulePair from "./Pairs/QueryParamRulePair";
import ScriptRulePair from "./Pairs/ScriptRulePair";
import ResponseRulePair from "./Pairs/ResponseRulePair";
import UserAgentRulePair from "./Pairs/UserAgentRulePair";
import DelayRulePair from "./Pairs/DelayRulePair";
//ACTIONS
import { addEmptyPair } from "../RuleBuilder/Body/Columns/AddPairButton/actions";
//EXTERNALS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
//UTILITIES
import * as GlobalStoreUtils from "../../../../utils/GlobalStoreUtils";
import { submitEventUtil } from "../../../../utils/AnalyticsUtils";

const set = require("lodash/set");
const get = require("lodash/get");

const generatePlaceholderText = (operator, type) => {
  if (type === "source-value") {
    switch (operator) {
      case GLOBAL_CONSTANTS.RULE_OPERATORS.EQUALS:
        return "e.g. http://www.example.com";
      case GLOBAL_CONSTANTS.RULE_OPERATORS.CONTAINS:
        return "e.g. facebook";
      case GLOBAL_CONSTANTS.RULE_OPERATORS.WILDCARD_MATCHES:
        return "e.g. *://*.mydomain.com/*";
      case GLOBAL_CONSTANTS.RULE_OPERATORS.MATCHES:
        return "e.g. /example-([0-9]+)/ig";
      default:
        return "";
    }
  } else if (type === "destination") {
    switch (operator) {
      case GLOBAL_CONSTANTS.RULE_OPERATORS.EQUALS:
        return "e.g. http://www.new-example.com";
      case GLOBAL_CONSTANTS.RULE_OPERATORS.CONTAINS:
        return "e.g. http://www.new-example.com";
      case GLOBAL_CONSTANTS.RULE_OPERATORS.WILDCARD_MATCHES:
        return "e.g. $1://$2.newdomain.com/$3 (Each * can be replaced with respective $)";
      case GLOBAL_CONSTANTS.RULE_OPERATORS.MATCHES:
        return "e.g. http://www.new-example.com?queryParam=$1&searchParam=$2";
      default:
        return "";
    }
  }
  return "";
};

const RulePairs = (props) => {
  //Global State
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const currentlySelectedRuleData = GlobalStoreUtils.getCurrentlySelectedRuleData(
    state
  );

  const isInputDisabled = props.mode === "shared-list-rule-view" ? true : false;

  const setCurrentlySelectedRule = (newRule) =>
    dispatch(getUpdateCurrentlySelectedRuleDataActionObject(newRule));

  //Component State
  const [
    ruleFilterActiveWithPairIndex,
    setRuleFilterActiveWithPairIndex,
  ] = useState(false);

  /**
   * Handles onChange event with side effects
   * Here, path is relative to a pair
   * @param {Object|null|undefined} event onClick/onChange Event
   * @param {!number} pairIndex Index of array "pairs"
   * @param {!string} objectPath Path of item which we want to modify
   * @param {*} customValue If customValue is defined, use it instead of event target value
   * @param {array|undefined} arrayOfOtherValuesToModify Do other side effect modifications. Ex: [{path: "path_here",value:"value_to_be_placed"}]
   */
  const modifyPairAtGivenPath = (
    event,
    pairIndex,
    objectPath,
    customValue,
    arrayOfOtherValuesToModify
  ) => {
    event && event.preventDefault();
    let newValue = null;
    newValue = customValue !== undefined ? customValue : event.target.value;
    const copyOfCurrentlySelectedRule = JSON.parse(
      JSON.stringify(currentlySelectedRuleData)
    );
    set(copyOfCurrentlySelectedRule.pairs[pairIndex], objectPath, newValue);
    if (arrayOfOtherValuesToModify) {
      arrayOfOtherValuesToModify.forEach((modification) => {
        set(
          copyOfCurrentlySelectedRule.pairs[pairIndex],
          modification.path,
          modification.value
        );
      });
    }
    setCurrentlySelectedRule(copyOfCurrentlySelectedRule);
  };

  const getPairMarkup = (pair, pairIndex) => {
    const helperFunctions = {
      modifyPairAtGivenPath: modifyPairAtGivenPath,
      generatePlaceholderText: generatePlaceholderText,
      openFilterModal: openFilterModal,
      deletePair: deletePair,
      getFilterCount: getFilterCount,
      pushValueToArrayInPair: pushValueToArrayInPair,
      deleteArrayValueByIndexInPair: deleteArrayValueByIndexInPair,
    };
    switch (props.currentlySelectedRuleConfig.TYPE) {
      case GLOBAL_CONSTANTS.RULE_TYPES.REDIRECT:
        return (
          <RedirectRulePair
            pair={pair}
            pairIndex={pairIndex}
            helperFunctions={helperFunctions}
            ruleDetails={props.currentlySelectedRuleConfig}
            isInputDisabled={isInputDisabled}
          />
        );
      case GLOBAL_CONSTANTS.RULE_TYPES.CANCEL:
        return (
          <CancelRulePair
            pair={pair}
            pairIndex={pairIndex}
            helperFunctions={helperFunctions}
            ruleDetails={props.currentlySelectedRuleConfig}
            isInputDisabled={isInputDisabled}
          />
        );
      case GLOBAL_CONSTANTS.RULE_TYPES.REPLACE:
        return (
          <ReplaceRulePair
            pair={pair}
            pairIndex={pairIndex}
            helperFunctions={helperFunctions}
            ruleDetails={props.currentlySelectedRuleConfig}
            isInputDisabled={isInputDisabled}
          />
        );
      case GLOBAL_CONSTANTS.RULE_TYPES.HEADERS:
        return (
          <HeadersRulePair
            pair={pair}
            pairIndex={pairIndex}
            helperFunctions={helperFunctions}
            ruleDetails={props.currentlySelectedRuleConfig}
            isInputDisabled={isInputDisabled}
          />
        );
      case GLOBAL_CONSTANTS.RULE_TYPES.QUERYPARAM:
        return (
          <QueryParamRulePair
            pair={pair}
            pairIndex={pairIndex}
            helperFunctions={helperFunctions}
            ruleDetails={props.currentlySelectedRuleConfig}
            isInputDisabled={isInputDisabled}
          />
        );
      case GLOBAL_CONSTANTS.RULE_TYPES.SCRIPT:
        return (
          <ScriptRulePair
            pair={pair}
            pairIndex={pairIndex}
            helperFunctions={helperFunctions}
            ruleDetails={props.currentlySelectedRuleConfig}
            isInputDisabled={isInputDisabled}
          />
        );
      case GLOBAL_CONSTANTS.RULE_TYPES.RESPONSE:
        return (
          <ResponseRulePair
            pair={pair}
            pairIndex={pairIndex}
            helperFunctions={helperFunctions}
            ruleDetails={props.currentlySelectedRuleConfig}
            isInputDisabled={isInputDisabled}
          />
        );
      case GLOBAL_CONSTANTS.RULE_TYPES.USERAGENT:
        return (
          <UserAgentRulePair
            pair={pair}
            pairIndex={pairIndex}
            helperFunctions={helperFunctions}
            ruleDetails={props.currentlySelectedRuleConfig}
            isInputDisabled={isInputDisabled}
          />
        );
      case GLOBAL_CONSTANTS.RULE_TYPES.DELAY:
        return (
          <DelayRulePair
            pair={pair}
            pairIndex={pairIndex}
            helperFunctions={helperFunctions}
            ruleDetails={props.currentlySelectedRuleConfig}
            isInputDisabled={isInputDisabled}
          />
        );

      default:
        break;
    }
  };

  const deletePair = (event, pairIndex) => {
    event && event.preventDefault();
    const copyOfCurrentlySelectedRule = JSON.parse(
      JSON.stringify(currentlySelectedRuleData)
    );
    copyOfCurrentlySelectedRule.pairs.splice(pairIndex, 1);
    setCurrentlySelectedRule(copyOfCurrentlySelectedRule);
  };

  const openFilterModal = (pairIndex) => {
    setRuleFilterActiveWithPairIndex(pairIndex);
    //ANALYTICS
    submitEventUtil(
      GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULE,
      GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.MODIFIED,
      "rule_filter_modal_opened"
    );
  };

  const closeFilterModal = () => {
    setRuleFilterActiveWithPairIndex(false);
    //ANALYTICS
    submitEventUtil(
      GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULE,
      GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.MODIFIED,
      "Rule Filters Modal Closed"
    );
  };

  const getFilterCount = (pairIndex) => {
    return Object.keys(
      currentlySelectedRuleData.pairs[pairIndex].source.filters || {}
    ).length;
  };

  const pushValueToArrayInPair = (event, pairIndex, arrayPath, value) => {
    event && event.preventDefault();
    const copyOfCurrentlySelectedRule = JSON.parse(
      JSON.stringify(currentlySelectedRuleData)
    );
    const targetArray = get(
      copyOfCurrentlySelectedRule.pairs[pairIndex],
      arrayPath
    );
    set(copyOfCurrentlySelectedRule.pairs[pairIndex], arrayPath, [
      ...targetArray,
      value,
    ]);
    setCurrentlySelectedRule(copyOfCurrentlySelectedRule);
  };

  const deleteArrayValueByIndexInPair = (
    event,
    pairIndex,
    arrayPath,
    arrayIndex
  ) => {
    event && event.preventDefault();
    const copyOfCurrentlySelectedRule = JSON.parse(
      JSON.stringify(currentlySelectedRuleData)
    );
    get(copyOfCurrentlySelectedRule.pairs[pairIndex], arrayPath).splice(
      arrayIndex,
      1
    );
    setCurrentlySelectedRule(copyOfCurrentlySelectedRule);
  };

  if (
    currentlySelectedRuleData.pairs &&
    currentlySelectedRuleData.pairs.length === 0
  ) {
    //If there are no pairs, add an empty pair
    addEmptyPair(
      currentlySelectedRuleData,
      props.currentlySelectedRuleConfig,
      dispatch
    );
  }

  return (
    <React.Fragment>
      {currentlySelectedRuleData.pairs
        ? currentlySelectedRuleData.pairs.map((pair, pairIndex) => (
            <Row key={pair.id || pairIndex}>
              <Col
                className="source-destination-pair github-like-border "
                span={24}
              >
                {getPairMarkup(pair, pairIndex)}
              </Col>
            </Row>
          ))
        : null}

      {ruleFilterActiveWithPairIndex !== false ? (
        <Filters
          pairIndex={ruleFilterActiveWithPairIndex}
          closeModal={closeFilterModal}
          modifyPairAtGivenPath={modifyPairAtGivenPath}
          isInputDisabled={isInputDisabled}
        />
      ) : null}
    </React.Fragment>
  );
};

export default RulePairs;
