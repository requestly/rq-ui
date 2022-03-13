import React, { useContext, useState, useEffect } from "react";
//SUB COMPONENTS
import InstallExtensionCTA from "components/misc/InstallExtensionCTA";
import ExtensionDeactivationMessage from "components/misc/ExtensionDeactivationMessage";
//VIEWS
import RulesIndexPage from "components/features/rules/RulesIndexPage";
//ACTIONS
import { isExtensionInstalled } from "actions/ExtensionActions";
// STORE
import { store } from "store";
// UTILS
import { getAppMode } from "utils/GlobalStoreUtils";
// CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
//discount Widget
import { StorageService } from "init";
import APP_CONSTANTS from "config/constants";

const RulesIndexView = () => {
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const appMode = getAppMode(state);
  const [isExtensionEnabled, setIsExtensionEnabled] = useState(true);

  useEffect(() => {
    if (appMode === GLOBAL_CONSTANTS.APP_MODES.EXTENSION) {
      StorageService(appMode)
        .getRecord(APP_CONSTANTS.RQ_SETTINGS)
        .then((value) => {
          if (value) {
            setIsExtensionEnabled(value.isExtensionEnabled);
          } else {
            setIsExtensionEnabled(true);
          }
        });
    }
  }, [appMode]);

  const renderRulesIndex = () => {
    if (appMode === GLOBAL_CONSTANTS.APP_MODES.DESKTOP) {
      return <RulesIndexPage />;
    }

    return isExtensionInstalled() ? (
      !isExtensionEnabled ? (
        <ExtensionDeactivationMessage />
      ) : (
        <RulesIndexPage />
      )
    ) : (
      <InstallExtensionCTA />
    );
  };
  return <>{renderRulesIndex()}</>;
};

export default RulesIndexView;
