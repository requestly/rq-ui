import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "antd";
import { getFunctions, httpsCallable } from "firebase/functions";
// Sub Components
import MembersDetails from "./MembersDetails";
import BillingDetails from "./BillingDetails";
import TeamInfo from "./TeamInfo";
// CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";

const TeamViewer = ({ teamId }) => {
  const [isTeamAdmin, setIsTeamAdmin] = useState(false);
  const functions = getFunctions();
  const isTeamAdminFunction = httpsCallable(functions, "isTeamAdmin");

  useEffect(() => {
    isTeamAdminFunction({
      teamId,
    }).then((res) => {
      const response = res.data;
      if (response.success) {
        setIsTeamAdmin(response.isAdmin);
      }
    });
  }, [isTeamAdminFunction, teamId]);

  return (
    <Card>
      <Row>
        <Col>
          <h1>Manage Team</h1>
        </Col>
      </Row>
      <div>
        <TeamInfo teamId={teamId}></TeamInfo>
        <MembersDetails teamId={teamId} />
        {isTeamAdmin ? <BillingDetails teamId={teamId} /> : null}
        <div
          style={{
            fontSize: "0.8125rem",
            textAlign: "center",
            marginTop: "40px",
          }}
          className="fix-dark-mode-color"
        >
          Any questions? Reach our payment support team at{" "}
          <a href={`mailto:${GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL}`}>
            {GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL}
          </a>
        </div>
      </div>
    </Card>
  );
};

export default TeamViewer;
