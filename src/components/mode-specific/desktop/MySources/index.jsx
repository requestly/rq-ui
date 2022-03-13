import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
// SUB COMPONENTS
import SpinnerColumn from "../../../misc/SpinnerColumn";
// STORE
import { store } from "../../../../store";
// UTILS
import {
  getAppMode,
  getDesktopSpecificDetails,
} from "../../../../utils/GlobalStoreUtils";
import { redirectToRules } from "../../../../utils/RedirectionUtils";
// CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import ProCard from "@ant-design/pro-card";
import Sources from "./Sources";

const MySources = () => {
  const navigate = useNavigate();
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const appMode = getAppMode(state);
  const desktopSpecificDetails = getDesktopSpecificDetails(state);
  const { isBackgroundProcessActive } = desktopSpecificDetails;

  if (appMode === GLOBAL_CONSTANTS.APP_MODES.EXTENSION) {
    redirectToRules(navigate);
  }

  if (!isBackgroundProcessActive) {
    return <SpinnerColumn customLoadingMessage="Loading background process" />;
  }

  return (
    <React.Fragment>
      <ProCard className="primary-card github-like-border">
        <Sources />
      </ProCard>
    </React.Fragment>
  );
};

export default MySources;
