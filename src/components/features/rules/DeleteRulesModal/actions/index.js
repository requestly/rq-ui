//EXTERNALS
import { StorageService } from "../../../../../init";
import { getExecutionLogsId } from "../../../../../utils/rules/misc";
import { toast } from "utils/Toast";

export const deleteRulesFromStorage = async (
  appMode,
  rulesToDelete,
  callback
) => {
  const executionLogsToDelete = [];
  rulesToDelete.forEach((ruleId) => {
    executionLogsToDelete.push(getExecutionLogsId(ruleId));
  });

  await StorageService(appMode).removeRecords(rulesToDelete);
  await StorageService(appMode).removeRecords(executionLogsToDelete);

  toast.info(`Deleted selected rules.`);

  return callback();
};
