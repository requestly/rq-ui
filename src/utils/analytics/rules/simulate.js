import { trackEvent } from "../common";
import { SIMULATE_RULE } from "../constants";

export const trackSimulateRulesEvent = (rule_type) => {
  const params = {
    rule_type,
  };
  trackEvent(SIMULATE_RULE, params);
};
