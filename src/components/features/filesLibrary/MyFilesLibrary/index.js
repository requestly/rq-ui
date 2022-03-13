//My-Files Library
import React, { useContext, useState, useCallback, useEffect } from "react";
import { store } from "../../../../store";
import isEmpty from "is-empty";
//SUB COMPONENTS
import FilesLibView from "../FilesLibraryTableContainer/myFilesLibraryView";
import SpinnerCard from "../../../misc/SpinnerCard";
import GetStartedWithFiles from "../GetStartedWithFiles";
//ACTIONS
import {
  fetchUserMocks,
  fetchFiles,
  checkMigrationDone,
  migrateAndUpdate,
} from "../FilesLibraryIndexPage/actions";
//UTILS
import { getUserAuthDetails } from "../../../../utils/GlobalStoreUtils";
// import DataStoreUtils from "../../../../utils/DataStoreUtils";
const FilesLib = () => {
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const user = getUserAuthDetails(state);

  //Component State
  const [loadingFilesList, setLoadingFileList] = useState(true);
  const [filesList, setFilesList] = useState([]);

  const updateCollection = async () => {
    setLoadingFileList(true);
    setFilesList([]);
    const areFilesMigrated = await checkMigrationDone(user.details.profile.uid);
    let files;
    if (!areFilesMigrated) {
      files = await fetchFiles(user.details.profile.uid).then((result) => {
        for (const key in result) {
          setFilesList((prev) => [...prev, result[key]]);
        }
        return result;
      });
    }
    fetchUserMocks().then((list) => {
      if (files) {
        setFilesList((prev) => [...prev, ...list]);
      } else {
        let filesData = [];
        let i = 0;
        for (i = 0; i < list.length; i++) {
          if (list[i].isMock === false || !list[i].hasOwnProperty("isMock")) {
            filesData.push(list[i]);
          }
        }
        setFilesList(filesData);
      }

      setLoadingFileList(false);
    });
    if (!areFilesMigrated) {
      migrateAndUpdate(user.details.profile.uid);
    }
  };

  const stableUpdateCollection = useCallback(updateCollection, [user]);

  useEffect(() => {
    if (user.loggedIn && user.details.profile) stableUpdateCollection();
  }, [user, stableUpdateCollection]);

  return loadingFilesList ? (
    <SpinnerCard customLoadingMessage="Loading Files" />
  ) : !isEmpty(filesList) ? (
    <>
      <FilesLibView updateCollection={updateCollection} filesList={filesList} />
    </>
  ) : (
    <GetStartedWithFiles updateCollection={updateCollection} />
  );
};
export default FilesLib;
