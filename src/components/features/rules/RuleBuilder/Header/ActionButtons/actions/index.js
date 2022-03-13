//UTILS
import { redirectToRules } from "../../../../../../../utils/RedirectionUtils";
//EXTERNALS
import { StorageService } from "../../../../../../../init";
//REDUCER ACTION OBJECTS
import { getClearCurrentlySelectedRuleAndConfigActionObject } from "../../../../../../../store/action-objects";
import { generateObjectCreationDate } from "utils/DateTimeUtils";

const clearCurrentlySelectedRuleAndConfig = (dispatch) => {
  dispatch(getClearCurrentlySelectedRuleAndConfigActionObject());
};

export const saveRule = async (
  appMode,
  dispatch,
  newRuleOrGroupObject,
  navigate,
  callback
) => {
  //Set the modification date of rule
  const ruleToSave = {
    ...newRuleOrGroupObject,
    modificationDate: generateObjectCreationDate(),
  };
  //Save the rule
  await StorageService(appMode).saveRuleOrGroup(ruleToSave);
  //Fetch the group related to that rule
  return StorageService(appMode)
    .getRecord(ruleToSave.groupId)
    .then((result_1) => {
      const exit = () => {};

      //Set the modification date of group
      if (result_1 && result_1.objectType === "group") {
        const groupToSave = {
          ...result_1,
          modificationDate: generateObjectCreationDate(),
        };
        //Save the group
        StorageService(appMode)
          .saveRuleOrGroup(groupToSave)
          .then(() => {
            // Execute callback
            callback && callback();
            //Continue exit
            exit();
          });
      } else {
        // Execute callback
        callback && callback();
        //If group doesnt exist, exit anyway
        exit();
      }
    });
};

export const closeBtnOnClickHandler = (dispatch, navigate) => {
  clearCurrentlySelectedRuleAndConfig(dispatch);
  redirectToRules(navigate);
};
