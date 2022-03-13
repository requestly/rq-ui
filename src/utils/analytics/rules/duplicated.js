import { trackEvent } from "../common";
import { RULE_DUPLICATED } from "../constants";

export const trackRuleDuplicatedEvent = (rule_type) => {
  const params = {
    rule_type,
  };
  trackEvent(RULE_DUPLICATED, params);
};
