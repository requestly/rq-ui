import { submitEvent, submitAttr } from "../config/integrations";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import { getEmailType } from "../utils/FormattingHelper";
import DataStoreUtils from "./DataStoreUtils";
import { getDateString } from "./DateTimeUtils";

const TRACKING = GLOBAL_CONSTANTS.GA_EVENTS;

export const submitEventUtil = (
  eventCategory,
  eventAction,
  eventLabel,
  eventValue
) => {
  submitEvent({
    eventCategory,
    eventAction,
    eventLabel: eventLabel
      ? eventLabel.replace(".", "_").replace("@", "_at_")
      : null,
    eventValue,
  });
};

export const submitAttrUtil = (attr, value) => {
  submitAttr({
    attr,
    value: String(value).replace(".", "_"),
  });
};

export const trackLoginEvent = (eventAction, method, email) => {
  submitEventUtil(
    TRACKING.CATEGORIES.LOGIN,
    eventAction,
    TRACKING.CATEGORIES.LOGIN + "_" + eventAction
  );

  // We don't get email with apple
  // https://developers.google.com/analytics/devguides/collection/ga4/reference/events#login

  // Moved to utils/analytics
  // if (email) {
  //   const domain = email.split("@")[1];
  //   const emailType = getEmailType(email);
  //   window.gtag("event", "login", {
  //     email_type: emailType.toLowerCase(),
  //     email_domain: domain,
  //     email_method: method,
  //   });
  // } else {
  //   window.gtag("event", "login", {
  //     email_method: method,
  //   });
  // }
};

export const trackSignUpEvent = (email) => {
  const domain = email.split("@")[1];
  const emailType = getEmailType(email);
  submitEventUtil(
    TRACKING.CATEGORIES.SIGNUP,
    `SignUp with ${emailType} email`,
    `${emailType} email - @${domain}`
  );

  // https://developers.google.com/analytics/devguides/collection/ga4/reference/events#sign_up

  // Moved to utils/analytics
  // window.gtag("event", "sign_up", {
  //   email_type: emailType.toLowerCase(),
  //   email_domain: domain,
  // });
};

export const pageVisitEvent = (pagePath) => {
  submitEventUtil(
    TRACKING.CATEGORIES.PAGE_VISITS,
    `visit ${pagePath}`,
    `${TRACKING.CATEGORIES.PAGE_VISITS}_${pagePath}`
  );
};

export const trackRQLastActivity = (activity) => {
  submitAttrUtil("rq_last_activity_ts", getDateString(new Date()));
  submitAttrUtil("rq_last_activity", activity);
};

export const appLaunchedEvent = (appName) => {
  submitEventUtil(
    TRACKING.CATEGORIES.DESKTOP_APP,
    `${appName}`,
    `${TRACKING.CATEGORIES.DESKTOP_APP}_${appName}`
  );
};

export const getAttrFromFirebase = async (attrName) => {
  return new Promise((resolve, reject) => {
    DataStoreUtils.isUserAuthenticated(async (userData) => {
      if (userData && userData.uid) {
        const currentDateInDB = await DataStoreUtils.getValue([
          "customProfile",
          userData.uid,
          "attributes",
          attrName,
        ]);
        resolve(currentDateInDB);
        return currentDateInDB;
      } else {
        reject(null);
        return null;
      }
    });
  });
};
