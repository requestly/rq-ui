import React from "react";
import { Modal } from "antd";
import InstallExtensionCTA from "../../misc/InstallExtensionCTA";
import ExtensionDeactivationMessage from "components/misc/ExtensionDeactivationMessage";

const ExtensionModal = (props) => {
  const { toggle: toggleModal, isOpen, disabled = false } = props;
  return (
    <Modal visible={isOpen} onCancel={toggleModal} footer={null}>
      {disabled ? (
        <ExtensionDeactivationMessage />
      ) : (
        <InstallExtensionCTA
          heading={"Browser Extension Required"}
          content={
            "Please install Requestly Browser Extension to use Marketplace Rules."
          }
        />
      )}
    </Modal>
  );
};

export default ExtensionModal;
