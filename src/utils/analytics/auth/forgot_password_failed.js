import { trackEvent } from "../common";
import { FORGOT_PASSWORD_FAILED } from "../constants";

export const trackForgotPasswordFailedEvent = ({ email, error }) => {
  const params = {
    email,
    error,
  };
  trackEvent(FORGOT_PASSWORD_FAILED, params);
};
