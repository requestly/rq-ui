import { trackEvent } from "../../common";

export const trackTrialModeEnabled = () => {
  trackEvent("trial_mode_enabled");
};

export const trackTrialModeExpiredModalShown = () => {
  trackEvent("trial_mode_expired_modal_shown");
};

export const trackUpgradeButtonClickedOnTrialExpiredModal = () => {
  trackEvent("trial_mode_expired_upgrade_button_clicked");
};
