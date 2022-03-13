import { useEffect, useState } from "react";
import AndroidInstructionModal from "./Android";
import SafariInstructionModal from "./Safari";
import SystemWideInstructionModal from "./SystemWide";
import ExistingTerminalInstructionModal from "./ExistingTerminal";

const InstructionsModal = ({ appId, setCurrentApp }) => {
  const [isVisible, setIsVisible] = useState(false);

  const getTroubleshootLink = () => {
    if (appId === "system-wide") {
      return "https://docs.requestly.io/desktop-app/troubleshooting/osx-troubleshooting";
    } else if (appId === "fresh-firefox") {
      return "https://docs.requestly.io/desktop-app/troubleshooting/osx-troubleshooting";
    }

    return "https://docs.requestly.io/";
  };

  const handleTroubleshoot = () => {
    // setIsVisible(false);
    // setCurrentApp(null);
    const link = getTroubleshootLink(appId);

    window.RQ.DESKTOP.SERVICES.IPC.invokeEventInBG("open-external-link", {
      link: link,
    });
  };

  const handleCancel = () => {
    setIsVisible(false);
    setCurrentApp(null);
  };

  useEffect(() => {
    if (appId) {
      setIsVisible(true);
    }
  }, [appId]);

  switch (appId) {
    case "android":
      return (
        <AndroidInstructionModal
          isVisible={isVisible}
          handleTroubleshoot={handleTroubleshoot}
          handleCancel={handleCancel}
        />
      );
    case "system-wide":
      return (
        <SystemWideInstructionModal
          isVisible={isVisible}
          handleTroubleshoot={handleTroubleshoot}
          handleCancel={handleCancel}
        />
      );
    case "fresh-safari":
      return (
        <SafariInstructionModal
          isVisible={isVisible}
          handleTroubleshoot={handleTroubleshoot}
          handleCancel={handleCancel}
        />
      );
    case "existing-terminal":
      return (
        <ExistingTerminalInstructionModal
          isVisible={isVisible}
          handleCancel={handleCancel}
        />
      );
    default:
      return null;
  }
};

export default InstructionsModal;
