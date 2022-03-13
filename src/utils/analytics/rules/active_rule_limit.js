import { trackEvent } from "../common";
import { ACTIVE_RULE_LIMIT_REACHED } from "../constants";

export const trackActiveRuleLimitReachedEvent = (uid, rules_count) => {
  const params = {
    uid,
    rules_count,
  };
  trackEvent(ACTIVE_RULE_LIMIT_REACHED, params);
};
