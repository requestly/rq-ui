import isEmpty from "is-empty";
//UTILS
import {
  isValidUrl,
  getByteSize,
} from "../../../../../../../../utils/FormattingHelper";
//CONSTANTS
import APP_CONSTANTS from "../../../../../../../../config/constants";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
// Actions
import { getResponseBodyCharacterLimit } from "../../../../../RulePairs/Pairs/Rows/RowsMarkup/ResponseBodyRow/actions";
// LODASH
import { inRange } from "lodash";
import { getFeatureLimits } from "../../../../../../../../utils/FeatureManager";
import { getFunctions, httpsCallable } from "firebase/functions";

export const validateRule = (rule, user, appMode, storageType) => {
  // fetch planName from global state
  const planName =
    user.details?.planDetails?.planName ||
    APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE;

  let output;
  if (isEmpty(rule.name)) {
    return {
      result: false,
      message: `Please provide a rule name`,
    };
  } else if (isEmpty(rule.pairs)) {
    return {
      result: false,
      message: `Opps! Rule must have atleast one pair`,
    };
  }

  //Rule specific validations

  //Redirect Rule
  else if (rule.ruleType === GLOBAL_CONSTANTS.RULE_TYPES.REDIRECT) {
    rule.pairs.forEach((pair) => {
      //Source shouldn't be empty
      if (isEmpty(pair.source.value)) {
        output = {
          result: false,
          message: `Please enter a source`,
        };
      }
      //Destination shouldn't be empty
      else if (isEmpty(pair.destination)) {
        output = {
          result: false,
          message: `Please enter a destination URL`,
        };
      }
      //Destination should be a valid URL
      else if (
        !isValidUrl(pair.destination) &&
        !pair.destination.startsWith("$")
      ) {
        // Try auto-fixing
        if (
          !pair.destination.startsWith("$") &&
          !pair.destination.startsWith("http://") &&
          !pair.destination.startsWith("https://") &&
          !pair.destination.startsWith("file://")
        ) {
          pair.destination = "http://" + pair.destination;

          // Now re-check
          if (!isValidUrl(pair.destination)) {
            output = {
              result: false,
              message: `Please enter a valid redirect URL`,
            };
          }
        }
      }
    });
  }

  //Cancel Rule
  else if (rule.ruleType === GLOBAL_CONSTANTS.RULE_TYPES.CANCEL) {
    rule.pairs.forEach((pair) => {
      //Source shouldn't be empty
      if (isEmpty(pair.source.value)) {
        output = {
          result: false,
          message: `Please enter a source`,
        };
      }
    });
  }

  //Replace Rule
  else if (rule.ruleType === GLOBAL_CONSTANTS.RULE_TYPES.REPLACE) {
    rule.pairs.forEach((pair) => {
      //Part that need to be replaced shouldn't be empty
      if (isEmpty(pair.from)) {
        output = {
          result: false,
          message: `Please enter the part that needs to be replaced`,
        };
      }
    });
  }

  //Headers Rule
  else if (rule.ruleType === GLOBAL_CONSTANTS.RULE_TYPES.HEADERS) {
    rule.pairs.forEach((pair) => {
      //Header name shouldn't be empty
      if (isEmpty(pair.header)) {
        output = {
          result: false,
          message: `Please enter the header name`,
        };
      }
      //Header value shouldn't be empty unless you're removing it
      if (pair.type !== "Remove" && isEmpty(pair.value)) {
        output = {
          result: false,
          message: `Please enter the header value`,
        };
      }
    });
  }

  //Query Param Rule
  else if (rule.ruleType === GLOBAL_CONSTANTS.RULE_TYPES.QUERYPARAM) {
    rule.pairs.forEach((pair) => {
      pair.modifications.forEach((modification) => {
        //Param name shoudn't be empty unless user is removing all params
        if (modification.type !== "Remove All" && isEmpty(modification.param)) {
          output = {
            result: false,
            message: `Please enter the param name`,
          };
        }
        //Param value shouln't be empty if user is adding it
        if (modification.type === "Add" && isEmpty(modification.value)) {
          output = {
            result: false,
            message: `Please enter the param value`,
          };
        }
      });
    });
  }

  //Insert Script Rule
  else if (rule.ruleType === GLOBAL_CONSTANTS.RULE_TYPES.SCRIPT) {
    const characterLimit = getFeatureLimits(
      APP_CONSTANTS.FEATURES.SCRIPT_RULE_CHARACTER_LIMIT,
      user,
      planName
    );
    rule.pairs.forEach((pair) => {
      //There should be atleast one source of script. Be it given library or a custom script
      if (isEmpty(pair.libraries) && isEmpty(pair.scripts)) {
        output = {
          result: false,
          message: `Please provide a script source`,
        };
      } else {
        pair.scripts.forEach((script) => {
          if (script.type === "code") {
            //Check if code isn't empty
            if (isEmpty(script.value)) {
              output = {
                result: false,
                message: `Please enter a valid script code`,
              };
            }
            //Check if code doesn't cross character limit
            else if (script.value.length >= characterLimit) {
              output = {
                result: false,
                message: `Script code should be less than ${characterLimit} characters`,
              };
            }
          }
          //Check if URL isn't empty. Can be absolute or relative
          else if (script.type === "url" && isEmpty(script.value)) {
            output = {
              result: false,
              message: `Please enter a valid script URL`,
            };
          }
        });
      }
    });
  }

  //Modify Response Rule
  else if (rule.ruleType === GLOBAL_CONSTANTS.RULE_TYPES.RESPONSE) {
    rule.pairs.forEach((pair) => {
      //Source shouldn't be empty
      if (isEmpty(pair.source.value)) {
        output = {
          result: false,
          message: `Please enter a source`,
        };
      }
      //Response body shouldn't be empty
      else if (isEmpty(pair.response.value)) {
        let message = `Please specify response body`;
        if (
          pair.response.type === GLOBAL_CONSTANTS.RESPONSE_BODY_TYPES.LOCAL_FILE
        ) {
          message = "Please select a file first";
        }
        output = {
          result: false,
          message: message,
        };
      }
      //Response body shouldn't cross char limits
      else if (
        getByteSize(pair.response.value) >
        getResponseBodyCharacterLimit(user, appMode, storageType)
      ) {
        output = {
          result: false,
          message: `Response should be less than ${getResponseBodyCharacterLimit(
            user,
            appMode,
            storageType
          )} characters.`,
        };
      }
    });
  }

  //User Agent Rule
  else if (rule.ruleType === GLOBAL_CONSTANTS.RULE_TYPES.USERAGENT) {
    rule.pairs.forEach((pair) => {
      if (isEmpty(pair.envType)) {
        output = {
          result: false,
          message: "Please select device type",
        };
      } else if (isEmpty(pair.env) && !pair.userAgent) {
        output = {
          result: false,
          message: "Please select UserAgent",
        };
      }
    });
  }

  //Delay Request Rule
  else if (rule.ruleType === GLOBAL_CONSTANTS.RULE_TYPES.DELAY) {
    rule.pairs.forEach((pair) => {
      const { delay } = pair;
      //URL shouldn't be empty
      if (isEmpty(pair.source.value)) {
        output = {
          result: false,
          message: `Please enter a source`,
        };
      }
      // Delay shouldn't be empty
      else if (isEmpty(delay)) {
        output = {
          result: false,
          message: `Delay cannot be empty`,
        };
      }
      // Delay should be a number
      else if (isNaN(delay) && parseInt(delay) !== 0) {
        output = {
          result: false,
          message: `Delay should be a Number`,
        };
      }
      // Delay between 1 & 5000
      else if (
        !inRange(
          parseInt(delay),
          GLOBAL_CONSTANTS.DELAY_REQUEST_CONSTANTS.MIN_DELAY_VALUE,
          GLOBAL_CONSTANTS.DELAY_REQUEST_CONSTANTS.MAX_DELAY_VALUE_NON_XHR + 1
        )
      ) {
        output = {
          result: false,
          message: `Delay should lie between ${GLOBAL_CONSTANTS.DELAY_REQUEST_CONSTANTS.MIN_DELAY_VALUE} and ${GLOBAL_CONSTANTS.DELAY_REQUEST_CONSTANTS.MAX_DELAY_VALUE_NON_XHR}`,
        };
      }
    });
  }

  if (output && output.result === false) {
    return output;
  }

  return {
    result: true,
  };
};

export const ruleModifiedAnalytics = (user) => {
  if (user.loggedIn) {
    const functions = getFunctions();
    const usageMetrics = httpsCallable(functions, "usageMetrics");
    const data = new Date().getTime();
    usageMetrics(data);
  }
};
