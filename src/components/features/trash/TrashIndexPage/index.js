import React, { useContext, useState, useCallback, useEffect } from "react";
import { store } from "../../../../store";
import isEmpty from "is-empty";
//SUB COMPONENTS
import SpinnerCard from "../../../misc/SpinnerCard";
import TrashTableContainer from "../TrashTableContainer";
import TrashInfo from "../TrashInfo";
//UTILS
import * as GlobalStoreUtils from "../../../../utils/GlobalStoreUtils";
import { submitEventUtil } from "../../../../utils/AnalyticsUtils";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import APP_CONSTANTS from "config/constants";
import { getAllRecordsFromTrash } from "utils/trash/TrashUtils";
import { getFeatureLimits } from "utils/FeatureManager";
import { StorageService } from "init";
import ExtensionDeactivationMessage from "components/misc/ExtensionDeactivationMessage";
import { isExtensionInstalled } from "actions/ExtensionActions";
import InstallExtensionCTA from "components/misc/InstallExtensionCTA";

const TrashIndexPage = () => {
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const user = GlobalStoreUtils.getUserAuthDetails(state);
  const appMode = GlobalStoreUtils.getAppMode(state);

  // fetch planName from global state
  const userPlanName =
    user.details?.planDetails?.planName ||
    APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE;

  const trashLimitForUser = getFeatureLimits(
    APP_CONSTANTS.FEATURES.TRASH,
    user,
    userPlanName
  );
  //Component State
  const [isExtensionEnabled, setIsExtensionEnabled] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(false);

  const fetchTrashRules = (user) => {
    setLoadingRecords(true);
    setError(false);
    setRecords([]);
    getAllRecordsFromTrash(user.details.profile.uid, trashLimitForUser).then(
      (result) => {
        if (result.success) {
          setRecords(result.data);
        } else {
          setError(true);
        }
        setLoadingRecords(false);
      }
    );
  };

  const updateTrash = (selectedRules) => {
    setLoadingRecords(true);
    const updatedRecords = [];

    records.forEach((record) => {
      if (!selectedRules.some((rule) => rule.id === record.id)) {
        updatedRecords.push(record);
      }
    });

    setRecords((records) => updatedRecords);
    setLoadingRecords(false);
  };

  const stableUpdateCollection = useCallback(fetchTrashRules, [
    trashLimitForUser,
  ]);

  //ANALYTICS
  submitEventUtil(
    GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.TRASH,
    GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.WORKFLOW_STARTED,
    "Trash Page Viewed"
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
      stableUpdateCollection(user);
    }
  }, [user, stableUpdateCollection]);

  if (!isExtensionEnabled) {
    return <ExtensionDeactivationMessage />;
  }

  if (
    appMode === GLOBAL_CONSTANTS.APP_MODES.EXTENSION &&
    !isExtensionInstalled()
  ) {
    return <InstallExtensionCTA />;
  }

  return loadingRecords ? (
    <SpinnerCard customLoadingMessage="Loading deleted rules" />
  ) : !isEmpty(records) ? (
    <TrashTableContainer updateTrash={updateTrash} records={records} />
  ) : (
    <TrashInfo error={error} />
  );
};
export default TrashIndexPage;
