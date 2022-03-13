const { trackEvent } = require("utils/analytics/common");
const { DESKTOP_APP } = require("utils/analytics/constants");

const trackDesktopAppStartedEvent = () => {
  const params = {};
  trackEvent(DESKTOP_APP.MISC.APP_STARTED, params);
};

export default trackDesktopAppStartedEvent;
