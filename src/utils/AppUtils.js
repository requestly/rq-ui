import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";

export const getAppDetails = () => {
  let app_mode = null;
  let app_version = null;

  if (document.documentElement.getAttribute("rq-ext-version")) {
    app_mode = GLOBAL_CONSTANTS.APP_MODES.EXTENSION;
    app_version = document.documentElement.getAttribute("rq-ext-version");
  } else if (window?.RQ?.MODE) {
    app_mode = window.RQ.MODE;
    app_version = window?.RQ?.DESKTOP?.VERSION;
  }

  return { app_mode, app_version };
};

export const isDesktopMode = () => {
  return getAppDetails().app_mode === GLOBAL_CONSTANTS.APP_MODES.DESKTOP;
};
