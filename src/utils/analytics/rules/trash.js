import { trackEvent } from "../common";
import { RULE_TRASH } from "../constants";

export const trackRuleMovedToTrashEvent = (count, rule_type) => {
  const params = {
    rule_type,
    count,
  };
  trackEvent(RULE_TRASH, params);
};
