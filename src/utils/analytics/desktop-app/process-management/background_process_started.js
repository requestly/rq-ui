import { trackEvent } from "../../common";
import { DESKTOP_APP } from "../../constants";

export const trackBackgroundProcessStartedEvent = () => {
  const params = {};
  trackEvent(DESKTOP_APP.PROCESS_MANAGEMENT.BACKGROUND.PROCESS_STARTED, params);
};
