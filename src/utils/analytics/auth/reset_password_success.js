import { trackEvent } from "../common";
import { RESET_PASSWORD_SUCCESS } from "../constants";

export const trackResetPasswordSuccessEvent = () => {
  trackEvent(RESET_PASSWORD_SUCCESS);
};
