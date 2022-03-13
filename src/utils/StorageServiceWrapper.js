//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
//UTILS
import { getStorageHelper } from "../engines";
import { syncRecordsRemoval, syncRecordUpdates } from "./syncing/SyncUtils";

class StorageServiceWrapper {
  constructor(options) {
    this.appMode = options.appMode || GLOBAL_CONSTANTS.APP_MODES.EXTENSION;
    this.StorageHelper = getStorageHelper(this.appMode);
    this.primaryKeys = options.primaryKeys || ["objectType", "ruleType"];
    this.records = [];
    this.isRecordsFetched = false;
    this.cachingEnabled = options["cacheRecords"];

    this.saveRecordWithID = this.saveRecordWithID.bind(this);
    this.saveRecord = this.saveRecord.bind(this);
    this.getRecord = this.getRecord.bind(this);
    this.getRecords = this.getRecords.bind(this);
  }

  getAllRecords() {
    return this.StorageHelper.getStorageSuperObject();
  }

  getRecords(objectType, forceFetch) {
    const self = this;

    return new Promise((resolve, reject) => {
      /* If records have been read from storage, return the cached values */
      if (self.cachingEnabled && self.isRecordsFetched && !forceFetch) {
        resolve(self.filterRecordsByType(self.records, objectType));
        return;
      }

      this.StorageHelper.getStorageSuperObject().then(function (superObject) {
        // Clear the existing records
        self.records.length = 0;

        for (let key in superObject) {
          if (self.hasPrimaryKey(superObject[key])) {
            self.records.push(superObject[key]);
          }
        }

        self.isRecordsFetched = true;

        resolve(self.filterRecordsByType(self.records, objectType));
      });
    });
  }

  hasPrimaryKey(record) {
    for (let index = 0; index < this.primaryKeys.length; index++) {
      if (typeof record[this.primaryKeys[index]] !== "undefined") {
        return true;
      }
    }

    return false;
  }

  filterRecordsByType(records, requestedObjectType) {
    if (!requestedObjectType) {
      return records;
    }

    return records.filter((record) => {
      let objectType = record.objectType || GLOBAL_CONSTANTS.OBJECT_TYPES.RULE;
      return objectType === requestedObjectType;
    });
  }

  async saveRecord(object) {
    await this.StorageHelper.saveStorageObject(object);
    this.updateRecord(object);
  }

  saveRuleOrGroup(object) {
    const formattedObject = {
      [object.id]: { ...object, lastModified: new Date().getTime() },
    };
    if (window.isSyncEnabled) {
      syncRecordUpdates(formattedObject, window.uid, this.appMode);
    }
    return this.saveRecord(formattedObject);
  }

  saveMultipleRulesOrGroups(array) {
    const formattedObject = {};
    array.forEach((object) => {
      if (object && object.id) formattedObject[object.id] = object;
    });
    if (window.isSyncEnabled) {
      syncRecordUpdates(formattedObject, window.uid, this.appMode);
    }
    return this.saveRecord(formattedObject);
  }

  saveRulesOrGroupsWithoutSyncing(array) {
    const formattedObject = {};
    array.forEach((object) => {
      if (object && object.id) formattedObject[object.id] = object;
    });
    return this.saveRecord(formattedObject);
  }

  /**
   * Saves the object which contains ID so that we do not need to specify id as the key and whole object as value
   * @param object
   * @returns {Promise<any>}
   */
  async saveRecordWithID(object) {
    await this.StorageHelper.saveStorageObject({ [object.id]: object });
    this.updateRecord(object);
  }

  getRecord(key) {
    return this.StorageHelper.getStorageObject(key);
  }

  async removeRecord(key) {
    await this.StorageHelper.removeStorageObject(key);
    if (window.isSyncEnabled) {
      syncRecordsRemoval([key], window.uid, this.appMode);
    }
    this.deleteRecord(key);
  }

  removeRecords(array) {
    if (window.isSyncEnabled) {
      syncRecordsRemoval(array, window.uid, this.appMode);
    }
    return this.StorageHelper.removeStorageObjects(array);
  }

  getCachedRecordIndex(keyToFind) {
    for (
      let recordIndex = 0;
      recordIndex < this.records.length;
      recordIndex++
    ) {
      const recordKey = this.records[recordIndex].id;

      if (recordKey === keyToFind) {
        return recordIndex;
      }
    }

    return -1;
  }

  updateRecord(changedObject) {
    const changedObjectKey = changedObject.id,
      changedObjectIndex = this.getCachedRecordIndex(changedObjectKey),
      objectExists = changedObjectIndex !== -1;

    // Add/Update Object operation
    if (typeof changedObject !== "undefined") {
      // Don't cache records when objects do not contain primaryKeys
      if (!this.hasPrimaryKey(changedObject)) {
        return;
      }

      objectExists
        ? (this.records[
            changedObjectIndex
          ] = changedObject) /* Update existing object (Edit) */
        : this.records.push(changedObject); /* Create New Object */
    }
  }

  deleteRecord(deletedObjectKey) {
    const deletedObjectIndex = this.getCachedRecordIndex(deletedObjectKey);
    this.records.splice(deletedObjectIndex, 1);
  }

  printRecords() {
    this.StorageHelper.getStorageSuperObject().then(function (superObject) {
      console.log(superObject);
    });
  }

  clearDB() {
    this.StorageHelper.clearStorage().then(() => {
      this.records = [];
    });
  }
}

export default StorageServiceWrapper;
