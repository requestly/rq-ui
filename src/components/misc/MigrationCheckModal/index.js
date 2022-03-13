import React, { useEffect, useState, useContext } from "react";
import { Modal } from "antd";
//FUNCTIONS
import {
  checkIfMigrationStepsAreAlreadyPerformed,
  executeMigrationSteps,
  setMigrationStepsDone,
} from "../../../utils/MigrationSteps";
//ACTIONS
import SpinnerColumn from "../SpinnerColumn";
// STORE
import { store } from "../../../store";
// UTILS
import { getAppMode } from "../../../utils/GlobalStoreUtils";

const MigrationCheckModal = () => {
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
    // Check if migration steps are already performed
    checkIfMigrationStepsAreAlreadyPerformed(appMode).then((result) => {
      if (!result) {
        setIsModalOpen(true);
        // console.log("PERFORMING MIGRATION");
        executeMigrationSteps(appMode).then(() => {
          setMigrationStepsDone(appMode).then(() => {
            setIsModalOpen(false);
          });
        });
      } else {
        console.log("ALREADY MIGRATED");
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

export default MigrationCheckModal;
