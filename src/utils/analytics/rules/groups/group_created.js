import { trackEvent } from "../../common";
import { GROUP_CREATED } from "../../constants";

export const trackGroupCreatedEvent = () => {
  const params = {};
  trackEvent(GROUP_CREATED, params);
};
