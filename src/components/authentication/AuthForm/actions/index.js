import isEmpty from "is-empty";
import isEmail from "validator/lib/isEmail";
import { toast } from "utils/Toast.js";
//AUTH ACTIONS
import {
  emailSignIn,
  signUp,
  forgotPassword,
  signOut,
  googleSignIn,
  verifyOobCode,
  resetPassword,
  googleSignInDesktopApp,
  microsoftSignIn,
  appleSignIn,
} from "../../../../actions/FirebaseActions";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import APP_CONSTANTS from "../../../../config/constants";
//UTILS
import { submitEventUtil } from "../../../../utils/AnalyticsUtils";
import { redirectToForgotPassword } from "../../../../utils/RedirectionUtils";
import { getGreeting } from "../../../../utils/FormattingHelper";
import { trackLoginRequestedEvent } from "utils/analytics/auth/login_requested";
import { AUTH_PROVIDERS, PAGES } from "utils/analytics/constants";
import posthog from "posthog-js";
import { isExtensionInstalled } from "actions/ExtensionActions";
import { StorageService } from "init";

const authTypes = {
  FORGOT_PASSWORD: "forgot-password",
  RESET_PASSWORD: "reset-password",
  SIGN_IN: "sign-in",
  SIGN_UP: "sign-up",
};

const showError = (err) => {
  toast.error(err, { hideProgressBar: true, autoClose: 6000 });
};
const showWarning = (err) => {
  toast.warn(err, { hideProgressBar: true });
};
const showInfo = (err) => {
  toast.info(err, { hideProgressBar: true, autoClose: 5000 });
};

const getForgotPasswordErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/user-not-found":
      return "Unable to find an account with this email address. Please try again.";

    case "auth/invalid-email":
      return "This email seems invalid. Please recheck.";

    default:
      return (
        "Unable to request new password this time. Please write us at " +
        GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL
      );
  }
};

const getSignInErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/invalid-email":
      return "Please enter a valid email";

    case "auth/user-not-found":
      return "This email is not registered. Please sign up.";

    case "auth/wrong-password":
      return "Invalid email or password. Please try again or use Forgot Password.";

    case "auth/user-disabled":
      return (
        "Sorry but your account is disabled. Please write us at " +
        GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL
      );

    default:
      return (
        "Sorry, we couldn’t log you in. Please write us at " +
        GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL
      );
  }
};

const getSignUpErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "no-name":
      return "Please enter your name.";
    case "no-email":
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "no-password":
      return "Please enter a password to create.";
    case "auth/email-already-in-use":
      return "The email you entered is already in use. Try signing in.";
    case "auth/weak-password":
      return "Please choose a stronger password";
    case "auth/operation-not-allowed":
      return (
        "Sorry but your account is disabled. Please write us at " +
        GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL
      );
    default:
      return (
        "Sorry, we couldn’t sign you up. Please write us at " +
        GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL
      );
  }
};

const getPrettyErrorMessage = (authType, errorCode) => {
  switch (authType) {
    case authTypes.SIGN_IN:
      return getSignInErrorMessage(errorCode);

    case authTypes.SIGN_UP:
      return getSignUpErrorMessage(errorCode);

    case authTypes.FORGOT_PASSWORD:
      return getForgotPasswordErrorMessage(errorCode);

    default:
      return (
        "An unexpected has occurred. Please write us at " +
        GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL
      );
  }
};

