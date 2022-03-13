import { trackEvent } from "../common";
import { LOGIN_REQUESTED } from "../constants";

export const trackLoginRequestedEvent = ({ auth_provider, place }) => {
  const params = {
    place,
    auth_provider,
  };
  trackEvent(LOGIN_REQUESTED, params);
};
