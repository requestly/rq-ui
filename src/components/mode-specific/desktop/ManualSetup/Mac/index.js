import React, { useContext } from "react";
import { Row, Col, Card, Typography, Button } from "antd";
import { CardBody } from "reactstrap";
// STORE
import { store } from "../../../../../store";
// UTILS
import { getDesktopSpecificDetails } from "../../../../../utils/GlobalStoreUtils";
// ACTIONS
import { saveRootCert } from "../../../../../actions/DesktopActions";
import { submitEventUtil } from "../../../../../utils/AnalyticsUtils";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import Jumbotron from "components/bootstrap-legacy/jumbotron";

const { Title } = Typography;

const MacProxySettings = () => {
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const desktopSpecificDetails = getDesktopSpecificDetails(state);

  const {
    isBackgroundProcessActive,
    isProxyServerRunning,
    proxyPort,
  } = desktopSpecificDetails;

  submitEventUtil(
    GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.DESKTOP_APP,
    GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.MANUAL_SETUP_MAC,
    "Manual Setup Mac"
  );

  if (!isBackgroundProcessActive || !isProxyServerRunning) {
    return (
      <React.Fragment>
        <Row>
          <Col>
            <Card className="shadow">
              <CardBody>
                <Jumbotron
                  style={{ background: "transparent" }}
                  className="text-center"
                >
                  <p>
                    Proxy server is not running. Please restart the app or
                    report to us if issue persists.
                  </p>
                </Jumbotron>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Row>
        <Col lg="12" style={{ textAlign: "center", width: "100%" }}>
          <Title level={2}>Setting up system proxy</Title>
        </Col>
      </Row>
      <Row>
        <Col>
          <Title level={5}>
            Requestly requires your applications to send their network traffic
            through the its local proxy server before going to their
            destination.
          </Title>
          <p>
            The proxy server you set globally will be used by Safari, Google
            Chrome, and other applications that respect your system proxy
            settings. Some applications, including Mozilla Firefox, can have
            their own custom proxy settings independent from your system
            settings.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Title level={5}>
            Set your proxy settings to host 127.0.0.1 and port {proxyPort}{" "}
            (http://127.0.0.1:{proxyPort})
          </Title>
          <p>
            Make sure to set HTTPS proxy, if you want to intercept secure
            traffic.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          {/* <Paragraph className="text-center">
            Click{" "}
            <Text type="link" onClick={() => saveRootCert()}>
              here
            </Text>{" "}
            to save certificate to your disk.
          </Paragraph> */}
          <Button type="primary" onClick={() => saveRootCert()}>
            Save Certificate
          </Button>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default MacProxySettings;
