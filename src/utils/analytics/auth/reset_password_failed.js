import { trackEvent } from "../common";
import { RESET_PASSWORD_FAILED } from "../constants";

export const trackResetPasswordFailedEvent = () => {
  trackEvent(RESET_PASSWORD_FAILED);
};
