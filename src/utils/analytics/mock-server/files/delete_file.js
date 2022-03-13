import { trackEvent } from "../../common";
import { MOCK_SERVER } from "../../constants";

export const trackDeleteFileEvent = () => {
  const params = {};
  trackEvent(MOCK_SERVER.FILES.DELETED, params);
};
