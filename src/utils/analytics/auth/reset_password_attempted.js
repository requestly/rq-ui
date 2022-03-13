import { trackEvent } from "../common";
import { RESET_PASSWORD_ATTEMPTED } from "../constants";

export const trackResetPasswordAttemptedEvent = () => {
  trackEvent(RESET_PASSWORD_ATTEMPTED);
};
