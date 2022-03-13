//UTILS
import { generateSharedListId } from "../../../../../utils/FormattingHelper";
import { getRulesAndGroupsFromRuleIds } from "../../../../../utils/rules/misc";
import {
  getPublicSharedListPath,
  getUserSharedListsPath,
} from "../../../../../utils/db/UserModel";
import DataStoreUtils from "../../../../../utils/DataStoreUtils";
import { generateObjectCreationDate } from "utils/DateTimeUtils";

export const createSharedList = (
  appMode,
  rulesIdsToShare,
  sharedListName,
  groupwiseRules,
  uid
) => {
  const sharedListId = generateSharedListId();
  return new Promise((resolve) => {
    //Fetch rules and groups that would be stored in this shared list
    getRulesAndGroupsFromRuleIds(appMode, rulesIdsToShare, groupwiseRules).then(
      ({ rules, groups }) => {
        groups.forEach((group) => (group.children = []));
        let listNodePath = getPublicSharedListPath(sharedListId);
        let userSharedListPath = getUserSharedListsPath(uid);
        userSharedListPath.push(sharedListId);
        // set sharedListData
        const sharedListData = {
          access: {
            owner: uid,
          },
          shareId: sharedListId,
          rules: rules,
          groups: groups,
          isEnabled: true,
        };
        //Set shared list details in user node
        const setSharedListInUserNode = DataStoreUtils.setValue(
          userSharedListPath,
          {
            listName: sharedListName,
            shareId: sharedListId,
            creationDate: generateObjectCreationDate(),
            importCount: 0,
          }
        );

        // Set uid of owner in access node
        const setSharedListInPublicNode = DataStoreUtils.setValue(
          listNodePath,
          sharedListData
        );

        Promise.all([setSharedListInUserNode, setSharedListInPublicNode]).then(
          () => {
            resolve({
              sharedListId,
              sharedListName,
              sharedListData,
            });
          }
        );
      }
    );
  });
};

export const editSharedList = (sharedListId, uid, sharedListName) => {
  return DataStoreUtils.updateValueAsPromise(
    ["users", uid, "sharedLists", sharedListId],
    { listName: sharedListName }
  );
};
