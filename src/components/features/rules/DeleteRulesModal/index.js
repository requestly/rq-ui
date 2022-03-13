import React, { useEffect, useState, useContext, useCallback } from "react";
//UTILS
import * as GlobalStoreUtils from "../../../../utils/GlobalStoreUtils";
//STORE
import { store } from "../../../../store";
//ACTIONS
import { deleteRulesFromStorage } from "./actions";
import { getUpdateHardRefreshPendingStatusActionObject } from "../../../../store/action-objects";
import { unselectAllRules } from "../actions";
import { toast } from "utils/Toast.js";
import { addRecordsToTrash } from "utils/trash/TrashUtils";
import DeleteConfirmationModal from "components/user/DeleteConfirmationModal";
import { getToggleActiveModalActionObject } from "store/action-objects";
import APP_CONSTANTS from "config/constants";
import { trackRuleMovedToTrashEvent } from "utils/analytics/rules/trash";
import { trackRulesDeletedEvent } from "utils/analytics/rules/deleted";
import { trackRQLastActivity } from "utils/AnalyticsUtils";

const DeleteRulesModal = (props) => {
  const {
    toggle: toggleDeleteRulesModal,
    isOpen,
    ruleIdsToDelete,
    recordsToDelete,
  } = props;
  //Global State
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  // const isRulesListRefreshPending = GlobalStoreUtils.getIsRefreshRulesPending(
  //   state
  // );
  const appMode = GlobalStoreUtils.getAppMode(state);
  //Component State
  const [deleteRulesCompleted, setDeleteRulesCompleted] = useState(false);
  const [areRulesMovingToTrash, setAreRulesMovingToTrash] = useState(false);
  const [areRulesBeingDeleted, setAreRulesBeingDeleted] = useState(false);

  const handleRecordsDeletion = async (uid) => {
    if (uid) {
      setAreRulesMovingToTrash(true);
      addRecordsToTrash(uid, recordsToDelete).then((result) => {
        if (result.success) {
          deleteRulesFromStorage(appMode, ruleIdsToDelete, () => {}).then(
            stablePostDeletionSteps
          );
          trackRuleMovedToTrashEvent(ruleIdsToDelete.length);
        } else {
          toast.info(`Could not delete rule, please try again later.`);
        }
      });
    } else {
      setAreRulesBeingDeleted(true);
      deleteRulesFromStorage(
        appMode,
        ruleIdsToDelete,
        stablePostDeletionSteps
      ).then(stablePostDeletionSteps);
      trackRQLastActivity("rules_deleted");
      trackRulesDeletedEvent(ruleIdsToDelete.length);
    }
  };

  const promptUserToLogin = () => {
    const signInSuccessCallback = (uid) => {
      handleRecordsDeletion(uid);
    };

    dispatch(
      getToggleActiveModalActionObject("authModal", true, {
        redirectURL: window.location.href,
        src: APP_CONSTANTS.FEATURES.RULES,
        callback: signInSuccessCallback,
      })
    );
  };

  const postDeletionSteps = async () => {
    setDeleteRulesCompleted(true);
    //Refresh List
    dispatch(getUpdateHardRefreshPendingStatusActionObject("rules"));
    // Set loading to false
    setAreRulesMovingToTrash(false);
    setAreRulesBeingDeleted(false);

    //Close Modal
    toggleDeleteRulesModal();
    //Unselect all rules
    unselectAllRules(dispatch);
  };
  const stablePostDeletionSteps = useCallback(postDeletionSteps, [
    dispatch,
    toggleDeleteRulesModal,
  ]);

  useEffect(() => {
    return stablePostDeletionSteps;
  }, [deleteRulesCompleted, ruleIdsToDelete, stablePostDeletionSteps, appMode]);

  return (
    <DeleteConfirmationModal
      isOpen={isOpen}
      toggle={toggleDeleteRulesModal}
      isGroup={true}
      ruleIdsToDelete={ruleIdsToDelete}
      rulesToDelete={recordsToDelete}
      promptToLogin={promptUserToLogin}
      handleRecordsDeletion={handleRecordsDeletion}
      isMoveToTrashInProgress={areRulesMovingToTrash}
      isDeletionInProgress={areRulesBeingDeleted}
    />
  );
};

export default DeleteRulesModal;
