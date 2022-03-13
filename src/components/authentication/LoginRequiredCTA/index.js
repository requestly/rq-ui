import React, { useCallback, useContext, useEffect } from "react";
import ProCard from "@ant-design/pro-card";
import { Row, Col, Button, Space } from "antd";
//CONSTANTS
import APP_CONSTANTS from "../../../config/constants";
//STORE
import { store } from "../../../store";
import { getToggleActiveModalActionObject } from "../../../store/action-objects";
import Jumbotron from "components/bootstrap-legacy/jumbotron";
import { useNavigate } from "react-router-dom";
import PATHS from "config/constants/sub/paths";

const { ACTION_LABELS: AUTH_ACTION_LABELS } = APP_CONSTANTS.AUTH;

const LoginRequiredCTA = ({ src, hardRedirect }) => {
  const navigate = useNavigate();
  //Global State
  const globalState = useContext(store);
  const { dispatch } = globalState;

  const handleLoginButtonOnClick = (e) => {
    if (hardRedirect) {
      navigate(PATHS.AUTH.SIGN_IN.ABSOLUTE);
      return;
    }
    dispatch(
      getToggleActiveModalActionObject("authModal", true, {
        redirectURL: window.location.href,
        authMode: AUTH_ACTION_LABELS.LOG_IN,
        src: src,
      })
    );
  };

  const stableHandleLoginButtonOnClick = useCallback(handleLoginButtonOnClick, [
    dispatch,
    hardRedirect,
    navigate,
    src,
  ]);

  const handleSignUpButtonOnClick = (e) => {
    if (hardRedirect) {
      navigate(PATHS.AUTH.SIGN_UP.ABSOLUTE);
      return;
    }
    dispatch(
      getToggleActiveModalActionObject("authModal", true, {
        redirectURL: window.location.href,
        authMode: AUTH_ACTION_LABELS.SIGN_UP,
        src: src,
      })
    );
  };

  useEffect(() => {
    if (!hardRedirect) stableHandleLoginButtonOnClick();
  }, [hardRedirect, stableHandleLoginButtonOnClick]);

  return (
    <React.Fragment>
      <ProCard className="primary-card github-like-border">
        <Row style={{ textAlign: "center" }} align="center">
          <Col span={24}>
            <Jumbotron
              style={{ background: "transparent" }}
              className="text-center"
            >
              <h1 className="display-3">{"You need to login first!"}</h1>
              <p className="lead">
                {
                  "Please make sure you're logged in to your account before accessing this page"
                }{" "}
              </p>

              <Space>
                <Button type="primary" onClick={handleLoginButtonOnClick}>
                  Login
                </Button>
                <Button type="primary" onClick={handleSignUpButtonOnClick}>
                  Sign up
                </Button>
              </Space>
            </Jumbotron>
          </Col>
        </Row>
      </ProCard>
    </React.Fragment>
  );
};

export default LoginRequiredCTA;
