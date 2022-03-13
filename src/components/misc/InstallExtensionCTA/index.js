import React from "react";
import { Row, Col, Button, Space, Typography } from "antd";
import ProCard from "@ant-design/pro-card";
import { Alert } from "antd";

// import { Link } from "react-router-dom";
//CONSTANTS
import APP_CONSTANTS from "../../../config/constants";
import Jumbotron from "components/bootstrap-legacy/jumbotron";

const { Link: AntLink } = Typography;

const InstallExtensionCTA = ({
  heading = "Get Started",
  content = "Please install Requestly browser extension to start intercepting HTTP requests.",
}) => {
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
              <p className="lead">
                {content}{" "}
                <AntLink
                  target="_blank"
                  rel="noopener noreferrer"
                  href={APP_CONSTANTS.LINKS.REQUESTLY_DOCS}
                >
                  Read Docs
                </AntLink>
              </p>

              <Space>
                <Button
                  type="primary"
                  onClick={() =>
                    window.open(APP_CONSTANTS.LINKS.CHROME_EXTENSION)
                  }
                >
                  Get for Chrome
                </Button>
                <Button
                  type="primary"
                  onClick={() =>
                    window.open(APP_CONSTANTS.LINKS.FIREFOX_EXTENSION)
                  }
                >
                  Get for Firefox
                </Button>
                <Button
                  type="primary"
                  onClick={() =>
                    window.open(APP_CONSTANTS.LINKS.EDGE_EXTENSION)
                  }
                >
                  Get for Edge
                </Button>
              </Space>
              <Row style={{ textAlign: "center" }} align="center">
                <Alert
                  message={
                    <p style={{ marginBottom: "0px" }}>
                      Already got Requestly installed and still seeing this
                      message ? Read our{" "}
                      <AntLink
                        target="_blank"
                        rel="noopener noreferrer"
                        href={
                          APP_CONSTANTS.LINKS
                            .REQUESTLY_EXTENSION_TROUBLESHOOTING
                        }
                      >
                        Troubleshooting guide
                      </AntLink>
                    </p>
                  }
                  type="info"
                  showIcon
                  style={{ marginTop: "1rem" }}
                />
              </Row>
            </Jumbotron>
          </Col>
        </Row>
      </ProCard>
    </>
  );
};

export default InstallExtensionCTA;
