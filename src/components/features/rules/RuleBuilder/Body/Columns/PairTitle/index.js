import React from "react";
import { Button } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

import { Col } from "reactstrap";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";

const PairTitle = (props) => {
  const { currentlySelectedRuleConfig } = props;
  return (
    <Col xl="10" lg="11" md="11" sm="10" xs="9">
      <span>{currentlySelectedRuleConfig.PAIR_CONFIG.TITLE}</span>
      {currentlySelectedRuleConfig.TYPE ===
      GLOBAL_CONSTANTS.RULE_TYPES.RESPONSE ? (
        <Button
          icon={<QuestionCircleOutlined />}
          type="link"
          size="small"
          href="https://docs.requestly.io/using-rules/modify-ajax-response-rule"
          target="_blank"
        />
      ) : null}
    </Col>
  );
};

export default PairTitle;
