import { trackEvent } from "../common";
import { EDIT_RULE_LIMIT_REACHED } from "../constants";

export const trackEditRuleLimitReachedEvent = (uid, rules_count) => {
  const params = {
    uid,
    rules_count,
  };
  trackEvent(EDIT_RULE_LIMIT_REACHED, params);
};
