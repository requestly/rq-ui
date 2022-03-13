import React from "react";
import {
  Row,
  Col,
  Input,
  Radio,
  Typography,
  Space,
  Button,
  Tooltip,
} from "antd";
import { DeleteOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { isFeatureCompatible } from "utils/CompatibilityUtils";
import { FEATURES } from "config/constants/compatibility";

const ActionHeader = ({
  handleOnSearchChange,
  groupByParameter,
  handleOnGroupParameterChange,
  clearLogs,
  setIsSSLProxyingModalVisible,
}) => {
  return (
    <Row
      align="middle"
      style={{
        marginBottom: 6,
        marginTop: 6,
        padding: 3,
        paddingLeft: "24px",
        paddingRight: "24px",
      }}
    >
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
        <Col>
          <Button
            type="primary"
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => clearLogs()}
          />
        </Col>
        {isFeatureCompatible(FEATURES.DESKTOP_APP_SSL_PROXYING) ? (
          <Col>
            <Tooltip title="SSL Proxying">
              <Button
                type="primary"
                shape="circle"
                icon={<SafetyCertificateOutlined />}
                onClick={() => setIsSSLProxyingModalVisible(true)}
              />
            </Tooltip>
          </Col>
        ) : null}
      </Space>
    </Row>
  );
};

export default ActionHeader;
