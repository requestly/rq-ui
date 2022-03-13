import React, { useContext, useEffect } from "react";
import { store } from "../../../store";
import { getUpdateRefreshPendingStatusActionObject } from "../../../store/action-objects";
import {
  getAppMode,
  getUserAuthDetails,
} from "../../../utils/GlobalStoreUtils";
import { checkTimestampAndSync } from "../../../utils/syncing/SyncUtils";

const SyncingInit = () => {
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const appMode = getAppMode(state);
  const user = getUserAuthDetails(state);

  useEffect(() => {
    if (user?.loggedIn && user?.details?.isSyncEnabled) {
      checkTimestampAndSync(user?.details?.profile?.uid, appMode).then(() =>
        dispatch(getUpdateRefreshPendingStatusActionObject("rules"))
      );
    }
  }, [
    appMode,
    dispatch,
    user?.details?.isSyncEnabled,
    user?.details?.profile?.uid,
    user?.loggedIn,
  ]);

  return <></>;
};

export default SyncingInit;
