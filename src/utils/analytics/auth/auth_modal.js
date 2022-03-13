import { trackEvent } from "../common";

export const trackAuthModalShownEvent = () => {
  trackEvent("auth_modal_shown");
};
