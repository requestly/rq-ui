import { trackEvent } from "utils/analytics/common";
import { REFERRAL } from "utils/analytics/constants";

export const trackReferralApplied = ({ uid, refCode, rewardType }) => {
  const params = {
    uid,
    refCode,
    rewardType,
  };
  trackEvent(REFERRAL.APPLIED, params);
};
