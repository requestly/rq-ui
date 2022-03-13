import React from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
//SUB COMPONENTS
import ManageTeams from "../../ManageTeams";

const MyTeams = () => {
  return (
    <React.Fragment>
      {/* Page content */}
      <Card>
        <div>
          <div style={{ textAlign: "center" }}>
            <h1>Requestly Premium for Teams</h1>
          </div>
        </div>
        <h1 style={{ marginLeft: "10px" }}>My Teams</h1>
        <Row className="profile-team">
          <Col>
            <CardBody className="profile-team-body">
              <ManageTeams />
            </CardBody>
          </Col>
        </Row>
      </Card>
    </React.Fragment>
  );
};

export default MyTeams;
