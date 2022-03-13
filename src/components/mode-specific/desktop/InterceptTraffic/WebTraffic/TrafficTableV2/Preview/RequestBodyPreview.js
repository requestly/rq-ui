import { Button, Tag } from "antd";
import { useEffect, useState } from "react";
import _ from "lodash";

import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import { toast } from "utils/Toast";

import {
  createResponseRule,
  updateResponseRule,
} from "../../../../../../features/rules/RuleBuilder/actions/utils";
import AppliedRules from "../Tables/columns/AppliedRules";
import JsonPreview from "./JsonPreview";

const json_content_types = ["application/json"];

const RequestBodyPreview = ({
  data,
  type,
  url,
  actions,
  log_id,
  upsertRequestAction,
}) => {
  // Making it always true for now, as jsoneditor doesn't support dynamic onEditable
  // https://github.com/josdejong/jsoneditor/issues/1386
  const [updateAllowed, setUpdateAllowed] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [currentData, setCurrentData] = useState(data);

  const filter_response_actions = () => {
    return actions.filter(
      (action) => action.rule_type === GLOBAL_CONSTANTS.RULE_TYPES.RESPONSE
    );
  };

  const createResponseAction = (rule_id) => {
    let action = {
      rule_type: GLOBAL_CONSTANTS.RULE_TYPES.RESPONSE,
      rule_id: rule_id,
      // No need to add rest of the action
    };
    return action;
  };

  const saveModifications = () => {
    const response_actions = filter_response_actions(actions);

    if (response_actions.length === 0) {
      const rule = createResponseRule(url, currentData);
      upsertRequestAction(log_id, createResponseAction(rule.id));
      toast.success("Rule Created Successfully");
    } else {
      updateResponseRule(response_actions[0].rule_id, url, currentData);
      toast.success("Rule Modified Successfully");
    }
    // setUpdateAllowed(false);
  };

  const cancelModifications = () => {
    setCurrentData(data);
    // setUpdateAllowed(false);
  };

  useEffect(() => {
    // This is not working properly when we manually revert currentData to data
    if (_.isEqual(data, currentData)) {
      setIsUpdated(false);
    } else {
      setIsUpdated(true);
    }
  }, [data, currentData]);

  const renderAppliedRules = () => {
    const response_actions = filter_response_actions(actions);

    if (response_actions && response_actions.length > 0) {
      return (
        <Tag color="green">
          Modified By&nbsp;
          <AppliedRules actions={filter_response_actions(actions)} />
        </Tag>
      );
    }

    return null;
  };

  const renderUpdateButtons = () => {
    let buttons = null;

    if (updateAllowed) {
      buttons = (
        <>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            disabled={!isUpdated || !isValid}
            onClick={() => {
              saveModifications(false);
            }}
          >
            Save
          </Button>
          <Button
            type="danger"
            style={{ marginRight: 8 }}
            onClick={() => {
              cancelModifications();
            }}
          >
            Cancel
          </Button>
        </>
      );
    } else {
      buttons = (
        <Button
          type="primary"
          onClick={() => {
            setUpdateAllowed(true);
          }}
          style={{ marginRight: 8 }}
        >
          Modify Response
        </Button>
      );
    }

    return (
      <div style={{ position: "absolute", bottom: 20 }}>
        {buttons}
        {renderAppliedRules()}
      </div>
    );
  };

  if (!data) {
    return <h3>Preview not available</h3>;
  }

  if (json_content_types.indexOf(type) >= 0) {
    return (
      <>
        {renderUpdateButtons()}
        <JsonPreview
          data={currentData}
          updateAllowed={updateAllowed}
          setCurrentData={setCurrentData}
          setIsValid={setIsValid}
        />
        {renderUpdateButtons()}
      </>
    );
  }

  return <h3>Preview not available</h3>;
};

export default RequestBodyPreview;
