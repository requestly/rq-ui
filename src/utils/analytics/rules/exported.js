import { trackEvent } from "../common";
import { RULE_EXPORTED, RULES_EXPORTED } from "../constants";

export const trackRuleExportedEvent = (count, rule_type) => {
  const params = {
    rule_type,
    count,
  };
  trackEvent(RULE_EXPORTED, params);
};

export const trackRulesExportedEvent = (count) => {
  const params = {
    count,
  };
  trackEvent(RULES_EXPORTED, params);
};
