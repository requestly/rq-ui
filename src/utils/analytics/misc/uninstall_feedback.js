import { trackEvent } from "../common";
import { MISC } from "../constants";

export const trackUninstallFeedbackEvent = (
  rating,
  message,
  suggestion,
  email
) => {
  const params = { rating, message, suggestion, email };
  trackEvent(MISC.UNINSTALL_FEEDBACK, params);
};
