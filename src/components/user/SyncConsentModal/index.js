import React from "react";
import { Button, Modal } from "antd";
//STORE
// import { store } from "store";
// import { getUpdateRefreshPendingStatusActionObject } from "store/action-objects";
// import { getUserAuthDetails } from "utils/GlobalStoreUtils";

// import { toast } from "../../../utils/Toast";

const SyncConsentModal = ({ isOpen, toggle, appMode }) => {
  //Global State
  // const globalState = useContext(store);
  // const { state } = globalState;
  // const user = getUserAuthDetails(state);

  const update = async () => {
    // const callback = () => {
    //   dispatch(getUpdateRefreshPendingStatusActionObject("rules"));
    // };
    // await syncRulesToLocalStorage(user.details.profile.uid, appMode, callback);
    toggle();
  };

  const denyConsent = async () => {
    try {
      // setSyncState(user.details?.profile?.uid, false)
      //   .then(() => {
      //     toast.info(`We won't be syncing your rules automatically hereon.`);
      //   })
      //   .catch(() => {
      //     toast.error(
      //       `Sorry, we are experiencing issues updating the sync state.`
      //     );
      //   });
      toggle();
    } catch (err) {
      console.log(err);
    }
  };

  // const exportRules = async () => {
  //   const allDataLocal = await StorageService(appMode).getAllRecords();
  //   const userDataLocal = Object.values(allDataLocal).filter(
  //     (rule) => !!rule.creationDate //TODO: !!creationDate check to be removed when working on syncing
  //   );

  //   const localRuleIds = [];

  //   userDataLocal.forEach((data) => {
  //     if (data.objectType === "rule") localRuleIds.push(data.id);
  //   });

  //   try {
  //     const localData = await prepareContentToExport(
  //       appMode,
  //       localRuleIds,
  //       groupwiseRulesToPopulate
  //     );

  //     if (userDataLocal.length) {
  //       initiateDownload(localData.fileContent);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  return (
    <Modal
      className="modal-dialog-centered modal-danger"
      contentClassName="bg-gradient-danger bg-gradient-blue"
      visible={isOpen}
      onCancel={denyConsent}
      footer={null}
      title="Enable rules syncing"
    >
      <div className="modal-body">
        <div className="py-3 text-center">
          <h4 className="heading mt-4">Update rules in your instance</h4>
          <p>
            You have unsynced rules in your system. Do you wish your local rules
            to be merged with your synced up rules ?
          </p>
          {/* <p>
            <span style={{ textTransform: "uppercase" }}>Warning!</span> Your
            local rules might get lost!{" "}
            <Link onClick={exportRules}>Export to JSON</Link>
          </p> */}
        </div>
      </div>
      <div className="modal-footer" style={{ textAlign: "left" }}>
        <Button
          style={{ marginRight: "1rem" }}
          className="text-white"
          type="primary"
          data-dismiss="modal"
          onClick={denyConsent}
        >
          Disable Syncing
        </Button>
        <Button
          onClick={update}
          className="btn-white ml-auto"
          color="link"
          type="button"
        >
          Enable and Merge with Current Rules
        </Button>
      </div>
    </Modal>
  );
};

export default SyncConsentModal;
