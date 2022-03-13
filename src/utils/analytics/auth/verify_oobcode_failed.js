import { trackEvent } from "../common";
import { VERIFY_OOBCODE_FAILED } from "../constants";

export const trackVerifyOobCodeFailed = () => {
  trackEvent(VERIFY_OOBCODE_FAILED);
};