export const handleEmailSignInButtonOnClick = (
  event,
  email,
  password,
  isSignUp,
  appMode,
  setLoader,
  src,
  callbackOnSuccess,
  callbackOnFail
) => {
  event && event.preventDefault();
  //ANALYTICS
  switch (src) {
    case APP_CONSTANTS.FEATURES.SHARED_LISTS:
      submitEventUtil(
        GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.SHARED_LIST,
        GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LOGIN_REQUESTED,
        "Email Login requested on SharedList index page"
      );

      // GA4
      trackLoginRequestedEvent({
        place: PAGES.SHARED_LISTS.INDEX_PAGE,
      });

      break;
    case APP_CONSTANTS.FEATURES.RULES:
      submitEventUtil(
        GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULES,
        GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LOGIN_REQUESTED,
        "Email Login requested on rules index page"
      );

      // GA4
      trackLoginRequestedEvent({
        place: PAGES.RULES.INDEX_PAGE,
      });

      break;

    default:
      break;
  }

  if (isEmpty(email) || !isEmail(email)) {
    showWarning("Please enter a valid email");
    return null;
  }
  if (isEmpty(password)) {
    showWarning("Oops! You forgot to enter password");
    return null;
  }
  setLoader && setLoader(true);
  emailSignIn(email, password, isSignUp)
    .then(({ result }) => {
      if (result.user.uid) {
        showInfo(`${getGreeting()}, ${result.user.displayName.split(" ")[0]}`);

        //ANALYTICS
        switch (src) {
          case APP_CONSTANTS.FEATURES.SHARED_LISTS:
            submitEventUtil(
              GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.SHARED_LIST,
              GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LOGIN_DONE,
              "Email Login done on SharedList index page"
            );

            break;
          case APP_CONSTANTS.FEATURES.RULES:
            submitEventUtil(
              GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULES,
              GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LOGIN_DONE,
              "Email Login done on Rules index page"
            );

            break;
          default:
            break;
        }

        callbackOnSuccess && callbackOnSuccess(result.user.uid);
      } else {
        showError("Sorry we couldn't log you in. Can you please retry?");
        setLoader && setLoader(false);
        //Clear password field
        callbackOnFail && callbackOnFail();
      }
    })
    .catch(({ errorCode }) => {
      showError(getPrettyErrorMessage(authTypes.SIGN_IN, errorCode));
      //ANALYTICS
      if (src) {
        switch (src) {
          case APP_CONSTANTS.FEATURES.SHARED_LISTS:
            submitEventUtil(
              GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.SHARED_LIST,
              GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LOGIN_REJECTED,
              "Email Login rejected on SharedList index page"
            );

            break;
          case APP_CONSTANTS.FEATURES.RULES:
            submitEventUtil(
              GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULES,
              GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LOGIN_REJECTED,
              "Email Login rejected on Rules index page"
            );

            break;

          default:
            break;
        }
      }
      setLoader && setLoader(false);
      callbackOnFail && callbackOnFail();
    });
};
export const handleGoogleSignInButtonOnClick = (
  setLoader,
  src,
  callbackOnSuccess,
  appMode,
  MODE,
  navigate
) => {
  setLoader && setLoader(true);

  //ANALYTICS
  switch (src) {
    case APP_CONSTANTS.FEATURES.SHARED_LISTS:
      submitEventUtil(
        GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.SHARED_LIST,
        GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LOGIN_REQUESTED,
        "Google Login requested on SharedList index page"
      );
      trackLoginRequestedEvent({
        auth_provider: AUTH_PROVIDERS.GMAIL,
        place: PAGES.SHARED_LISTS.INDEX_PAGE,
      });
      break;
    case APP_CONSTANTS.FEATURES.RULES:
      submitEventUtil(
        GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULES,
        GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LOGIN_REQUESTED,
        "Google Login requested on rules index page"
      );
      trackLoginRequestedEvent({
        auth_provider: AUTH_PROVIDERS.GMAIL,
        place: PAGES.RULES.INDEX_PAGE,
      });
      break;

    default:
      break;
  }

  const functionToCall =
    appMode && appMode === GLOBAL_CONSTANTS.APP_MODES.DESKTOP
      ? googleSignInDesktopApp
      : googleSignIn;

  functionToCall()
    .then((result) => {
      if (result && result.uid) {
        showInfo(`${getGreeting()}, ${result.displayName.split(" ")[0]}`);
        //ANALYTICS
        switch (src) {
          case APP_CONSTANTS.FEATURES.SHARED_LISTS:
            submitEventUtil(
              GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.SHARED_LIST,
              GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LOGIN_DONE,
              "Google Login done on SharedList index page"
            );

            break;
          case APP_CONSTANTS.FEATURES.RULES:
            submitEventUtil(
              GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULES,
              GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LOGIN_DONE,
              "Google Login done on Rules index page"
            );

            break;
          default:
            break;
        }

        callbackOnSuccess && callbackOnSuccess();
      } else {
        showError(
          "Sorry, the email or password you have entered isn't right. Can you please try again?"
        );
        setLoader && setLoader(false);
        //ANALYTICS
        if (src) {
          switch (src) {
            case APP_CONSTANTS.FEATURES.SHARED_LISTS:
              submitEventUtil(
                GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.SHARED_LIST,
                GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LOGIN_REJECTED,
                "Google Login rejected on SharedList index page"
              );
              // trackLoginFailedEvent({
              //   auth_provider: AUTH_PROVIDERS.GMAIL,
              //   place: PAGES.SHARED_LISTS.INDEX_PAGE,
              // });
              break;
            case APP_CONSTANTS.FEATURES.RULES:
              submitEventUtil(
                GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULES,
                GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LOGIN_REJECTED,
                "Google Login rejected on Rules index page"
              );
              // trackLoginFailedEvent({
              //   auth_provider: AUTH_PROVIDERS.GMAIL,
              //   place: PAGES.RULES.INDEX_PAGE,
              // });
              break;

            default:
              break;
          }
        }
      }
    })
    .catch(() => {
      setLoader && setLoader(false);
    });
};

