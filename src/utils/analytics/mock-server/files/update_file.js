import { trackEvent } from "../../common";
import { MOCK_SERVER } from "../../constants";

export const trackUpdateFileEvent = () => {
  const params = {};
  trackEvent(MOCK_SERVER.FILES.UPDATED, params);
};
