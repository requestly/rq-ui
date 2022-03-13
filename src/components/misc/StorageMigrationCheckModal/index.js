import React, { useEffect, useState, useContext } from "react";
import { Modal } from "antd";
//FUNCTIONS
import {
  checkIfStorageMigrationStepsAreAlreadyPerformed,
  executeStorageMigrationSteps,
  setStorageMigrationStepsDone,
} from "utils/StorageMigration";
//ACTIONS
import SpinnerColumn from "../SpinnerColumn";
// STORE
import { store } from "../../../store";
// UTILS
import { getAppMode } from "../../../utils/GlobalStoreUtils";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";

const StorageMigrationCheckModal = () => {
  //GLOBAL STATE
  const globalState = useContext(store);
  const { state } = globalState;
  const appMode = getAppMode(state);
  //Component State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const renderLoader = () => (
    <SpinnerColumn customLoadingMessage="Setting up Requestly" />
  );

  useEffect(() => {
    // Check if appMode is extension
    if (appMode !== GLOBAL_CONSTANTS.APP_MODES.EXTENSION) return;

    // Check if migration steps are already performed
    checkIfStorageMigrationStepsAreAlreadyPerformed(appMode).then((result) => {
      if (!result) {
        setIsModalOpen(true);
        // console.log("PERFORMING STORAGE MIGRATION");
        executeStorageMigrationSteps(appMode).then(() => {
          setStorageMigrationStepsDone(appMode).then(() => {
            setIsModalOpen(false);
          });
        });
      } else {
        console.log("STORAGE ALREADY MIGRATED");
        return;
      }
    });
  }, [appMode]);

  return (
    <Modal
      className="modal-dialog-centered "
      visible={isModalOpen}
      onCancel={() => null}
      footer={null}
    >
      <div className="modal-body ">{renderLoader()}</div>
    </Modal>
  );
};

export default StorageMigrationCheckModal;
