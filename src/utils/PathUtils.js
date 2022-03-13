//CONFIG
import APP_CONSTANTS from "../config/constants";

//CONSTANTS
const { PATHS } = APP_CONSTANTS;

// AUTH

export const getDesktopSignInAuthPath = (authCode) => {
  if (!authCode) return PATHS.AUTH.DEKSTOP_SIGN_IN.ABSOLUTE;
  return `${PATHS.AUTH.DEKSTOP_SIGN_IN.ABSOLUTE}?ot-auth-code=${authCode}`;
};

export const isPricingPage = (pathname = window.location.pathname) => {
  return pathname.includes(APP_CONSTANTS.PATHS.PRICING.RELATIVE);
};
