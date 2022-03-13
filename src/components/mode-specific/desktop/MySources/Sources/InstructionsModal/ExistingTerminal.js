import { Modal, Steps, Button, Tooltip, Typography } from "antd";
import React, { useContext, useState } from "react";
import { CopyOutlined, CheckCircleFilled } from "@ant-design/icons";
import { store } from "../../../../../../store";
import { getDesktopSpecificDetails } from "../../../../../../utils/GlobalStoreUtils";

const { Title } = Typography;

const TerminalCommand = ({ helperServerPort }) => {
  const command = `. <(curl -sS localhost:${helperServerPort}/tpsetup)`;
  const [copyClicked, setCopyClicked] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
      <Title strong level={4} style={{ margin: 0 }}>
        <code
          style={{
            textAlign: "center",
            alignSelf: "center",
            userSelect: "all",
          }}
        >
          {command}
        </code>
      </Title>
      <Tooltip
        title={copyClicked ? "copied!" : "copy command"}
        color={copyClicked ? "green" : ""}
      >
        <Button
          type="secondary"
          icon={
            copyClicked ? (
              <CheckCircleFilled
                style={{ color: "green", fontSize: "0.9rem" }}
              />
            ) : (
              <CopyOutlined style={{ fontSize: "0.9rem" }} />
            )
          }
          style={{ margin: 0 }}
          size={"small"}
          onClick={() => {
            navigator.clipboard.writeText(command);
            setCopyClicked(true);
            setTimeout(() => setCopyClicked(false), 2000); // hide the flag after 2 seconds
          }}
        ></Button>
      </Tooltip>
    </div>
  );
};

const ExistingTerminalInstructionModal = ({ isVisible, handleCancel }) => {
  const globalState = useContext(store);
  const { state } = globalState;
  const desktopSpecificDetails = getDesktopSpecificDetails(state);
  const { helperServerPort } = desktopSpecificDetails;
  return (
    <>
      <Modal
        title="Steps to setup Terminal Proxy"
        visible={isVisible}
        onCancel={handleCancel}
        onOk={handleCancel}
        cancelText="Close"
        width="50%"
      >
        <Steps direction="vertical" current={1}>
          <Steps.Step
            title="Run the command below in your terminal"
            status="process"
            description={
              <TerminalCommand helperServerPort={helperServerPort} />
            }
          />
        </Steps>
      </Modal>
    </>
  );
};

export default ExistingTerminalInstructionModal;
