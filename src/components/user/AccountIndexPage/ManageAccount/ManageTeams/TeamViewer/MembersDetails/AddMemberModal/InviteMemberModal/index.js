import React, { useState } from "react";
import { toast } from "utils/Toast.js";
import { CardBody } from "reactstrap";
import { Modal, Space, Row, Col, Button } from "antd";
// Firebase
import { getFunctions, httpsCallable } from "firebase/functions";
const InviteMemberModal = ({
  isOpen,
  toggleModal,
  teamId,
  emails,
  isAdmin,
}) => {
  // Component State
  const [isProcessing, setIsProcessing] = useState(false);

  const inviteUser = () => {
    setIsProcessing(true);
    const functions = getFunctions();
    const inviteEmailToTeam = httpsCallable(functions, "inviteEmailToTeam");
    inviteEmailToTeam({
      teamId: teamId,
      emails: emails,
      isAdmin: isAdmin,
    })
      .then((res) => {
        const response = res.data;
        if (response.success) {
          toast.info("We've sent them an invite");
        } else {
          toast.error("Opps! Couldn`t send the invite");
        }
        setIsProcessing(false);
        toggleModal();
      })
      .catch((err) => {
        console.log(err.message);
        toast.error("Opps! Couldn`t send the invite");
        setIsProcessing(false);
        toggleModal();
      });
  };

  return (
    <Modal
      className="modal-dialog-centered modal-danger"
      contentClassName="bg-gradient-danger bg-gradient-blue"
      visible={isOpen}
      onCancel={toggleModal}
      footer={null}
      title="Invite email to your team"
    >
      <div className="modal-body">
        <CardBody>
          <div>
            Oops! <strong>{emails.toString()}</strong> does not seem to have a
            Requestly account yet. Do you want to send them a magic invite link
            via email? They will be automatically added to this team upon signup
            using that link.
          </div>
        </CardBody>
      </div>
      <br />
      <Row>
        <Col span={24} align="right">
          <Space>
            <Button
              className="text-white ml-auto"
              color="link"
              data-dismiss="modal"
              type="button"
              onClick={toggleModal}
              disabled={isProcessing}
            >
              No, I'll add them later
            </Button>
            <Button
              className="btn-white"
              color="default"
              onClick={() => inviteUser()}
              loading={isProcessing}
              type="primary"
            >
              Yes, please send
            </Button>
          </Space>
        </Col>
      </Row>
    </Modal>
  );
};

export default InviteMemberModal;
