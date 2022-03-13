import { trackEvent } from "../common";
import { CREATE_RULE_LIMIT_REACHED } from "../constants";

export const trackCreateRuleLimitReachedEvent = (uid, rules_count) => {
  const params = {
    uid,
    rules_count,
  };
  trackEvent(CREATE_RULE_LIMIT_REACHED, params);
};
