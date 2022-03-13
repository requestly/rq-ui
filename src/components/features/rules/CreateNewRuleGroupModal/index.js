import React, { useState, useContext } from "react";
import { Col } from "antd";
import { Modal } from "antd";
import CreatableReactSelect from "react-select/creatable";
import { store } from "../../../../store";
//UTILS
import * as GlobalStoreUtils from "../../../../utils/GlobalStoreUtils";
import { submitEventUtil } from "../../../../utils/AnalyticsUtils";
//SERVICES
import { StorageService } from "../../../../init";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
// REDUCER ACTION TYPES
import { getUpdateRefreshPendingStatusActionObject } from "../../../../store/action-objects";
//FUNCTIONS
import { generateObjectId } from "../../../../utils/FormattingHelper";
import { trackGroupCreatedEvent } from "utils/analytics/rules/groups/group_created";
import { generateObjectCreationDate } from "utils/DateTimeUtils";

const CreateNewRuleGroupModal = (props) => {
  //Global State
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const user = GlobalStoreUtils.getUserAuthDetails(state);
  const isRulesListRefreshPending = GlobalStoreUtils.getIsRefreshRulesPending(
    state
  );
  const appMode = GlobalStoreUtils.getAppMode(state);
  //Component State
  const [currentValueForReactSelect, setCurrentValueForReactSelect] = useState(
    []
  );

  const handleReactSelectOnChange = (newSelectedOption) => {
    setCurrentValueForReactSelect(newSelectedOption.label);
    createNewGroup(newSelectedOption.label);
  };

  const createNewGroup = (newGroupName) => {
    const createdBy = user?.details?.profile?.uid || null;
    const currentOwner = user?.details?.profile?.uid || null;
    const lastModifiedBy = user?.details?.profile?.uid || null;
    const newGroupId = `Group_${generateObjectId()}`;
    const newGroup = {
      creationDate: generateObjectCreationDate(),
      description: "",
      id: newGroupId,
      name: newGroupName,
      objectType: GLOBAL_CONSTANTS.OBJECT_TYPES.GROUP,
      status: GLOBAL_CONSTANTS.RULE_STATUS.ACTIVE,
      createdBy,
      currentOwner,
      lastModifiedBy,
    };
    StorageService(appMode)
      .saveRuleOrGroup(newGroup)
      .then(async () => {
        trackGroupCreatedEvent();

        dispatch(
          getUpdateRefreshPendingStatusActionObject(
            "rules",
            !isRulesListRefreshPending
          )
        );
        props.toggle();
      });
  };

  //Analytics
  submitEventUtil(
    GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.GROUP,
    GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.WORKFLOW_STARTED,
    "new_rules_group_created"
  );

  return (
    <Modal
      className="modal-dialog-centered "
      visible={props.isOpen}
      onCancel={props.toggle}
      footer={null}
      title="Create New Group"
    >
      <div className="modal-body  zero-padding-bottom">
        {/* <Row className="one-padding-bottom  my-auto"> */}
        <Col className="my-auto">
          <span>Enter Group Name</span>
        </Col>
        <br />
        <Col className="my-auto" style={{ fontSize: "0.9em" }}>
          <CreatableReactSelect
            isMulti={false}
            name="select-group"
            placeholder="Enter Group Name"
            onChange={handleReactSelectOnChange}
            value={currentValueForReactSelect}
          />
        </Col>
        {/* </Row> */}
      </div>
    </Modal>
  );
};

export default CreateNewRuleGroupModal;
