import { trackEvent } from "utils/analytics/common";
import { REFERRAL } from "utils/analytics/constants";

export const trackReferralFailed = ({ uid, refCode }) => {
  const params = {
    uid,
    refCode,
  };
  trackEvent(REFERRAL.FAILED, params);
};
