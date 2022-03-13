import { trackEvent } from "../../common";
import { BUSINESS } from "../../constants";

export const trackRemoveLimitsClickedEvent = () => {
  const params = {};
  trackEvent(BUSINESS.FREE_LIMITS.REMOVE_CLICKED, params);
};
