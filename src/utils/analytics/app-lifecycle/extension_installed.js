import { trackEvent } from "../common";
import { APP_LIFECYCLE } from "../constants";

const trackExtensionInstalled = () => {
  trackEvent(APP_LIFECYCLE.EXTENSION_INSTALLED);
};
export default trackExtensionInstalled;
