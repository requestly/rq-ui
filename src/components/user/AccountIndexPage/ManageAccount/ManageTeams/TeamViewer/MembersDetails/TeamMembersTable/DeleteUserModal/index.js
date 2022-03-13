import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "utils/Toast.js";
import { Modal, Button } from "antd";
// Firebase
import { getFunctions, httpsCallable } from "firebase/functions";
const DeleteUserModal = ({
  isOpen,
  toggleModal,
  userId,
  teamId,
  isCurrentlyAdmin,
  callbackOnSuccess,
}) => {
  // Component State
  const [showLoader, setShowLoader] = useState(false);

  const doRemoveUser = () => {
    setShowLoader(true);
    const functions = getFunctions();
    const updateTeamUserRole = httpsCallable(functions, "updateTeamUserRole");

    updateTeamUserRole({
      teamId: teamId,
      userId: userId,
      role: "remove",
    })
      .then((res) => {
        toast.info("Member removed");
        callbackOnSuccess && callbackOnSuccess();
        setShowLoader(false);
        toggleModal();
      })
      .catch((err) => {
        toast.error(err.message);
        setShowLoader(false);
        toggleModal();
      });
  };

  return (
    <Modal
      style={{ marginTop: "200px" }}
      visible={isOpen}
      onCancel={toggleModal}
      footer={null}
    >
      <div>
        <h2>Remove Member</h2>
      </div>
      <div>
        <h3>Do you really want to remove this user from the team?</h3>
        <h3>They would no longer be able use your team's subscription</h3>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          marginTop: "20px",
        }}
      >
        <Button
          type="primary"
          onClick={() => doRemoveUser()}
          disabled={showLoader}
        >
          {showLoader ? (
            <span>
              <FaSpinner style={{ marginRight: "5px" }} className="icon-spin" />
              <span>Removing user</span>
            </span>
          ) : (
            "Yes, remove"
          )}
        </Button>
        <Button
          style={{ marginRight: "10px" }}
          type="secondary"
          onClick={toggleModal}
          disabled={showLoader}
        >
          No
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteUserModal;
