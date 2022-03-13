import { trackEvent } from "../../common";

export const trackMockLimitReachedEvent = (num) => {
  const params = { num };
  trackEvent("mock_limit_reached", params);
};
