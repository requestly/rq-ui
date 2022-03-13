import React, { useState } from "react";
import { Row, Col, Tooltip, AutoComplete } from "antd";
import { InfoCircleFilled } from "@ant-design/icons";

//CONSTANTS
import APP_CONSTANTS from "config/constants";
const ResponseStatusCodeRow = ({
  rowIndex,
  pair,
  pairIndex,
  helperFunctions,
  ruleDetails,
  isInputDisabled,
}) => {
  const { modifyPairAtGivenPath } = helperFunctions;
  const [statusCode, setStatusCode] = useState(pair.response.statusCode);
  return (
    <React.Fragment key={rowIndex}>
      <Row
        className="margin-top-one"
        key={rowIndex}
        span={12}
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Col span={4}>
          <span>Response Status Code</span>
        </Col>
        <Col span={4}>
          <AutoComplete
            style={{ width: "95%" }}
            disabled={isInputDisabled}
            defaultValue={statusCode}
            options={APP_CONSTANTS.STATUS_CODE}
            placeholder="Enter Status Code"
            onChange={(value) => {
              modifyPairAtGivenPath(
                null,
                pairIndex,
                "response.statusCode",
                value
              );
              setStatusCode(value);
            }}
            filterOption={(inputValue, option) => {
              if (option.value) {
                return option.value.includes(inputValue);
              }
            }}
          />
        </Col>
        <Col>
          <Tooltip
            title="Returns original code if left empty"
            placement="rightBottom"
          >
            <InfoCircleFilled />
          </Tooltip>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ResponseStatusCodeRow;
