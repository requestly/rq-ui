import Jumbotron from "components/bootstrap-legacy/jumbotron";
import React from "react";
import { Card, CardBody, Container, Row, Col } from "reactstrap";

const ErrorCard = (props) => {
  const errorMessage = props.customErrorMessage || "Something went wrong";
  return (
    <>
      {/* Page content */}
      <Container className=" mt--7" fluid>
        {/* Table */}
        <Row>
          <div className=" col">
            <Card className=" shadow">
              <CardBody>
                <Row>
                  <Col
                    lg="12"
                    md="12"
                    xl="12"
                    sm="12"
                    xs="12"
                    className="text-center"
                  >
                    <Jumbotron
                      style={{ background: "transparent" }}
                      className="text-center"
                    >
                      <h1 className="display-3">
                        {/* <FaSpinner className="icon-spin" /> */}
                      </h1>
                      <h5>{errorMessage}</h5>
                    </Jumbotron>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default ErrorCard;