export const handleMicrosoftSignInButtonOnClick = (
  setLoader,
  src,
  callbackOnSuccess,
  MODE,
  navigate
) => {
  setLoader && setLoader(true);

  //ANALYTICS
  switch (src) {
    case APP_CONSTANTS.FEATURES.SHARED_LISTS:
      submitEventUtil(
        GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.SHARED_LIST,
        GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LOGIN_REQUESTED,
        "Microsoft Login requested on SharedList index page"
      );
      trackLoginRequestedEvent({
        auth_provider: AUTH_PROVIDERS.MICROSOFT,
        place: PAGES.SHARED_LISTS.INDEX_PAGE,
      });
      break;
    case APP_CONSTANTS.FEATURES.RULES:
      submitEventUtil(
        GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULES,
        GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LOGIN_REQUESTED,
        "Microsoft Login requested on rules index page"
      );
      trackLoginRequestedEvent({
        auth_provider: AUTH_PROVIDERS.MICROSOFT,
        place: PAGES.RULES.INDEX_PAGE,
      });
      break;

    default:
      break;
  }

  microsoftSignIn()
    .then((result) => {
      if (result && result.uid) {
        showInfo(`${getGreeting()}, ${result.displayName.split(" ")[0]}`);
        //ANALYTICS
        switch (src) {
          case APP_CONSTANTS.FEATURES.SHARED_LISTS:
            submitEventUtil(
              GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.SHARED_LIST,
              GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LOGIN_DONE,
              "Microsoft Login done on SharedList index page"
            );
            // trackLoginSuccessEvent({
            //   auth_provider: AUTH_PROVIDERS.MICROSOFT,
            //   uid: result.uid,
            //   place: PAGES.SHARED_LISTS.INDEX_PAGE,
            // });
            break;
          case APP_CONSTANTS.FEATURES.RULES:
            submitEventUtil(
              GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULES,
              GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LOGIN_DONE,
              "Microsoft Login done on Rules index page"
            );
            // trackLoginSuccessEvent({
            //   auth_provider: AUTH_PROVIDERS.MICROSOFT,
            //   uid: result.uid,
            //   place: PAGES.RULES.INDEX_PAGE,
            // });
            break;
          default:
            break;
        }

        callbackOnSuccess && callbackOnSuccess();
      } else {
        showError(
          "Sorry, the email or password you have entered isn't right. Can you please try again?"
        );
        setLoader && setLoader(false);
        //ANALYTICS
        if (src) {
          switch (src) {
            case APP_CONSTANTS.FEATURES.SHARED_LISTS:
              submitEventUtil(
                GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.SHARED_LIST,
                GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LOGIN_REJECTED,
                "Microsoft login rejected on SharedList index page"
              );
              break;
            case APP_CONSTANTS.FEATURES.RULES:
              submitEventUtil(
                GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULES,
                GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LOGIN_REJECTED,
                "Microsoft login rejected on Rules index page"
              );
              break;

            default:
              break;
          }
        }
      }
    })
    .catch(() => {
      setLoader && setLoader(false);
    });
};

export const handleAppleSignInButtonOnClick = (
  setLoader,
  src,
  callbackOnSuccess,
  MODE,
  navigate
) => {
  setLoader && setLoader(true);

  //ANALYTICS
  switch (src) {
    case APP_CONSTANTS.FEATURES.SHARED_LISTS:
      submitEventUtil(
        GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.SHARED_LIST,
        GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LOGIN_REQUESTED,
        "Apple Login requested on SharedList index page"
      );
      trackLoginRequestedEvent({
        auth_provider: AUTH_PROVIDERS.APPLE,
        place: PAGES.SHARED_LISTS.INDEX_PAGE,
      });
      break;
    case APP_CONSTANTS.FEATURES.RULES:
      submitEventUtil(
        GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULES,
        GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LOGIN_REQUESTED,
        "Apple Login requested on rules index page"
      );
      trackLoginRequestedEvent({
        auth_provider: AUTH_PROVIDERS.APPLE,
        place: PAGES.RULES.INDEX_PAGE,
      });
      break;

    default:
      break;
  }

  appleSignIn()
    .then((result) => {
      if (result && result.uid) {
        showInfo(`${getGreeting()}, ${result.displayName.split(" ")[0]}`);
        //ANALYTICS
        switch (src) {
          case APP_CONSTANTS.FEATURES.SHARED_LISTS:
            submitEventUtil(
              GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.SHARED_LIST,
              GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LOGIN_DONE,
              "Apple Login done on SharedList index page"
            );

            break;
          case APP_CONSTANTS.FEATURES.RULES:
            submitEventUtil(
              GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULES,
              GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LOGIN_DONE,
              "Apple Login done on Rules index page"
            );
            break;
          default:
            break;
        }

        callbackOnSuccess && callbackOnSuccess();
      } else {
        showError(
          "Sorry, the email or password you have entered isn't right. Can you please try again?"
        );
        setLoader && setLoader(false);
        //ANALYTICS
        if (src) {
          switch (src) {
            case APP_CONSTANTS.FEATURES.SHARED_LISTS:
              submitEventUtil(
                GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.SHARED_LIST,
                GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LOGIN_REJECTED,
                "Apple login rejected on SharedList index page"
              );
              break;
            case APP_CONSTANTS.FEATURES.RULES:
              submitEventUtil(
                GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULES,
                GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LOGIN_REJECTED,
                "Apple login rejected on Rules index page"
              );
              break;

            default:
              break;
          }
        }
      }
    })
    .catch(() => {
      setLoader && setLoader(false);
    });
};

