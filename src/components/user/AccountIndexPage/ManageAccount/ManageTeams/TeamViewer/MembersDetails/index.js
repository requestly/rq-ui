import React, { useState, useEffect } from "react";
import { Col, Row, Button, Typography } from "antd";
//Firebase
import TeamMembersTable from "./TeamMembersTable";
import { getFunctions, httpsCallable } from "firebase/functions";
// Icons
import { PlusOutlined } from "@ant-design/icons";
// Sub Components
import AddMemberModal from "./AddMemberModal";
// ANALYTICS
import {
  submitEventUtil,
  trackRQLastActivity,
} from "../../../../../../../utils/AnalyticsUtils";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";

const TRACKING = GLOBAL_CONSTANTS.GA_EVENTS;

const MembersDetails = ({ teamId }) => {
  const functions = getFunctions();
  // Component State
  const [isAddMemeberModalActive, setIsAddMemberModalActive] = useState(false);
  const [refreshTeamMembersTable, setRefreshTeamMembersTable] = useState(false);
  const [seats, setSeats] = useState({});
  const [showSeatStatus, setShowSeatStatus] = useState(false);
  // To handle refresh in TeamMembersTable
  const doRefreshTeamMembersTable = () => {
    setRefreshTeamMembersTable(!refreshTeamMembersTable);
  };

  const toggleAddMemberModal = () => {
    setIsAddMemberModalActive(!isAddMemeberModalActive);
  };

  const getTeamBillingUsers = httpsCallable(functions, "getTeamBillingUsers");

  useEffect(() => {
    getTeamBillingUsers({
      teamId,
    })
      .then((res) => {
        const seatsData = res.data;
        if (seatsData.success) {
          setSeats({
            billQuantity: seatsData.billQuantity, // quantity passed to stripe to bill
            actualBillQuantity: seatsData.actualBillQuantity, // total number of users
          });
          setShowSeatStatus(true);
        }
      })
      .catch(() => {
        setShowSeatStatus(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, refreshTeamMembersTable]);

  return (
    <div style={{ marginTop: "30px" }}>
      <Row>
        <Col>
          <h3>Members</h3>
        </Col>
        <Col style={{ margin: "5px 20px 0px auto" }}>
          <Button
            type="primary"
            onClick={() => {
              setIsAddMemberModalActive(true);

              //Analytics
              submitEventUtil(
                TRACKING.CATEGORIES.TEAMS,
                TRACKING.ACTIONS.CLICKED,
                `added_member_in_team`
              );
              trackRQLastActivity("added_member_in_team");
            }}
          >
            <PlusOutlined /> Add Member
          </Button>
        </Col>
      </Row>

      <div style={{ marginTop: "20px" }}>
        <TeamMembersTable
          teamId={teamId}
          refresh={refreshTeamMembersTable}
          callback={() => doRefreshTeamMembersTable()}
        />
      </div>
      <div style={{ margin: "10px", textAlign: "center", fontSize: "0.9rem" }}>
        {showSeatStatus ? (
          <Typography.Text>
            {`You currently have ${seats.actualBillQuantity} active users. Feel free to add more.`}
          </Typography.Text>
        ) : null}
      </div>

      {isAddMemeberModalActive ? (
        <AddMemberModal
          isOpen={isAddMemeberModalActive}
          toggleModal={toggleAddMemberModal}
          teamId={teamId}
          callback={() => doRefreshTeamMembersTable()}
        />
      ) : null}
    </div>
  );
};

export default MembersDetails;
