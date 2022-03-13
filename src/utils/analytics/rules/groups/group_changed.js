import { trackEvent } from "../../common";
import { GROUP_CHANGED } from "../../constants";

export const trackGroupChangedEvent = () => {
  const params = {};
  trackEvent(GROUP_CHANGED, params);
};
