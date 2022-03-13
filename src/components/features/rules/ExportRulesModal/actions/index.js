//ACTIONS
import { getRulesAndGroupsFromRuleIds } from "../../../../../utils/rules/misc";
//DOWNLOAD.JS
const fileDownload = require("js-file-download");

export const prepareContentToExport = (
  appMode,
  selectedRuleIds,
  groupwiseRules
) => {
  return new Promise((resolve, reject) => {
    getRulesAndGroupsFromRuleIds(appMode, selectedRuleIds, groupwiseRules).then(
      ({ rules, groups }) => {
        groups.forEach((group) => (group.children = []));
        resolve({
          fileContent: JSON.stringify(rules.concat(groups), null, 2),
          rulesCount: rules.length,
          groupsCount: groups.length,
        });
      }
    );
  });
};

export const initiateDownload = (data) => {
  fileDownload(data, "requestly_rules.txt", "text/plain");
};
