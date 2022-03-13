import { trackEvent } from "../common";
import { RULE_DELETED, RULES_DELETED } from "../constants";

export const trackRuleDeletedEvent = (count, rule_type) => {
  const params = {
    count,
    rule_type,
  };
  trackEvent(RULE_DELETED, params);
};

export const trackRulesDeletedEvent = (count) => {
  const params = {
    count,
  };
  trackEvent(RULES_DELETED, params);
};
