import { trackEvent } from "../common";
import { NEW_RULE_SELECTOR_EXAMPLE_USECASE_CLICKED } from "../constants";

export const trackNewRuleSelectorExampleUseCaseClicked = (rule_type) => {
  const params = {
    rule_type,
  };
  trackEvent(NEW_RULE_SELECTOR_EXAMPLE_USECASE_CLICKED, params);
};
