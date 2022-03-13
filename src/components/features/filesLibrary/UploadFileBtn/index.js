import React, { useState, useContext } from "react";
import { Button, Input } from "antd";
//SUB COMPONENTS
import LimitReachedModal from "../../../user/LimitReachedModal";
//ACTIONS
import { handleFileInput } from "./actions";

//STORE
import { store } from "../../../../store";
//UTILS
import * as GlobalStoreUtils from "../../../../utils/GlobalStoreUtils";
import * as FeatureManager from "../../../../utils/FeatureManager";
//CONSTANTS
import APP_CONSTANTS from "../../../../config/constants";
import { CloudUploadOutlined } from "@ant-design/icons";

const UploadFileBtn = ({
  updateCollection,
  currentFilesCount,
  buttonType = "primary",
}) => {
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const user = GlobalStoreUtils.getUserAuthDetails(state);

  // fetch planName from global state
  const planName =
    user.details?.planDetails?.planName ||
    APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE;

  //Component State
  const [showFileInputBox, setShowFileInputBox] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [userPlanName, setUserPlanName] = useState("Free");
  const [isLimitReachedModalActive, setIsLimitReachedModalActive] = useState(
    false
  );

  const toggleLimitReachedModal = () => {
    setIsLimitReachedModalActive(isLimitReachedModalActive ? false : true);
  };

  const handleUploadBtnOnClick = (e) => {
    const ifLimitReached = FeatureManager.checkIfLimitReached(
      currentFilesCount,
      APP_CONSTANTS.FEATURES.FILES,
      user,
      planName
    );

    if (ifLimitReached) {
      setUserPlanName(planName);
      //Activate modal to notify user to upgrade
      setIsLimitReachedModalActive(true);
    } else {
      //Continue allowing file upload
      setShowFileInputBox(true);
    }
  };

  const handleFileInputOnChange = (e) => {
    setUploadingFile(true);
    handleFileInput(e).then(() => {
      if (updateCollection) {
        updateCollection();
      }
      setShowFileInputBox(false);
      setUploadingFile(false);
    });
  };

  return (
    <React.Fragment>
      {uploadingFile ? (
        <Button loading={true} type={buttonType}>
          Uploading...
        </Button>
      ) : showFileInputBox ? (
        <Input type="file" onChange={handleFileInputOnChange} />
      ) : (
        <Button
          type={buttonType}
          onClick={handleUploadBtnOnClick}
          icon={<CloudUploadOutlined />}
        >
          Upload File
        </Button>
      )}

      {/* MODALS */}
      {isLimitReachedModalActive ? (
        <LimitReachedModal
          isOpen={isLimitReachedModalActive}
          toggle={toggleLimitReachedModal}
          featureName={APP_CONSTANTS.FEATURES.FILES}
          userPlanName={userPlanName}
        />
      ) : null}
    </React.Fragment>
  );
};

export default UploadFileBtn;
