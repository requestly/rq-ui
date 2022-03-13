import { trackEvent } from "../../common";
import { MOCK_SERVER } from "../../constants";

export const trackDeleteMockEvent = () => {
  const params = {};
  trackEvent(MOCK_SERVER.MOCKS.DELETED, params);
};
