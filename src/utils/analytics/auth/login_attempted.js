import { trackEvent } from "../common";
import { LOGIN_ATTEMPTED } from "../constants";

export const trackLoginAttemptedEvent = ({
  auth_provider,
  email,
  place,
  email_type,
  domain,
}) => {
  const params = {
    auth_provider,
    email,
    place: place ?? window.location.href,
    email_type,
    domain,
  };
  trackEvent(LOGIN_ATTEMPTED, params);
};
