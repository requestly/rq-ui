import { trackEvent } from "../common";
import { FORGOT_PASSWORD_SUCCESS } from "../constants";

export const trackForgotPasswordSuccessEvent = ({ email }) => {
  const params = {
    email,
  };
  trackEvent(FORGOT_PASSWORD_SUCCESS, params);
};
