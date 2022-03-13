import { trackEvent } from "../common";
import { RULE_CREATED } from "../constants";

export const trackRuleCreatedEvent = (rule_type) => {
  const params = {
    rule_type,
  };
  trackEvent(RULE_CREATED, params);
};

export const trackRuleActiveStatusEvent = (rule_type) => {
  const params = {
    rule_type,
  };
  trackEvent("rule_activated", params);
};

export const trackRuleDeActiveStatusEvent = (rule_type) => {
  const params = {
    rule_type,
  };
  trackEvent("rule_deactivated", params);
};
