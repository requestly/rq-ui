import React from "react";
import { Row, Col, Alert } from "antd";
// Sub components
import TrafficTable from "./TrafficTable";
import TrafficTableV2 from "./TrafficTableV2";

const WebTraffic = () => {
  return (
    <React.Fragment>
      <Row>
        <Col span={24}>
          {window?.RQ?.DESKTOP?.VERSION <= "0.0.18-beta" ||
          window?.RQ?.DESKTOP?.VERSION === "1.0" ? (
            <>
              <Row
                style={{
                  paddingTop: "8px",
                  paddingLeft: "24px",
                  paddingRight: "24px",
                }}
              >
                <Col span={24}>
                  <Alert
                    message="Update the App to the latest version to enjoy improvements in network interceptor"
                    type="warning"
                    showIcon
                    closable
                  />
                </Col>
              </Row>
              <TrafficTable />
            </>
          ) : (
            <TrafficTableV2 />
          )}
        </Col>
      </Row>
      <Row style={{ paddingLeft: "24px", paddingRight: "24px" }}>
        <Col span={24}>
          <Alert
            message="Network logger works only when you are on this page."
            type="info"
            showIcon
            closable
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default WebTraffic;
