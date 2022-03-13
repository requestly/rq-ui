//CONSTANTS
import APP_CONSTANTS from "../../../../../../../../../config/constants";
//UTILS
import * as FeatureManager from "../../../../../../../../../utils/FeatureManager";

export const getResponseBodyCharacterLimit = (user) => {
  // fetch planName from global state
  const planName =
    user.details?.planDetails?.planName ||
    APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE;

  return FeatureManager.getFeatureLimits(
    APP_CONSTANTS.FEATURES.RESPONSE_BODY_CHARACTER_LIMIT,
    user,
    planName
  );
};
