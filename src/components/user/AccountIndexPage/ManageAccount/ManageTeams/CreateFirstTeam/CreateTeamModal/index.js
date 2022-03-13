import React, { useState } from "react";
import { Modal, Button, Row, Col, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "utils/Toast.js";
// Icons
import { FaSpinner } from "react-icons/fa";
import isEmpty from "is-empty";
// Firebase
import { getFunctions, httpsCallable } from "firebase/functions";
// Utilities
import { redirectToTeam } from "../../../../../../../utils/RedirectionUtils";
// ANALYTICS
import { submitEventUtil } from "../../../../../../../utils/AnalyticsUtils";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";

const TRACKING = GLOBAL_CONSTANTS.GA_EVENTS;

const CreateTeamModal = ({ isOpen, handleToggleModal }) => {
  const navigate = useNavigate();
  // Component State
  const [newTeamName, setNewTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateNewTeamOnClick = (event) => {
    // Prevent default form submisison
    event && event.preventDefault();
    // Set Loader
    setIsLoading(true);
    // Create New Team
    const functions = getFunctions();
    const createTeam = httpsCallable(functions, "createTeam");
    createTeam({
      teamName: newTeamName,
    })
      .then((response) => {
        toast.info("Team Created");
        const teamId = response.data.teamId;
        setIsLoading(false);
        redirectToTeam(navigate, teamId);

        //Analytics
        submitEventUtil(
          TRACKING.CATEGORIES.TEAMS,
          TRACKING.ACTIONS.CREATED,
          `New Team Created Redirected to New Team Page`,
          { teamName: newTeamName }
        );
      })
      .catch((err) => {
        toast.error("Unable to Create Team");

        //Analytics
        submitEventUtil(
          TRACKING.CATEGORIES.TEAMS,
          TRACKING.ACTIONS.ERROR,
          `Error in creating New Team`,
          { error: err.message }
        );
        // console.log(err.message);
        setIsLoading(false);
      });
  };

  return (
    <Modal
      style={{ marginTop: "200px" }}
      visible={isOpen}
      onCancel={handleToggleModal}
      footer={null}
    >
      <div>
        <h3>Create New Team</h3>
      </div>
      <div>
        <Row
          style={{
            paddingTop: "10px",
            alignItems: "center",
            // justifyContent: "center",
          }}
        >
          <Col>
            <h4>Name your team</h4>
          </Col>
          <Col style={{ fontSize: "0.9em" }} align="right">
            <Input
              type="text"
              placeholder="Team name"
              style={{ textTransform: "capitalize", marginLeft: "90px" }}
              value={newTeamName}
              onChange={(e) => {
                setNewTeamName(e.target.value);

                //Analytics
                submitEventUtil(
                  TRACKING.CATEGORIES.TEAMS,
                  TRACKING.ACTIONS.WORKFLOW_STARTED,
                  `Name for New Team entered by user`
                );
              }}
            />
          </Col>
        </Row>
      </div>
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "row-reverse",
        }}
      >
        <Button
          type="primary"
          style={{ marginLeft: "10px" }}
          disabled={isEmpty(newTeamName) || isLoading}
          onClick={handleCreateNewTeamOnClick}
        >
          {isLoading ? (
            <FaSpinner className="icon-spin" />
          ) : (
            <span>Create Team</span>
          )}
        </Button>
        <Button
          type="secondary"
          data-dismiss="modal"
          onClick={handleToggleModal}
        >
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default CreateTeamModal;
