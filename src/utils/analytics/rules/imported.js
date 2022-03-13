import { trackEvent } from "../common";
import { RULES_IMPORTED } from "../constants";

export const trackRulesImportedEvent = ({ count }) => {
  const params = {
    count,
  };
  trackEvent(RULES_IMPORTED, params);
};
