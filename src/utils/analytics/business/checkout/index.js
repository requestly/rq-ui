import { trackEvent } from "../../common";

export const trackCheckoutModalShownEvent = () => {
  trackEvent("checkout_modal_shown");
};

export const trackCheckoutInitiatedEvent = (duration, plan, quantity) => {
  const params = { duration, plan, quantity };
  trackEvent("checkout_initiated", params);
};

export const trackCheckoutFailedEvent = () => {
  trackEvent("checkout_failed");
};

export const trackCheckoutCompletedEvent = () => {
  trackEvent("checkout_completed");
};

export const trackChinaCheckoutInterest = (paymentMethod) => {
  const params = { paymentMethod };
  trackEvent("china_checkout_interest", params);
};
