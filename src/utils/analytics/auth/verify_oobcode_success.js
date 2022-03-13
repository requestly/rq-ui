import { trackEvent } from "../common";
import { VERIFY_OOBCODE_SUCCESS } from "../constants";

export const trackVerifyOobCodeSuccess = () => {
  trackEvent(VERIFY_OOBCODE_SUCCESS);
};
