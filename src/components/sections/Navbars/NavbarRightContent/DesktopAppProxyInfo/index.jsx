import React, { useContext } from "react";
import { store } from "store";
import { getAppMode, getDesktopSpecificDetails } from "utils/GlobalStoreUtils";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import { Badge } from "antd";

const DesktopAppProxyInfo = () => {
  // Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const appMode = getAppMode(state);
  const desktopSpecificDetails = getDesktopSpecificDetails(state);

  const {
    isBackgroundProcessActive,
    isProxyServerRunning,
    proxyPort,
    proxyIp,
  } = desktopSpecificDetails;

  const renderProxyBadgeStatus = () => {
    if (!isBackgroundProcessActive || !isProxyServerRunning) {
      return "warning";
    }
    return "success";
  };

  const renderProxyStatusText = () => {
    if (!isBackgroundProcessActive)
      return "Waiting for proxy server to start...";

    if (!isProxyServerRunning) return "Proxy server is not running";

    return (
      <React.Fragment>
        Proxy server is listening at
        {` ${proxyIp}:${proxyPort}`}
      </React.Fragment>
    );
  };

  if (appMode !== GLOBAL_CONSTANTS.APP_MODES.DESKTOP) return null;

  return (
    <>
      <Badge status={renderProxyBadgeStatus()} text={renderProxyStatusText()} />
    </>
  );
};

export default DesktopAppProxyInfo;
