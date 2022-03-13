import React, { useContext, useEffect } from "react";
// STORE
import { store } from "../../../store";
import { getUpdateDesktopSpecificDetails } from "../../../store/action-objects";
// UTILS
import {
  getAppMode,
  getDesktopSpecificDetails,
} from "../../../utils/GlobalStoreUtils";
// CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
// ACTIONS
import {
  startBackgroundProcess,
  invokeAppDetectionInBackground,
} from "../../../actions/DesktopActions";
import { submitEventUtil } from "../../../../src/utils/AnalyticsUtils";
import { trackBackgroundProcessStartedEvent } from "utils/analytics/desktop-app/process-management/background_process_started";
import { trackProxyServerStartedEvent } from "utils/analytics/desktop-app/proxy-server/started";
import trackDesktopAppStartedEvent from "utils/analytics/desktop-app/misc/app_started";
import {
  trackAppDetectedEvent,
  trackAppDisconnectedEvent,
} from "utils/analytics/desktop-app/apps";

const AppModeSpecificInit = () => {
  //Global State
  const globalState = useContext(store);
  const { state, dispatch } = globalState;
  const appMode = getAppMode(state);
  const desktopSpecificDetails = getDesktopSpecificDetails(state);

  useEffect(() => {
    // Setup Desktop App specific things here
    if (appMode === GLOBAL_CONSTANTS.APP_MODES.DESKTOP) {
      // hideCloudflareTopBanner();

      // Start background service
      const { isBackgroundProcessActive, appsList } = desktopSpecificDetails;
      if (!isBackgroundProcessActive) {
        // Start the bg process
        startBackgroundProcess().then((newStatus) => {
          dispatch(
            getUpdateDesktopSpecificDetails({
              isBackgroundProcessActive: !!newStatus,
            })
          );
          submitEventUtil(
            GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.DESKTOP_APP,
            GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.BG_PROCESS,
            "BG Process Started"
          );
          trackBackgroundProcessStartedEvent();
          if (newStatus === true) {
            //Start proxy server
            window.RQ.DESKTOP.SERVICES.IPC.invokeEventInBG(
              "start-proxy-server"
            ).then((res) => {
              const { success, port, proxyIp, helperServerPort } = res;
              dispatch(
                getUpdateDesktopSpecificDetails({
                  isProxyServerRunning: !!success,
                  proxyPort: port,
                  proxyIp: proxyIp,
                  helperServerPort,
                })
              );
              submitEventUtil(
                GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.DESKTOP_APP,
                GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.PROXY_SERVER,
                "PROXY SERVER Started"
              );
              trackProxyServerStartedEvent();
              // Set handler for windows closed
              window.RQ.DESKTOP.SERVICES.IPC.registerEvent(
                "browser-closed",
                (payload) => {
                  let newAppsList = { ...appsList };

                  if (newAppsList[payload.appId]) {
                    // just a sanity check
                    newAppsList[payload.appId].isActive = false;
                    dispatch(
                      getUpdateDesktopSpecificDetails({
                        appsList: newAppsList,
                      })
                    );

                    trackAppDisconnectedEvent(newAppsList[payload.appId].name);
                  }
                }
              );
              // Set handler for activable sources
              window.RQ.DESKTOP.SERVICES.IPC.registerEvent(
                "app-detected",
                (payload) => {
                  let newAppsList = { ...appsList };
                  newAppsList[payload.id].isScanned = true;
                  newAppsList[payload.id].isAvailable =
                    payload.isAppActivatable;
                  dispatch(
                    getUpdateDesktopSpecificDetails({
                      appsList: newAppsList,
                    })
                  );

                  if (payload.isAppActivatable) {
                    trackAppDetectedEvent(newAppsList[payload.id].name);
                  }
                }
              );
              // Get Active sources
              const appsListArray = Object.values(appsList);
              invokeAppDetectionInBackground(appsListArray);
            });
          }
        });
      }
    }
  }, [appMode, desktopSpecificDetails, dispatch]);

  useEffect(() => {
    if (appMode === GLOBAL_CONSTANTS.APP_MODES.DESKTOP) {
      trackDesktopAppStartedEvent();
    }
  }, [appMode]);

  return <React.Fragment />;
};

export default AppModeSpecificInit;
