import React, { useContext } from "react";
import { Button, Modal } from "antd";
import { store } from "store";
import { getUserAuthDetails } from "utils/GlobalStoreUtils";

const DeleteConfirmationModal = ({
  isOpen,
  toggle,
  ruleToDelete,
  rulesToDelete,
  promptToLogin,
  deleteRecordFromStorage,
  handleRecordsDeletion,
  isGroup,
  isMoveToTrashInProgress,
  isDeletionInProgress,
}) => {
  const globalState = useContext(store);
  const { state } = globalState;
  const user = getUserAuthDetails(state);

  const handlePromptUserToLogin = () => {
    user.loggedIn
      ? handleRecordsDeletion(user?.details?.profile?.uid)
      : promptToLogin();
  };

  const handleDeleteRecordFromStorage = () => {
    deleteRecordFromStorage(false, ruleToDelete);
  };

  const renderSingleRuleDeleteModal = () => (
    <Modal
      className="modal-dialog-centered modal-danger"
      contentClassName="bg-gradient-danger bg-gradient-blue"
      visible={isOpen}
      onCancel={!isMoveToTrashInProgress && !isDeletionInProgress && toggle}
      footer={null}
      title="Confirm Deletion"
    >
      <div className="modal-body">
        <div className="py-3 text-center">
          <h3 className="heading mt-4">
            Are you sure you want to delete the rule permanently ?
          </h3>
        </div>
      </div>
      <div className="modal-footer" style={{ textAlign: "right" }}>
        <Button
          style={{ marginRight: "1rem" }}
          onClick={handleDeleteRecordFromStorage}
          className="btn-white ml-auto"
          color="link"
          type="button"
          loading={isDeletionInProgress}
          disabled={isDeletionInProgress || isMoveToTrashInProgress}
        >
          Delete Permanently
        </Button>
        <Button
          className="text-white"
          type="primary"
          data-dismiss="modal"
          onClick={handlePromptUserToLogin}
          loading={isMoveToTrashInProgress}
          disabled={isDeletionInProgress || isMoveToTrashInProgress}
        >
          Move to Trash
        </Button>
      </div>
    </Modal>
  );

  const renderMultipleRuleDeleteModal = () => (
    <Modal
      className="modal-dialog-centered modal-danger"
      contentClassName="bg-gradient-danger bg-gradient-blue"
      visible={isOpen}
      onCancel={!isMoveToTrashInProgress && !isDeletionInProgress && toggle}
      footer={null}
      title="Confirm Deletion"
    >
      <div className="modal-body">
        <div className="py-3 text-center">
          <h3 className="heading mt-4">
            Are you sure you want to delete the {rulesToDelete.length} rules
            permanently ?
          </h3>
        </div>
      </div>
      <div className="modal-footer" style={{ textAlign: "right" }}>
        <Button
          style={{ marginRight: "1rem" }}
          onClick={() => handleRecordsDeletion()}
          className="btn-white ml-auto"
          color="link"
          type="button"
          loading={isDeletionInProgress}
          disabled={isDeletionInProgress || isMoveToTrashInProgress}
        >
          Delete Permanently
        </Button>
        <Button
          className="text-white"
          type="primary"
          data-dismiss="modal"
          onClick={handlePromptUserToLogin}
          loading={isMoveToTrashInProgress}
          disabled={isDeletionInProgress || isMoveToTrashInProgress}
        >
          Move to Trash
        </Button>
      </div>
    </Modal>
  );

  return !isGroup
    ? renderSingleRuleDeleteModal()
    : renderMultipleRuleDeleteModal();
};

export default DeleteConfirmationModal;
