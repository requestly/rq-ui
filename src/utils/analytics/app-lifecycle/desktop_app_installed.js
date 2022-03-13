import { trackEvent } from "../common";
import { APP_LIFECYCLE } from "../constants";

const trackDesktopAppInstalled = () => {
  trackEvent(APP_LIFECYCLE.DESKTOP_APP_INSTALLED);
};
export default trackDesktopAppInstalled;
