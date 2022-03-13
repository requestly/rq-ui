//EXTERNALS
import { StorageService } from "../../init";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import APP_CONSTANTS from "config/constants";
import { isExtensionInstalled } from "actions/ExtensionActions";
import { getAllRulesAndGroups } from "../rules/misc";
import { updateValueAsPromise } from "../../actions/FirebaseActions";
import {
  updateUserSyncMetadata,
  updateUserSyncRecords,
  removeUserSyncRecords,
  getSyncTimestamp,
  getAllLocalRecords,
  getAllSyncedRecords,
  processRecordsArrayIntoObject,
} from "./syncDataUtils";

const getCurrentTimestamp = () => {
  return Date.now();
};

/**
 * Sets current time as last-synced timestamp in firebase as well as appMode local storage
 * @param {String} uid
 * @param {String} appMode-const appmode from globalstore
 * @param {Number} timestampToUse epoce timestamp
 */
const setLastSyncTimestamp = (uid, appMode, timestampToUse) => {
  const timestamp = timestampToUse || getCurrentTimestamp();
  const syncTimestampObject = {
    [APP_CONSTANTS.LAST_SYNC_TIMESTAMP]: timestamp,
  };

  updateUserSyncMetadata(uid, syncTimestampObject, appMode); // update in firebase db and local storage
};

/**
 * Sets firebase timestamp as last-synced timestamp in local storage
 * @param {String} appMode-const appmode from globalstore
 * @param {Number} timestampToUse epoch timestamp
 */
const setLastSyncTimestampInLocalStorage = (appMode, timestampToUse = null) => {
  const syncTimestampObject = {
    [APP_CONSTANTS.LAST_SYNC_TIMESTAMP]: timestampToUse,
  };

  StorageService(appMode).saveRecord(syncTimestampObject);
};

export const setSyncState = async (uid, state) => {
  return new Promise((resolve, reject) => {
    updateValueAsPromise(["users", uid, "profile"], { isSyncEnabled: state })
      .then(() => resolve(true))
      .catch(() => reject(false));
  });
};

/**
 * Should run when records from storage are deleted and needs syncing with database. Expects an array of ruleIds
 * @param {Array} recordIds
 * @param {String} uid
 * @param {String} appMode
 */
export const syncRecordsRemoval = async (recordIds, uid, appMode) => {
  removeUserSyncRecords(uid, recordIds).then(() => {
    setLastSyncTimestamp(uid, appMode);
  });
};

/**
 * Should run when records are created/updated to sync with database
 * @param {Object} recordsObject
 * @param {String} uid
 * @param {String} appMode
 */
export const syncRecordUpdates = async (recordsObject, uid, appMode) => {
  updateUserSyncRecords(uid, recordsObject).then(() => {
    setLastSyncTimestamp(uid, appMode);
  });
};

export const syncAllRulesAndGroupsToFirebase = async (
  uid,
  appMode,
  timestamp
) => {
  const { rules, groups } = await getAllRulesAndGroups(appMode);

  const allRecords = [...rules, ...groups];
  const recordsObject = processRecordsArrayIntoObject(allRecords);

  updateUserSyncRecords(uid, recordsObject);
  setLastSyncTimestamp(uid, appMode, timestamp);
};

const mergeRecords = (firebaseRecords, localRecords) => {
  const mergedRecords = [...localRecords];

  firebaseRecords.forEach((record) => {
    const duplicateIndex = mergedRecords.findIndex(
      (data) => data.id === record.id
    );
    if (duplicateIndex !== -1) {
      const duplicateData = record[duplicateIndex];
      if (!duplicateData.lastModified || !record.lastModified) {
        return;
      }
      if (duplicateData.lastModified > record.lastModified) {
        mergedRecords.splice(duplicateIndex, 1, duplicateData);
      }
    } else {
      return mergedRecords.push(record);
    }
  });
  return mergedRecords;
};

const syncToLocalFromFirebase = (allSyncedRecords, appMode, timestamp) => {
  // clearing storage is necessary as if a deleted rule is synced then it needs to be deleted from the storage of every device
  // clear storage-> dump the entire firebase node in the storage
  StorageService(appMode).clearDB();
  setLastSyncTimestampInLocalStorage(appMode, timestamp);
  return StorageService(appMode).saveRulesOrGroupsWithoutSyncing(
    allSyncedRecords
  );
};

export const checkTimestampAndSync = async (uid, appMode) => {
  if (
    appMode === GLOBAL_CONSTANTS.APP_MODES.EXTENSION &&
    !isExtensionInstalled
  ) {
    return;
  }

  const { firebaseTimestamp, localTimestamp } = await getSyncTimestamp(
    uid,
    appMode
  );

  if (!firebaseTimestamp) {
    return syncAllRulesAndGroupsToFirebase(uid, appMode);
  } else {
    const allLocalRecords = await getAllLocalRecords(appMode);
    const allSyncedRecords = await getAllSyncedRecords(uid);
    // if rules in local and in firebase and !localts----> merge and sync to firebase
    if (
      !localTimestamp &&
      allLocalRecords.length > 0 &&
      allSyncedRecords.length > 0
    ) {
      // set current ts to both lts and fts
      const mergedRecords = mergeRecords(allSyncedRecords, allLocalRecords);
      return StorageService(appMode).saveMultipleRulesOrGroups(mergedRecords);
    }
    // else if no rules in local and !localts ---->  add to local from firebase
    else if (!localTimestamp && allLocalRecords.length === 0) {
      return syncToLocalFromFirebase(
        allSyncedRecords,
        appMode,
        firebaseTimestamp
      );
    }
    // else if fts>lts ---> add to local from firebase
    else if (firebaseTimestamp > localTimestamp) {
      return syncToLocalFromFirebase(
        allSyncedRecords,
        appMode,
        firebaseTimestamp
      );
    }
    // else if lts>fts ---> sync to firebase, this case is only possible when rules are not synced to firebase due to bad connection
    else if (localTimestamp > firebaseTimestamp) {
      return syncAllRulesAndGroupsToFirebase(uid, appMode, localTimestamp);
    }
  }
};
