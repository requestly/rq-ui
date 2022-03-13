import { trackEvent } from "../../common";
import { MOCK_SERVER } from "../../constants";

export const trackCreateMockEvent = () => {
  const params = {};
  trackEvent(MOCK_SERVER.MOCKS.CREATED, params);
};
