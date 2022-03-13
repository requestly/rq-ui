import React, { useContext } from "react";
import { Row, Col, Button, Space } from "antd";
import ProCard from "@ant-design/pro-card";
import { store } from "store";

//CONSTANTS
import APP_CONSTANTS from "../../../config/constants";
import { getToggleActiveModalActionObject } from "store/action-objects";
import { useNavigate } from "react-router-dom";
import Jumbotron from "components/bootstrap-legacy/jumbotron";

const LoginCTA = ({ heading, content, cbUrl }) => {
  //Global State
  const globalState = useContext(store);
  const { dispatch } = globalState;

  const navigate = useNavigate();

  const promptUserToLogIn = () => {
    dispatch(
      getToggleActiveModalActionObject("authModal", true, {
        redirectURL: window.location.href,
        src: APP_CONSTANTS.FEATURES.RULES,
        callback: () => {
          navigate(cbUrl);
        },
      })
    );
  };

  return (
    <>
      <ProCard className="primary-card github-like-border">
        <Row style={{ textAlign: "center" }} align="center">
          <Col span={24}>
            <Jumbotron
              style={{ background: "transparent" }}
              className="text-center"
            >
              <h1 className="display-3">{heading}</h1>
              <p className="lead">{content}</p>

              <Space>
                <Button type="primary" onClick={promptUserToLogIn}>
                  Login
                </Button>
              </Space>
            </Jumbotron>
          </Col>
        </Row>
      </ProCard>
    </>
  );
};

export default LoginCTA;
