import React, { useEffect, useContext, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import isEmpty from "is-empty";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
// Firebase App
import firebaseApp from "firebase.js";
//Config
import APP_CONSTANTS from "./config/constants";
//ACTIONS
import {
  checkUserBackupState,
  getOrUpdateUserSyncState,
  getAuthData,
  getValueAsPromise,
} from "./actions/FirebaseActions";
// UTILS
import { getAppMode, getUserAuthDetails } from "./utils/GlobalStoreUtils";

import { updateCurrentOwnerForAllRules } from "utils/rules/misc.js";
import { submitAttrUtil } from "utils/AnalyticsUtils.js";
import {
  getPlanName,
  isPremiumUser,
  isTrialPlanExpired,
} from "./utils/PremiumUtils.js";
//STORE
import { store } from "./store";
//REDUCER ACTIONS
import {
  getUpdateAppModeActionObject,
  getUpdateUserInfoActionObject,
} from "./store/action-objects";
// Empty Components
import AppModeSpecificInit from "./components/empty/AppModeSpecificInit";
// DOM Manipulations
import removePreloader from "./actions/UI/removePreloader";
// Integrations
import { addAmplitude } from "./config/integrations";
// Layouts
import DashboardLayout from "./layouts/DashboardLayout";
import { ConfigProvider } from "antd";
import enUS from "antd/lib/locale/en_US";
//MEDIA QUERY
import FullScreenLayout from "layouts/FullScreenLayout/index.js";
import UpdateDialog from "components/mode-specific/desktop/UpdateDialog";
import { getAndUpdateInstallationDate, isDesktopMode } from "utils/Misc";
import { getEmailType } from "utils/FormattingHelper";
import ThemeSetter from "components/empty/ThemeSetter";
import SetGeoSpecificEvents from "./components/empty/SetGeoSpecificEvents";
import DbListenerInit from "./components/empty/DbListenerInit";
import SyncingInit from "./components/empty/SyncingInit";

const TRACKING = GLOBAL_CONSTANTS.GA_EVENTS;

const { PATHS } = APP_CONSTANTS;

const App = () => {
  const location = useLocation();
  //Global State
  const globalState = useContext(store);
  const { state, dispatch } = globalState;
  const appMode = getAppMode(state);
  const user = getUserAuthDetails(state);
  //Component State
  const [hasAuthHandlerBeenSet, setHasAuthHandlerBeenSet] = useState(false);
  const [hasAppModeBeenSet, setHasAppModeBeenSet] = useState(false);
  const [hasPreloaderBeenRemoved, setHasPreloaderBeenRemoved] = useState(false);

  // Init amplitude, to stop wrong api key error
  if (
    !window.location.host.includes("127.0.0.1") &&
    !window.location.host.includes("localhost") &&
    !window.location.host.includes("beta")
  ) {
    addAmplitude(null);
  }
  //App_Mode_Attr
  submitAttrUtil(TRACKING.ATTR.APP_MODE, appMode || "Missing_Value");

  const removePreloaderIfReq = useCallback(() => {
    //Remove Preloader
    if (!hasPreloaderBeenRemoved) {
      setHasPreloaderBeenRemoved(true);
      removePreloader();
    }
  }, [hasPreloaderBeenRemoved]);

  // Load user authentication state
  useEffect(() => {
    if (hasAuthHandlerBeenSet) return;
    setHasAuthHandlerBeenSet(true);
    const auth = getAuth(firebaseApp);
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        updateCurrentOwnerForAllRules(user.uid, appMode);
        // Add integration - SIB
        const isSiteInTopFrame = window.top === window.self;
        submitAttrUtil(
          TRACKING.ATTR.EMAIL_DOMAIN,
          user.email.split("@")[1].replace(".", "_dot_") || "Missing_Value"
        );
        submitAttrUtil(
          TRACKING.ATTR.EMAIL_TYPE,
          getEmailType(user.email) || "Missing_Value"
        );

        // Fetch plan details
        getValueAsPromise(["us", user.uid, "planDetails"])
          .then(async (planDetails) => {
            const isUserPremium = isPremiumUser(planDetails);
            const isTrialExpired = isTrialPlanExpired(planDetails);
            const isSyncEnabled = await getOrUpdateUserSyncState(
              user.uid,
              isUserPremium
            );
            // Fetch backup status
            const isBackupEnabled =
              isUserPremium && (await checkUserBackupState(user.uid));
            // Update global state
            const authData = getAuthData(user);
            // Set UID in window object
            window.uid = authData?.uid;
            // Fetch UserCountry
            dispatch(
              getUpdateUserInfoActionObject(true, {
                profile: authData,
                isLoggedIn: true,
                planDetails: {
                  ...planDetails,
                  planName: isUserPremium
                    ? getPlanName(planDetails)
                    : isTrialExpired
                    ? APP_CONSTANTS.PRICING.PLAN_NAMES.TRIAL_EXPIRED
                    : APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE,
                },
                isBackupEnabled,
                isSyncEnabled,
                isPremium: isUserPremium,
              })
            );
            submitAttrUtil(TRACKING.ATTR.IS_PREMIUM, isUserPremium);

            //Remove Preloader
            removePreloaderIfReq();

            // Analytics
            if (planDetails) {
              submitAttrUtil(
                TRACKING.ATTR.PAYMENT_MODE,
                planDetails.type || "Missing Value"
              );
              submitAttrUtil(
                TRACKING.ATTR.PLAN_ID,
                planDetails.planId || "Missing Value"
              );

              if (planDetails.subscription) {
                submitAttrUtil(
                  TRACKING.ATTR.PLAN_START_DATE,
                  planDetails.subscription.startDate || "Missing Value"
                );
                submitAttrUtil(
                  TRACKING.ATTR.PLAN_END_DATE,
                  planDetails.subscription.endDate || "Missing Value"
                );
              }
            }
          })
          .catch((e) => {
            console.error("Unable to fetch user plan", e.message);
            // Unset UID in window object
            window.uid = null;
            dispatch(getUpdateUserInfoActionObject(false, false));

            //Remove Preloader
            removePreloaderIfReq();
          });
      } else {
        // No user is signed in, Unset UID in window object
        window.uid = null;

        dispatch(getUpdateUserInfoActionObject(false, false));
        //Remove Preloader
        removePreloaderIfReq();
      }
    });
  }, [
    dispatch,
    appMode,
    hasAuthHandlerBeenSet,
    hasPreloaderBeenRemoved,
    user,
    removePreloaderIfReq,
  ]);

  // Set app mode - "EXTENSION" || "DESKTOP"
  useEffect(() => {
    if (!hasAppModeBeenSet) {
      setHasAppModeBeenSet(true);
      if (isDesktopMode())
        dispatch(
          getUpdateAppModeActionObject(GLOBAL_CONSTANTS.APP_MODES.DESKTOP)
        );
    }
  }, [dispatch, hasAppModeBeenSet]);

  // Things that need 100% valid "appMode"
  useEffect(() => {
    if (hasAppModeBeenSet) {
      // Attributes
      getAndUpdateInstallationDate(appMode, true);
    }
  }, [appMode, hasAppModeBeenSet, user]);

  if (!isEmpty(window.location.hash)) {
    //Support legacy URL formats
    const hashURL = window.location.hash.split("/");
    const hashType = hashURL[0];
    const hashPath = hashURL[1];

    switch (hashType) {
      case PATHS.HASH.SHARED_LISTS:
        window.location.assign(
          PATHS.SHARED_LISTS.VIEWER.ABSOLUTE + "/" + hashPath
        );
        break;
      case PATHS.HASH.RULE_EDITOR:
        window.location.replace(
          PATHS.RULE_EDITOR.EDIT_RULE.ABSOLUTE + "/" + hashPath
        );
        break;

      default:
        break;
    }
  }

  return (
    <>
      <ConfigProvider locale={enUS}>
        <div
          id="requestly-dashboard-layout"
          style={{
            height: "100vh",
          }}
        >
          {/* Common for all layouts */}
          <AppModeSpecificInit />

          {"/" + location.pathname.split("/")[1] === PATHS.LANDING ? (
            <FullScreenLayout />
          ) : (
            <>
              <UpdateDialog />
              <DashboardLayout />
            </>
          )}
        </div>
      </ConfigProvider>
      <ThemeSetter />
      <DbListenerInit />
      <SyncingInit />
      <SetGeoSpecificEvents />
    </>
  );
};

export default App;
