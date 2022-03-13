import React from "react";
import { Row, Col, Input, Radio, Typography, Space } from "antd";

const ActionHeader = ({
  handleOnSearchChange,
  groupByParameter,
  handleOnGroupParameterChange,
}) => {
  return (
    <Row align="middle" style={{ marginBottom: 6, marginTop: 6, padding: 3 }}>
      <Space direction="horizontal">
        <Col>
          <Typography.Text strong>Group by:</Typography.Text>
        </Col>
        <Col>
          <Radio.Group
            onChange={handleOnGroupParameterChange}
            value={groupByParameter}
          >
            <Radio value={"app"}>App Name</Radio>
            <Radio value={"domain"}>Domain</Radio>
            <Radio value={"none"}>None</Radio>
          </Radio.Group>
        </Col>
        <Col>
          <Input.Search
            placeholder="Input Search Keyword"
            onChange={handleOnSearchChange}
            style={{ width: 300 }}
          />
        </Col>
      </Space>
    </Row>
  );
};

export default ActionHeader;
