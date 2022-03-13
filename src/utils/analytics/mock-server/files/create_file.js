import { trackEvent } from "../../common";
import { MOCK_SERVER } from "../../constants";

export const trackCreateFileEvent = () => {
  const params = {};
  trackEvent(MOCK_SERVER.FILES.CREATED, params);
};
