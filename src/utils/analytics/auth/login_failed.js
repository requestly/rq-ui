import { trackEvent } from "../common";
import { LOGIN_FAILED } from "../constants";

export const trackLoginFailedEvent = ({ auth_provider, place, email }) => {
  const params = {
    auth_provider,
    place,
    email,
  };
  trackEvent(LOGIN_FAILED, params);
};
