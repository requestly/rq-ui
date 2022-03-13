import { Alert, Modal, Steps } from "antd";
import React from "react";
import CertsInstructions from "./common/Certs";
import CompleteStep from "./common/Complete";
import ProxyInstructions from "./common/Proxy";

const SafariInstructionModal = ({
  isVisible,
  handleTroubleshoot,
  handleCancel,
}) => {
  return (
    <>
      <Modal
        title="Steps to setup proxy for Safari"
        visible={isVisible}
        onOk={handleTroubleshoot}
        okText="Troubleshoot"
        onCancel={handleCancel}
        cancelText="Close"
        width="50%"
      >
        <Alert
          message="Safari doesn't let you set instance level proxy. For Requestly to work on Safari, you need to place a system wide proxy"
          type="info"
          showIcon
          closable
        />
        <br />
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

export default SafariInstructionModal;
