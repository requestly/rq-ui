import { trackEvent } from "../common";
import { FORGOT_PASSWORD_ATTEMPTED } from "../constants";

export const trackForgotPasswordAttemptedEvent = ({ email }) => {
  const params = {
    email,
  };
  trackEvent(FORGOT_PASSWORD_ATTEMPTED, params);
};
