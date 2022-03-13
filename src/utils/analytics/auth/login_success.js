import { trackEvent } from "../common";
import { LOGIN_SUCCESS } from "../constants";

export const trackLoginSuccessEvent = ({
  auth_provider,
  uid,
  place,
  email,
  email_type,
  domain,
}) => {
  const params = {
    auth_provider,
    uid,
    place: place ?? window.location.href,
    email,
    email_type,
    domain,
  };
  trackEvent(LOGIN_SUCCESS, params);
};
