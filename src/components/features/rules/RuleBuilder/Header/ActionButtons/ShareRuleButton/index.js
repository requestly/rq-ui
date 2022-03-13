import React from "react";
import { Button } from "antd";
import { getModeData } from "../../../actions";
//Constants
import APP_CONSTANTS from "../../../../../../../config/constants";
import { UsergroupAddOutlined } from "@ant-design/icons";

const ShareRuleButton = (props) => {
  //Constants
  const { MODE } = getModeData(props.location);
  return (
    <>
      {MODE === APP_CONSTANTS.RULE_EDITOR_CONFIG.MODES.EDIT ? (
        <Button
          className="btn-icon btn-3 mr-lg-4 my-3 my-lg-0 my-md-0 my-sm-0"
          color="primary"
          type="secondary"
          onClick={props.shareBtnClickHandler}
          icon={<UsergroupAddOutlined />}
        >
          Share Rule
        </Button>
      ) : null}
    </>
  );
};

export default ShareRuleButton;
