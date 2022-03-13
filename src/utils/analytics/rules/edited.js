import { trackEvent } from "../common";
import { RULE_EDITED } from "../constants";

export const trackRuleEditedEvent = (rule_type) => {
  const params = {
    rule_type,
  };
  trackEvent(RULE_EDITED, params);
};
