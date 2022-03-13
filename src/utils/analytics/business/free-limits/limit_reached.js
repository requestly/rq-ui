import { trackEvent } from "../../common";
import { BUSINESS } from "../../constants";

export const trackLimitReachedEvent = ({ type, current_count }) => {
  const params = { type, current_count };
  trackEvent(BUSINESS.FREE_LIMITS.LIMIT_REACHED, params);
};

export const trackUpgradeNowClickedEvent = (reason, source) => {
  const params = { reason, source };
  trackEvent("upgrade_clicked", params);
};

export const trackLimitReachedDialogEvent = (reason, source) => {
  const params = { reason, source };
  trackEvent("limit_reached_dialog_shown", params);
};

export const trackCharacterLimitReachedEvent = (feature) => {
  const params = { feature };
  trackEvent("rule_character_limit_reached", params);
};
