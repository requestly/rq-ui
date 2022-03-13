import { trackEvent } from "../common";
import { SIGNUP_FAILED } from "../constants";

export const trackSignUpFailedEvent = ({ auth_provider, email, error }) => {
  const params = {
    auth_provider,
    email,
    error,
  };
  trackEvent(SIGNUP_FAILED, params);
};
