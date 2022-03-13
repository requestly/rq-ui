import { trackEvent } from "../common";
import { SIGNUP_SUCCESS } from "../constants";

export const trackSignupSuccessEvent = ({
  auth_provider,
  email,
  ref_code,
  uid,
  email_type,
  domain,
}) => {
  const params = {
    auth_provider,
    email,
    ref_code,
    uid,
    email_type,
    domain,
  };
  trackEvent(SIGNUP_SUCCESS, params);
};
