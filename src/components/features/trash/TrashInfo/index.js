import React from "react";
import { Row, Col, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
//UTILS
import { redirectToRules } from "../../../../utils/RedirectionUtils";
//CONSTANTS
import ProCard from "@ant-design/pro-card";
import Jumbotron from "components/bootstrap-legacy/jumbotron";

const TrashInfo = ({ error }) => {
  const navigate = useNavigate();
  return (
    <ProCard className="primary-card github-like-border">
      <Row>
        <Col span={24} style={{ textAlign: "center" }}>
          <Jumbotron
            style={{ background: "transparent" }}
            className="text-center"
          >
            <h1 className="display-3">Recover rules you have deleted before</h1>
            <p className="lead">
              {error
                ? "Sorry we couldn't load the rules, please refresh or try again later"
                : "Here you will see list of all the rules you have deleted previously while using Requestly."}
            </p>
            <Space>
              <Button type="primary" onClick={() => redirectToRules(navigate)}>
                Go to Rules
              </Button>
            </Space>
          </Jumbotron>
        </Col>
      </Row>
    </ProCard>
  );
};

export default TrashInfo;
