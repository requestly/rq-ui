import {
  getValueAsPromise,
  updateValueAsPromise,
} from "../../actions/FirebaseActions";
import APP_CONSTANTS from "../../config/constants";
import { StorageService } from "../../init";
import { getAllRulesAndGroups } from "../rules/misc";

export const updateUserSyncMetadata = (uid, metadata, appMode) => {
  return new Promise((resolve) => {
    updateValueAsPromise(["sync", uid, "metadata"], metadata);
    StorageService(appMode).saveRecord(metadata);
    resolve();
  });
};

export const updateUserSyncRecords = (uid, records) => {
  return new Promise((resolve) => {
    updateValueAsPromise(["sync", uid, "records"], records);
    resolve();
  });
};

/**
 * Removes >=1 deleted recordId from sync node
 * @param {String} uid user uid
 * @param {Array} recordIds List of deleted rule ids
 */
export const removeUserSyncRecords = (uid, recordIds) => {
  const recordIdsObject = {};
  recordIds.forEach((recordId) => {
    recordIdsObject[`/sync/${uid}/records/${recordId}`] = null;
  });
  return new Promise((resolve) => {
    // null is passed to update Value as no node ref is
    // required when deleting multiple value using update function
    // reference: https://firebase.google.com/docs/database/web/read-and-write#:~:text=You%20can%20use-,this,-technique%20with%20update
    updateValueAsPromise(null, recordIdsObject);
    resolve();
  });
};

export const getSyncTimestamp = (uid, appMode) => {
  const syncTimestamp = {};
  return new Promise(async (resolve) => {
    try {
      const val = await getValueAsPromise(["sync", uid, "metadata"]);
      syncTimestamp["firebaseTimestamp"] =
        val[APP_CONSTANTS.LAST_SYNC_TIMESTAMP];
    } catch {
      syncTimestamp["firebaseTimestamp"] = null;
    }
    try {
      syncTimestamp["localTimestamp"] = await StorageService(appMode).getRecord(
        APP_CONSTANTS.LAST_SYNC_TIMESTAMP
      );
    } catch {
      syncTimestamp["localTimestamp"] = null;
    }
    resolve(syncTimestamp);
  });
};

export const processRecordsObjectIntoArray = (records) => {
  const recordsArray = [];
  Object.keys(records).forEach((key) => {
    recordsArray.push(records[key]);
  });
  return recordsArray;
};

export const processRecordsArrayIntoObject = (recordsArray) => {
  const recordsObject = {};
  recordsArray.forEach((record) => {
    recordsObject[record.id] = record;
  });
  return recordsObject;
};

export const getAllSyncedRecords = (uid) => {
  return new Promise((resolve) => {
    getValueAsPromise(["sync", uid, "records"])
      .then((val) => {
        const recordsArr = processRecordsObjectIntoArray(val);
        resolve(recordsArr);
      })
      .catch(() => resolve([]));
  });
};

export const getAllLocalRecords = async (appMode) => {
  const { rules, groups } = await getAllRulesAndGroups(appMode);
  return [...rules, ...groups];
};
