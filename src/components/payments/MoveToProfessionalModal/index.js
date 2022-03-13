import React, { useState } from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { getFunctions, httpsCallable } from "firebase/functions";
// Utils
import { toast } from "utils/Toast.js";

const MoveToProfessionalModal = ({ isOpen, toggle, dontRefreshPage }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleError = () => {
    setConfirmLoading(false);

    toast.error(
      "An unexpected error occurred. Please write to us at contact@requestly.io"
    );
  };

  const handleSuccess = () => {
    if (!dontRefreshPage) {
      toast.success("Upgrade successful");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      toast.success("Please save work & refresh the page!");
    }

    toggle();
  };

  const handleOk = () => {
    setConfirmLoading(true);

    const functions = getFunctions();
    const requestUpgrade = httpsCallable(functions, "upgradeToProfessional");

    requestUpgrade()
      .then((response) => {
        if (response.data.success) {
          handleSuccess();
        } else {
          throw Error("Failed!");
        }
      })
      .catch((err) => {
        handleError();
      });
  };

  return (
    <>
      <Modal
        title="🚀 Upgrade to Professional Plan"
        visible={isOpen}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={toggle}
        icon={<ExclamationCircleOutlined />}
      >
        <p>
          You'll be upgraded to Requestly Professional plan. This process might
          take a few seconds.
        </p>
      </Modal>
    </>
  );
};

export default MoveToProfessionalModal;
