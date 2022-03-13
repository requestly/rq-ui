// STORE
import { getUpdateUserInfoActionObject } from "../../../../store/action-objects";
// Firebase
import firebaseApp from "../../../../firebase";
import { getAuth } from "firebase/auth";
import {
  getAuthData,
  getValueAsPromise,
} from "../../../../actions/FirebaseActions";
import {
  getPlanName,
  isPremiumUser,
  isTrialPlanExpired,
} from "../../../../utils/PremiumUtils";
import APP_CONSTANTS from "../../../../config/constants";

// This function is similar to useLayout of App.js.
// Only difference is that this is invoked once only on-demand
export const refreshUserInGlobalState = async (dispatch) => {
  const auth = getAuth(firebaseApp);
  const user = auth.currentUser;

  if (user) {
    // User is signed in
    let newUserDetailsObject = {};
    // Fetch plan details
    getValueAsPromise(["us", user.uid, "planDetails"])
      .then((planDetails) => {
        const authData = getAuthData(user);
        console.log(user);
        // Set UID in window object
        window.uid = authData?.uid;

        newUserDetailsObject = {
          profile: authData,
          isLoggedIn: true,
          planDetails: {
            ...planDetails,
            planName: isPremiumUser(planDetails)
              ? getPlanName(planDetails)
              : isTrialPlanExpired(planDetails)
              ? APP_CONSTANTS.PRICING.PLAN_NAMES.TRIAL_EXPIRED
              : APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE,
          },
          isPremium: isPremiumUser(planDetails),
        };
      })
      .then(async () => {
        // Fetch rule backups details
        const isBackupEnabled = await getValueAsPromise([
          "users",
          user.uid,
          "profile",
          "isBackupEnabled",
        ]);
        if (isBackupEnabled) {
          newUserDetailsObject["isBackupEnabled"] = true;
        } else {
          newUserDetailsObject["isBackupEnabled"] = false;
        }
        // Update global state
        dispatch(getUpdateUserInfoActionObject(true, newUserDetailsObject));
      })
      .catch((e) => {
        console.error("Unable to fetch user plan", e.message);
        // Unset UID in window object
        window.uid = null;
        dispatch(getUpdateUserInfoActionObject(false, false));
      });
  } else {
    // Unset UID in window object
    window.uid = null;
    dispatch(getUpdateUserInfoActionObject(false, false));
  }
};
