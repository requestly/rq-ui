import { trackEvent } from "../common";
import { RULE_TEMPLATE_CLICKED } from "../constants";

export const trackTemplateClicked = (template_name, template_type) => {
  const params = {
    template_type,
    template_name,
  };
  trackEvent(RULE_TEMPLATE_CLICKED, params);
};
