import React, { useContext, useState, useEffect, useCallback } from "react";
import { store } from "../../../../store";
import isEmpty from "is-empty";
//SUB COMPONENTS
import SpinnerCard from "../../../misc/SpinnerCard";
import SharedListTableContainer from "../SharedListTableContainer";
import CreateSharedListCTA from "../CreateSharedListCTA";
//ACTIONS
import { fetchSharedLists } from "./actions";
//UTILS
import * as GlobalStoreUtils from "../../../../utils/GlobalStoreUtils";
import {
  submitEventUtil,
  submitAttrUtil,
} from "../../../../utils/AnalyticsUtils";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import APP_CONSTANTS from "config/constants";
import { StorageService } from "init";
import ExtensionDeactivationMessage from "components/misc/ExtensionDeactivationMessage";
import { isExtensionInstalled } from "actions/ExtensionActions";
import InstallExtensionCTA from "components/misc/InstallExtensionCTA";

const TRACKING = GLOBAL_CONSTANTS.GA_EVENTS;

const SharedListsIndexPage = () => {
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const user = GlobalStoreUtils.getUserAuthDetails(state);
  const appMode = GlobalStoreUtils.getAppMode(state);
  let isRefreshSharesListsPending = GlobalStoreUtils.getIsRefreshSharesListsPending(
    state
  );
  //Component State
  const [isExtensionEnabled, setIsExtensionEnabled] = useState(true);
  const [loadingSharedLists, setLoadingSharedLists] = useState(true);
  const [sharedLists, setSharedLists] = useState({});

  const updateCollection = (user) => {
    fetchSharedLists(user.details.profile.uid).then((result) => {
      setSharedLists(result);
      setLoadingSharedLists(false);

      //ANALYTICS
      if (result)
        submitAttrUtil(
          TRACKING.ATTR.NUM_SHARED_LISTS,
          Object.keys(result).length
        );
      //TO SET NUM OF SHARED LIST TO ZERO IF USER HAVE NOT MADE ANY OR HAVE DELETED ALL
      if (!result) {
        submitAttrUtil(TRACKING.ATTR.NUM_SHARED_LISTS, 0);
      }
    });
  };

  const stableUpdateCollection = useCallback(updateCollection, []);

  //ANALYTICS
  submitEventUtil(
    GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.SHARED_LIST,
    GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.WORKFLOW_STARTED,
    "SharedList index page opened"
  );

  useEffect(() => {
    if (appMode === GLOBAL_CONSTANTS.APP_MODES.EXTENSION) {
      StorageService(appMode)
        .getRecord(APP_CONSTANTS.RQ_SETTINGS)
        .then((value) => {
          if (value) {
            setIsExtensionEnabled(value.isExtensionEnabled);
          } else {
            setIsExtensionEnabled(true);
          }
        });
    }
  }, [appMode]);

  useEffect(() => {
    if (user.loggedIn && user.details.profile) {
      //ANALYTICS
      submitEventUtil(
        GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.SHARED_LIST,
        GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.ALREADY_LOGIN,
        "Already login on SharedList index page"
      );

      stableUpdateCollection(user);
    }
  }, [user, stableUpdateCollection, isRefreshSharesListsPending]);

  if (!isExtensionEnabled) {
    return <ExtensionDeactivationMessage />;
  }

  if (
    appMode === GLOBAL_CONSTANTS.APP_MODES.EXTENSION &&
    !isExtensionInstalled()
  ) {
    return <InstallExtensionCTA />;
  }

  return loadingSharedLists ? (
    <SpinnerCard customLoadingMessage="Loading Shared Lists" />
  ) : !isEmpty(sharedLists) ? (
    <SharedListTableContainer sharedLists={sharedLists} />
  ) : (
    <CreateSharedListCTA />
  );
};
export default SharedListsIndexPage;
