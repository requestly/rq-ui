import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
/**
 *
 * @param {number|string} uid - The user id
 * @returns Path of current User node in array form ["users", "uid1"] otherwise null
 */
export const getUserNodePath = (uid) => {
  return uid ? [GLOBAL_CONSTANTS.FIREBASE_NODES.USERS, uid] : null;
};

export const getUserSharedListsPath = (uid) => {
  var currentUserPath = getUserNodePath(uid);
  if (currentUserPath) {
    currentUserPath.push(GLOBAL_CONSTANTS.FIREBASE_NODES.SHARED_LISTS);
  }
  return currentUserPath;
};

export const getSpecificUserSharedListPath = (userId, sharedListId) => {
  return getUserSharedListsPath(userId).concat(sharedListId);
};

export const getPublicSharedListPath = (sharedListId) => {
  return [
    GLOBAL_CONSTANTS.FIREBASE_NODES.PUBLIC,
    GLOBAL_CONSTANTS.FIREBASE_NODES.SHARED_LISTS,
    sharedListId,
  ];
};

export const getUserFilesPath = (uid) => {
  return [
    GLOBAL_CONSTANTS.FIREBASE_NODES.USERS,
    uid,
    GLOBAL_CONSTANTS.FIREBASE_NODES.FILES,
  ];
};

export const getUserSpecificFilePath = (uid, fileId) => {
  const userFilesPath = getUserFilesPath(uid);
  //Make it file-id specific
  userFilesPath.push(fileId);
  return userFilesPath;
};

export const getMigrationPath = (uid) => {
  return ["customProfile", uid];
};