export const handleSignUpButtonOnClick = (
  event,
  name,
  email,
  password,
  referralCode,
  setLoader,
  navigate,
  emailOptin,
  isSignUp
) => {
  event.preventDefault();

  setLoader(true);
  signUp(name, email, password, referralCode)
    .then(({ status, errorCode }) => {
      if (status) {
        // showInfo(`Hey ${name}!, welcome aboard!`);
        showInfo(`Check your email for link to verify email`);
        handleEmailSignInButtonOnClick(null, email, password, isSignUp);
      } else {
        showError(getPrettyErrorMessage(authTypes.SIGN_UP, errorCode));
        setLoader(false);
      }
    })
    .catch(({ errorCode }) => {
      showError(getPrettyErrorMessage(authTypes.SIGN_UP, errorCode));
      setLoader(false);
    });
};

export const handleForgotPasswordButtonOnClick = (
  event,
  email,
  setLoader,
  callbackOnSuccess
) => {
  event.preventDefault();
  if (isEmpty(email) || !isEmail(email)) {
    showWarning("Please enter a valid email");
    return null;
  }

  setLoader(true);
  forgotPassword(email)
    .then(({ status, msg }) => {
      if (status) {
        showInfo(msg);
        setLoader(false);
        callbackOnSuccess && callbackOnSuccess();
      } else {
        showError(msg);
        setLoader(false);
      }
    })
    .catch(({ errorCode }) => {
      showError(getPrettyErrorMessage(authTypes.FORGOT_PASSWORD, errorCode));
      setLoader(false);
    });
};

//Reset Password

const getOobCode = () => {
  const params = new URLSearchParams(window.location.search);
  if (params.has("oobCode")) {
    return params.get("oobCode");
  } else {
    return null;
  }
};

const doResetPassword = (
  oobCode,
  email,
  newPassword,
  setLoader,
  callbackOnSuccess
) => {
  const handleResponse = (status) => {
    if (status) {
      setLoader(false);
      if (email) {
        callbackOnSuccess && callbackOnSuccess();
        showInfo("Password reset successful. Logging you in.");
        handleEmailSignInButtonOnClick(null, email, newPassword);
      }
    } else {
      showError(
        "Please try again with a stronger password or request a new reset link."
      );
      setLoader(false);
    }
  };

  resetPassword(oobCode, newPassword)
    .then(
      ({ status, msg }) => {
        handleResponse(status);
      },
      ({ status, msg }) => {
        handleResponse(status);
      }
    )
    .catch(() => {
      handleResponse(false);
    });
};

export const handleResetPasswordOnClick = (
  event,
  password,
  setLoader,
  navigate,
  callbackOnSuccess
) => {
  event.preventDefault();
  if (isEmpty(password)) {
    showWarning("Please set a new password");
    return null;
  }
  setLoader(true);

  const oobCode = getOobCode();

  const handleVerificationResponse = (status, email) => {
    if (status) {
      doResetPassword(oobCode, email, password, setLoader, callbackOnSuccess);
    } else {
      showError(
        "This Link has been expired. Please create a new reset request."
      );
      setLoader(false);
      redirectToForgotPassword(navigate);
    }
  };

  verifyOobCode(oobCode)
    .then(
      ({ status, msg, email }) => {
        handleVerificationResponse(status, email);
      },
      ({ status, msg }) => {
        handleVerificationResponse(status, null);
      }
    )
    .catch(() => {
      handleVerificationResponse(false, null);
    });
};

export const handleLogoutButtonOnClick = async (appMode) => {
  try {
    if (window.location.host.includes("app.requestly.io")) {
      posthog.reset();
    }
    if (
      appMode === GLOBAL_CONSTANTS.APP_MODES.EXTENSION &&
      !isExtensionInstalled()
    ) {
      return signOut();
    }

    if (window.uid && window.isSyncEnabled) {
      StorageService(appMode).clearDB();
    }

    return signOut();
  } catch (err) {
    return console.log(err);
  }
};
