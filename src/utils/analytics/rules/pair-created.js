import { trackEvent } from "../common";
import { RULE_PAIR_CREATED } from "../constants";

export const trackRulePairCreated = ({ current_pairs_count }) => {
  const params = {
    current_pairs_count,
  };
  trackEvent(RULE_PAIR_CREATED, params);
};
