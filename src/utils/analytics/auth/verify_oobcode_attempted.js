import { trackEvent } from "../common";
import { FORGOT_PASSWORD_ATTEMPTED } from "../constants";

export const trackVerifyOobCodeAttempted = () => {
  trackEvent(FORGOT_PASSWORD_ATTEMPTED);
};
