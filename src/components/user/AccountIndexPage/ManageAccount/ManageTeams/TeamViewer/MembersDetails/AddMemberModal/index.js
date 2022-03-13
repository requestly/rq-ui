import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "utils/Toast.js";
import { CardBody } from "reactstrap";
import { Checkbox } from "antd";
import { Modal, Button, Row, Col } from "antd";
import { MailOutlined } from "@ant-design/icons";
import isEmail from "validator/lib/isEmail";
import { ReactMultiEmail, isEmail as validateEmail } from "react-multi-email";
import "react-multi-email/style.css";
// Firebase
import { getFunctions, httpsCallable } from "firebase/functions";
// Sub Components
import InviteMemberModal from "./InviteMemberModal";
// ANALYTICS
import { submitEventUtil } from "../../../../../../../../utils/AnalyticsUtils";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";

const TRACKING = GLOBAL_CONSTANTS.GA_EVENTS;

const AddMemberModal = ({ isOpen, toggleModal, teamId, callback }) => {
  //Component State
  const [userEmail, setUserEmail] = useState([]);
  const [makeUserAdmin, setMakeUserAdmin] = useState(false);
  const [isInviteEmailModalActive, setIsInviteEmailModalActive] = useState(
    false
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [unsuccessfulUserAdditions, setUnsuccessfulUserAdditions] = useState(
    []
  );

  useEffect(() => {
    //Cleaning Up state
    return () => setUserEmail([]);
  }, []);

  const toggleInviteEmailModal = () => {
    setIsInviteEmailModalActive(!isInviteEmailModalActive);
    toggleModal();
  };

  const addMember = async () => {
    if (!userEmail || userEmail.length === 0) {
      toast.warn(`Invalid Email`);
      return;
    }
    for (const email of userEmail) {
      if (!isEmail(email)) {
        toast.warn(`${email} is not a valid email`);

        //Analytics
        submitEventUtil(
          TRACKING.CATEGORIES.TEAMS,
          TRACKING.ACTIONS.ERROR,
          `Email entered is not Valid`
        );
        return;
      }
    }

    const functions = getFunctions();
    const addUserToTeam = httpsCallable(functions, "addUserToTeam");
    const teamAdditionNotify = httpsCallable(functions, "teamAdditionNotify");

    // For loading icon
    setIsProcessing(true);

    await addUserToTeam({
      teamId: teamId,
      email: userEmail,
      isAdmin: makeUserAdmin,
    })
      .then((res) => {
        if (res.data.success) {
          toast.success("Users added successfully");
          callback && callback();
          //Analytics
          submitEventUtil(
            TRACKING.CATEGORIES.TEAMS,
            TRACKING.ACTIONS.FORM_SUBMITTED,
            `Successfully added member in team`
          );
          setIsProcessing(false);
          toggleModal();
        }
      })
      .catch((err) => {
        if (err.message === "user-not-found") {
          const invalidEmails = JSON.parse(JSON.stringify(err)).details;
          // toast.warn(`${email} does not have a requestly account`);
          callback && callback();
          setUnsuccessfulUserAdditions((prevUsers) => [...invalidEmails]);
          setIsInviteEmailModalActive(true);
          // toggleModal();
          //Analytics
          submitEventUtil(
            TRACKING.CATEGORIES.TEAMS,
            TRACKING.ACTIONS.ERROR,
            `Add member User Not found error`
          );
          setIsProcessing(false);
        } else if (err.message === "user-already-exists") {
          // toast.warn(`${email} already has access to the team`);
          // toggleModal();

          //Analytics
          submitEventUtil(
            TRACKING.CATEGORIES.TEAMS,
            TRACKING.ACTIONS.ERROR,
            `User already has access to the team`
          );
        } else if (err.message === "user-not-admin") {
          toast.warn("Opps! Make sure you are an admin");
        } else {
          toast.warn(`Trouble adding users`);
          //Analytics
          submitEventUtil(
            TRACKING.CATEGORIES.TEAMS,
            TRACKING.ACTIONS.ERROR,
            `Trouble adding user`
          );
        }
      })
      .finally(() => {
        teamAdditionNotify({
          teamId,
          userEmails: userEmail,
        });

        // if (!isProcessing) {
        //   toggleModal();
        // }
      });
  };

  return (
    <>
      <Modal
        style={{ marginTop: "200px" }}
        visible={isOpen}
        onCancel={toggleModal}
        footer={null}
        title="Add Team Member"
      >
        <div>
          <CardBody>
            <Row>
              <Col span={24}>
                <ReactMultiEmail
                  placeholder="Email Address"
                  type="email"
                  value={userEmail}
                  onChange={(emails) => {
                    setUserEmail(emails);
                  }}
                  validateEmail={(email) => {
                    return validateEmail(email);
                  }}
                  getLabel={(email, index, removeEmail) => {
                    return (
                      <div data-tag key={index}>
                        {email}
                        <span
                          data-tag-handle
                          onClick={() => removeEmail(index)}
                        >
                          ×
                        </span>
                      </div>
                    );
                  }}
                  addonBefore={<MailOutlined />}
                />
              </Col>
            </Row>

            <Row style={{ marginTop: "4%", marginBottom: "4%" }}>
              <Col span={24} align="right">
                <Checkbox
                  checked={makeUserAdmin}
                  onChange={(e) => {
                    setMakeUserAdmin(!makeUserAdmin);

                    //Analytics
                    submitEventUtil(
                      TRACKING.CATEGORIES.TEAMS,
                      TRACKING.ACTIONS.WORKFLOW_STARTED,
                      `Check for Admin access to Team else made admin`
                    );
                  }}
                >
                  Grant Admin Access
                </Checkbox>
              </Col>
            </Row>
          </CardBody>
        </div>
        <div style={{ display: "flex", flexDirection: "row-reverse", gap: 8 }}>
          <Button
            type="primary"
            onClick={() => addMember()}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span>
                <FaSpinner className="icon-spin" /> Adding Member
              </span>
            ) : (
              <span>Add Member</span>
            )}
          </Button>
          <Button
            data-dismiss="modal"
            type="secondary"
            onClick={toggleModal}
            disabled={isProcessing}
          >
            Close
          </Button>
        </div>
      </Modal>

      {isInviteEmailModalActive ? (
        <InviteMemberModal
          isOpen={isInviteEmailModalActive}
          toggleModal={toggleInviteEmailModal}
          emails={unsuccessfulUserAdditions}
          teamId={teamId}
          isAdmin={makeUserAdmin}
        />
      ) : null}
    </>
  );
};

export default AddMemberModal;
