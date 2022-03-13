import { Modal, Steps } from "antd";
import React from "react";
import CertsInstructions from "./common/Certs";
import CompleteStep from "./common/Complete";
import ProxyInstructions from "./common/Proxy";

const SystemWideInstructionModal = ({
  isVisible,
  handleTroubleshoot,
  handleCancel,
}) => {
  return (
    <>
      <Modal
        title="Steps to setup System Wide Proxy"
        visible={isVisible}
        onOk={handleTroubleshoot}
        okText="Troubleshoot"
        onCancel={handleCancel}
        cancelText="Close"
        width="50%"
      >
        <Steps direction="vertical" current={1}>
          <Steps.Step
            title="Install & Trust Certs"
            status="process"
            description={<CertsInstructions />}
          />
          <Steps.Step
            title="Setup Proxy"
            status="process"
            description={<ProxyInstructions />}
          />
          <Steps.Step
            title="All Set to go"
            status="process"
            description={<CompleteStep />}
          />
        </Steps>
      </Modal>
    </>
  );
};

export default SystemWideInstructionModal;
