import { trackEvent } from "utils/analytics/common";
import { FEEDBACK } from "utils/analytics/constants";

export const trackFeedbackSubmitted = (suggestions, recommend) => {
  const params = {
    recommend,
    suggestions,
  };
  trackEvent(FEEDBACK.SUBMITTED, params);
};
