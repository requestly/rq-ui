import { trackEvent } from "../../common";
import { DESKTOP_APP } from "../../constants";

export const trackProxyServerStartedEvent = () => {
  const params = {};
  trackEvent(DESKTOP_APP.PROXY_SERVER.STARTED, params);
};
