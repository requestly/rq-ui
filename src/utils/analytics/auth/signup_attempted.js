import { trackEvent } from "../common";
import { SIGNUP_ATTEMPTED } from "../constants";

export const trackSignUpAttemptedEvent = ({
  auth_provider,
  email,
  ref_code,
  email_type,
  domain,
}) => {
  const params = {
    auth_provider,
    email,
    ref_code,
    email_type,
    domain,
  };
  trackEvent(SIGNUP_ATTEMPTED, params);
};
