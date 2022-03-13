import React from "react";
import { Space } from "antd";
//Sub-components
import CreateRuleButton from "./CreateRuleButton";
import CloseButton from "./CloseButton";
import Status from "./Status";
import ShareRuleButton from "./ShareRuleButton";

const ActionButtons = (props) => {
  return (
    <Space>
      <Status location={props.location} />
      <ShareRuleButton
        location={props.location}
        shareBtnClickHandler={props.shareBtnClickHandler}
      />
      <CreateRuleButton location={props.location} />
      <CloseButton />
    </Space>
  );
};

export default ActionButtons;
