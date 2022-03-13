import { getAuth } from "firebase/auth";
import { onValue } from "firebase/database";
import { getNodeRef } from "../../../actions/FirebaseActions";
import APP_CONSTANTS from "../../../config/constants";
import firebaseApp from "../../../firebase";
import { getUpdateUserPlanDetails } from "../../../store/action-objects";
import { submitAttrUtil } from "../../../utils/AnalyticsUtils";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import {
  getPlanName,
  isPremiumUser,
  isTrialPlanExpired,
} from "../../../utils/PremiumUtils";

const TRACKING = GLOBAL_CONSTANTS.GA_EVENTS;

const userSubscriptionNodeListener = (dispatch) => {
  const auth = getAuth(firebaseApp);
  const user = auth.currentUser;

  if (user) {
    try {
      const userSubscriptionNodeRef = getNodeRef([
        "us",
        user.uid,
        "planDetails",
      ]);
      onValue(userSubscriptionNodeRef, async (snapshot) => {
        const planDetails = snapshot.val();
        const isUserPremium = isPremiumUser(planDetails);
        const isTrialExpired = isTrialPlanExpired(planDetails);

        dispatch(
          getUpdateUserPlanDetails(
            {
              ...planDetails,
              planName: isUserPremium
                ? getPlanName(planDetails)
                : isTrialExpired
                ? APP_CONSTANTS.PRICING.PLAN_NAMES.TRIAL_EXPIRED
                : APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE,
            },
            isUserPremium
          )
        );
        submitAttrUtil(TRACKING.ATTR.IS_PREMIUM, isUserPremium);
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
      });
    } catch (e) {
      dispatch(getUpdateUserPlanDetails(null, false));
    }
  } else {
    dispatch(getUpdateUserPlanDetails(null, false));
  }
};

export default userSubscriptionNodeListener;
