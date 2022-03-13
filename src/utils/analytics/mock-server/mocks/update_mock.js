import { trackEvent } from "../../common";
import { MOCK_SERVER } from "../../constants";

export const trackUpdateMockEvent = () => {
  const params = {};
  trackEvent(MOCK_SERVER.MOCKS.UPDATED, params);
};
