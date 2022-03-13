import DataStoreUtils from "../../../../../utils/DataStoreUtils";
import {
  getSpecificUserSharedListPath,
  getPublicSharedListPath,
} from "../../../../../utils/db/UserModel";
//Reducer Actions
import { getUpdateRefreshPendingStatusActionObject } from "../../../../../store/action-objects";

export const deleteSharedList = (userId, sharedListId) => {
  // Delete the node under user node
  const sharedListToDeletePath = getSpecificUserSharedListPath(
    userId,
    sharedListId
  );
  const deleteNodeUnderUser = DataStoreUtils.setValue(
    sharedListToDeletePath,
    null
  );

  // Also delete the node under public/sharedList node
  const publicSharedListPath = getPublicSharedListPath(sharedListId);
  const deleteNodeUnderPublic = DataStoreUtils.setValue(
    publicSharedListPath,
    null
  );

  return Promise.all([deleteNodeUnderUser, deleteNodeUnderPublic]);
};

export const refreshPendingStatus = (dispatch) => {
  //Update state: Refresh SharedLists Pending Status
  dispatch(getUpdateRefreshPendingStatusActionObject("sharedLists"));
};
