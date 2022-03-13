import amplitude from "amplitude-js";
import posthog from "posthog-js";

export const get_app_details = () => {
  let app_mode = null;
  let app_version = null;

  if (document.documentElement.getAttribute("rq-ext-version")) {
    app_mode = "EXTENSION";
    app_version = document.documentElement.getAttribute("rq-ext-version");
  } else if (window?.RQ?.MODE) {
    app_mode = window.RQ.MODE;
    app_version = window?.RQ?.DESKTOP?.VERSION;
  }

  return { app_mode, app_version };
};

export const trackEvent = (name, params) => {
  const { app_mode, app_version } = get_app_details();

  const newParams = { ...params };
  newParams.rq_app_mode = app_mode;
  newParams.rq_app_version = app_version;

  if (window.location.host.includes("app.requestly.io")) {
    // Send to GA4
    window.gtag("event", name, newParams);
  }
};
