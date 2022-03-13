import React, { useEffect, useState, useContext, useCallback } from "react";
import { Col } from "antd";
import { Modal } from "antd";
import CreatableReactSelect from "react-select/creatable";
import { toast } from "utils/Toast.js";
import { store } from "../../../../store";
//EXTERNALS
import { StorageService } from "../../../../init";
//UTILS
import {
  submitEventUtil,
  trackRQLastActivity,
} from "../../../../utils/AnalyticsUtils";
import * as GlobalStoreUtils from "../../../../utils/GlobalStoreUtils";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
//REDUCER ACTION OBJECTS
import {
  getUpdateGroupsActionObject,
  getUpdateCurrentlySelectedRuleDataActionObject,
  getUpdateRefreshPendingStatusActionObject,
} from "../../../../store/action-objects";
//ACTIONS
import { updateGroupOfSelectedRules, createNewGroup } from "./actions";
import { unselectAllRules } from "../actions";
import { trackGroupChangedEvent } from "utils/analytics/rules/groups/group_changed";

const ChangeRuleGroupModal = (props) => {
  //Accepted Modes
  //CURRENT_RULE -> To modify single currently selected rule (in the Rule Editor)
  //SELECTED_RULES -> To modify multiple selected rules in Rules List
  const MODE = props.mode;
  const MODES = {};
  MODES.CURRENT_RULE = "CURRENT_RULE";
  MODES.SELECTED_RULES = "SELECTED_RULES";
  //Global State
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const user = GlobalStoreUtils.getUserAuthDetails(state);
  const stableDispatch = useCallback(dispatch, [dispatch]);
  const currentlySelectedRuleData = GlobalStoreUtils.getCurrentlySelectedRuleData(
    state
  );
  const selectedRules = GlobalStoreUtils.getRulesSelection(state);
  const allGroups = GlobalStoreUtils.getAllGroups(state);
  const isRulesListRefreshPending = GlobalStoreUtils.getIsRefreshRulesPending(
    state
  );
  const appMode = GlobalStoreUtils.getAppMode(state);
  //Component State
  const [allOptionsForReactSelect, setAllOptionsForReactSelect] = useState([]);
  const [currentValueForReactSelect, setCurrentValueForReactSelect] = useState(
    []
  );

  const generateOptionsForReactSelect = (groups) => {
    return groups.map((group) => {
      return {
        label: group.name,
        value: group.id,
      };
    });
  };

  const getCurrentValueForReactSelect = (allOptions) => {
    if (MODE === MODES.SELECTED_RULES) {
      return [];
    } else {
      return allOptions.filter(
        (option) => option.value === currentlySelectedRuleData.groupId
      );
    }
  };
  const stableGetCurrentValueForReactSelect = useCallback(
    getCurrentValueForReactSelect,
    [MODE, MODES.SELECTED_RULES, currentlySelectedRuleData.groupId]
  );

  const updateCurrentlySelectedRuleGroup = (newGroupId) => {
    if (MODE === MODES.CURRENT_RULE) {
      const updatedRule = { ...currentlySelectedRuleData, groupId: newGroupId };
      dispatch(getUpdateCurrentlySelectedRuleDataActionObject(updatedRule));
    } else {
      updateGroupOfSelectedRules(appMode, selectedRules, newGroupId, user)
        .then(() => {
          //Unselect all rules
          unselectAllRules(dispatch);
          //Refresh List
          dispatch(
            getUpdateRefreshPendingStatusActionObject(
              "rules",
              !isRulesListRefreshPending
            )
          );
        })
        .catch(() => {
          toast.warn("Please select the rules first", {
            hideProgressBar: true,
          });
        });
    }
  };

  const handleReactSelectOnChange = (newSelectedOption) => {
    newSelectedOption.__isNew__
      ? createNewGroup(
          appMode,
          newSelectedOption.label,
          updateCurrentlySelectedRuleGroup,
          user
        )
      : updateCurrentlySelectedRuleGroup(newSelectedOption.value);
    props.toggle();
  };

  //Analytics
  submitEventUtil(
    GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.GROUP,
    GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.WORKFLOW_STARTED,
    "rules_group_modified"
  );
  trackGroupChangedEvent();

  useEffect(() => {
    StorageService(appMode)
      .getRecords(GLOBAL_CONSTANTS.OBJECT_TYPES.GROUP)
      .then((groups) => {
        stableDispatch(getUpdateGroupsActionObject(groups));
      });
  }, [stableDispatch, currentlySelectedRuleData, appMode]);

  useEffect(() => {
    setAllOptionsForReactSelect(generateOptionsForReactSelect(allGroups));
  }, [allGroups]);
  useEffect(() => {
    setCurrentValueForReactSelect(
      stableGetCurrentValueForReactSelect(allOptionsForReactSelect)
    );
  }, [
    setCurrentValueForReactSelect,
    stableGetCurrentValueForReactSelect,
    allOptionsForReactSelect,
  ]);

  return (
    <Modal
      visible={props.isOpen}
      onCancel={props.toggle}
      footer={null}
      title="Change Group"
    >
      <div className="">
        {/* <Row className="one-padding-bottom  my-auto"> */}
        <Col className="my-auto">
          <span>Select new group</span>
        </Col>
        <br />
        <Col className="my-auto" style={{ fontSize: "0.9em" }}>
          <CreatableReactSelect
            isMulti={false}
            name="select-group"
            options={allOptionsForReactSelect}
            placeholder="Select or Type"
            value={currentValueForReactSelect}
            onChange={handleReactSelectOnChange}
          />
        </Col>
        {/* </Row> */}
      </div>
    </Modal>
  );
};

export default ChangeRuleGroupModal;
