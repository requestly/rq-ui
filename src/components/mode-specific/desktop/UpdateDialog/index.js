import { useContext, useEffect, useState } from "react";
import * as semver from "semver";

import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import APP_CONSTANTS from "config/constants";
import { store } from "../../../../store";
import { getAppMode } from "utils/GlobalStoreUtils";
import BlockingDialog from "./BlockingDialog";
import NonBlockingDialog from "./NonBlockingDialog";

const UpdateDialog = () => {
  const globalState = useContext(store);
  const { state } = globalState;
  const appMode = getAppMode(state);

  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(null);
  const [isUpdateDownloaded, setIsUpdateDownloaded] = useState(false);
  const [updateDetails, setUpdateDetails] = useState({});

  useEffect(() => {
    if (window.RQ && window.RQ && window.RQ.DESKTOP) {
      window.RQ.DESKTOP.SERVICES.IPC.registerEvent(
        "update-downloaded",
        (payload) => {
          console.log(payload);
          setIsUpdateDownloaded(true);
          setUpdateDetails(payload);
        }
      );

      window.RQ.DESKTOP.SERVICES.IPC.registerEvent(
        "download-progress",
        (payload) => {
          console.log(payload);
          // {total: 115783355, delta: 155698, transferred: 155698, percent: 0.13447356055626478, bytesPerSecond: 146746}
          setUpdateProgress(payload);
        }
      );

      window.RQ.DESKTOP.SERVICES.IPC.registerEvent(
        "update-available",
        (payload) => {
          console.log(payload);
          setIsUpdateAvailable(true);
          setUpdateDetails(payload);
        }
      );

      window.RQ.DESKTOP.SERVICES.IPC.invokeEventInMain(
        "check-for-updates-and-notify",
        {}
      );
    }
  }, []);

  const quitAndInstall = () => {
    console.log("quit and install");
    if (window.RQ && window.RQ && window.RQ.DESKTOP && isUpdateDownloaded) {
      window.RQ.DESKTOP.SERVICES.IPC.invokeEventInMain("quit-and-install", {});
    }
  };

  const isUICompatible = () => {
    const desktop_app_version = window?.RQ?.DESKTOP?.VERSION;

    if (
      desktop_app_version &&
      APP_CONSTANTS.DESKTOP_APP_MIN_COMPATIBLE_VERSION
    ) {
      // TODO @sahil: Remove this once all users are migrated from this desktop app version
      if (desktop_app_version === "1.0") {
        return false;
      }

      if (
        semver.lt(
          desktop_app_version,
          APP_CONSTANTS.DESKTOP_APP_MIN_COMPATIBLE_VERSION
        )
      ) {
        return false;
      }
    }

    return true;
  };

  if (appMode === GLOBAL_CONSTANTS.APP_MODES.DESKTOP) {
    if (!isUICompatible()) {
      return (
        <BlockingDialog
          quitAndInstall={quitAndInstall}
          updateDetails={updateDetails}
          isUpdateAvailable={isUpdateAvailable}
          isUpdateDownloaded={isUpdateDownloaded}
          updateProgress={updateProgress}
        />
      );
    } else if (isUICompatible() && isUpdateDownloaded) {
      return (
        <NonBlockingDialog
          updateDetails={updateDetails}
          quitAndInstall={quitAndInstall}
        />
      );
    }
  }
  return null;
};

export default UpdateDialog;
