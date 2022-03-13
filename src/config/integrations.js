import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import { getDatabase, ref, update } from "firebase/database";
import DataStoreUtils from "../utils/DataStoreUtils";

const TRACKING = GLOBAL_CONSTANTS.GA_EVENTS;

// Wrapper method to submit event to multiple sources
export function submitEvent(dataMessage) {
  if (dataMessage.eventValue && typeof dataMessage.eventValue == "number") {
    window.ga("send", {
      hitType: "event",
      eventCategory: dataMessage.eventCategory,
      eventAction: dataMessage.eventAction,
      eventLabel: dataMessage.eventLabel,
      eventValue: Math.ceil(dataMessage.eventValue),
    });
  } else {
    window.ga("send", {
      hitType: "event",
      eventCategory: dataMessage.eventCategory,
      eventAction: dataMessage.eventAction,
      eventLabel: dataMessage.eventLabel,
    });
  }
}

function submitAttrToFirebase(user, attrName, attrValue) {
  const uid = user.uid;
  let obj = {};
  obj[attrName] = attrValue;
  const database = getDatabase();
  update(ref(database, `/customProfile`), obj);
}

export function submitAttr(dataMessage) {
  if (!dataMessage.attr || !dataMessage.value) return;

  const attrName = dataMessage.attr.toLowerCase(),
    attrValue = dataMessage.value;

  DataStoreUtils.isUserAuthenticated((userData) => {
    if (userData && userData.uid) {
      submitAttrToFirebase(userData, attrName, attrValue);
    }
  });
}

function buildBasicUserProperties(user) {
  if (user && user.uid && user.providerData && user.providerData.length > 0) {
    const profile = user.providerData[0];

    return {
      name: profile["displayName"],
      email: profile["email"],
      uid: user.uid,
    };
  }
}

/**
 * List of all third party tags which are needed in Requestly Apps
 */

export function addGoogleAnalytics() {
  (function (i, s, o, g, r, a, m) {
    i["GoogleAnalyticsObject"] = r;
    // eslint-disable-next-line no-unused-expressions
    (i[r] =
      i[r] ||
      function () {
        (i[r].q = i[r].q || []).push(arguments);
        // eslint-disable-next-line no-sequences
      }),
      (i[r].l = 1 * new Date());
    // eslint-disable-next-line no-unused-expressions,no-sequences
    (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
  })(
    window,
    document,
    "script",
    "https://www.google-analytics.com/analytics.js",
    "ga"
  );
  window.ga("create", "UA-46800996-7", "auto");
  window.ga("require", "GTM-KN4N9B7");
}

export function identifyUser(user) {
  const basicUserProperties = buildBasicUserProperties(user);
  // Identify User in window.RQ too so we can track user attributes in Firebase later on
  window.RQ = window.RQ || {};
  window.RQ["user"] = basicUserProperties;

  /**
   * Track User in GA
   * Set the user ID using signed-in user_id.
   */
  window.ga("set", "userId", user.uid);
  window.ga("set", TRACKING.GA_CUSTOM_DIMENSIONS.USER_ID, user.uid);
}
