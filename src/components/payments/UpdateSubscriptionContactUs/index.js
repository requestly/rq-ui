import ProCard from "@ant-design/pro-card";
import Jumbotron from "components/bootstrap-legacy/jumbotron";
import React from "react";
import { CardBody } from "reactstrap";
import { Row, Col, Card } from "reactstrap";
import { Typography } from "antd";
// CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import { Link } from "react-router-dom";
import PATHS from "config/constants/sub/paths";
import { CaretLeftOutlined } from "@ant-design/icons";

const UpdateSubscriptionContactUs = () => {
  return (
    <React.Fragment>
      <ProCard className="primary-card github-like-border" title={null}>
        <Row>
          <Col align="center">
            <Card className="shadow">
              <CardBody>
                <Row>
                  <Col lg="12" md="12" className="text-center">
                    <Jumbotron
                      style={{ background: "transparent" }}
                      className="text-center"
                    >
                      <p className="lead">
                        For subscription updates, cancellations, or refunds,
                        please write to us at{" "}
                        <a
                          href={`mailto:${GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL}`}
                        >
                          {GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL}
                        </a>{" "}
                        and we'll revert you within 4-5 hours.
                      </p>
                    </Jumbotron>
                  </Col>
                </Row>
                <Row style={{ marginTop: "3em" }}>
                  <Col lg="12" md="12" className="text-center">
                    <Jumbotron
                      style={{ background: "transparent" }}
                      className="text-center"
                    >
                      <p className="lead">
                        <Link
                          to={PATHS.RULES.ABSOLUTE}
                          component={Typography.Link}
                        >
                          <CaretLeftOutlined /> Back to Dashboard
                        </Link>
                      </p>
                    </Jumbotron>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </ProCard>
    </React.Fragment>
  );
};

export default UpdateSubscriptionContactUs;
