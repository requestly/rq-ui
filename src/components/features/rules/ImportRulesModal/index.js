import React, { useState, useContext, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Typography } from "antd";
import { Modal } from "antd";
import { useDropzone } from "react-dropzone";
import { toast } from "utils/Toast.js";
//ICONS
import { AiOutlineWarning } from "react-icons/ai";
import { BsFileEarmarkCheck } from "react-icons/bs";
import { FiUpload } from "react-icons/fi";
//UTILS
import {
  getIsRefreshRulesPending,
  getUserAuthDetails,
  getAppMode,
  getAllRules,
} from "../../../../utils/GlobalStoreUtils";
import {
  submitEventUtil,
  trackRQLastActivity,
} from "../../../../utils/AnalyticsUtils";
//STORE
import { store } from "../../../../store";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
//ACTIONS
import { getUpdateRefreshPendingStatusActionObject } from "../../../../store/action-objects";
import { processDataToImport, addRulesAndGroupsToStorage } from "./actions";
import SpinnerColumn from "../../../misc/SpinnerColumn";
import { trackRulesImportedEvent } from "utils/analytics/rules/imported";
import APP_CONSTANTS from "../../../../config/constants";
import {
  checkIfCompleteImportAllowed,
  getNumberOfRulesImportAllowed,
} from "../../../../utils/ImportUtils";
import { getPrettyPlanName } from "../../../../utils/FormattingHelper";
import { getFeatureLimits } from "../../../../utils/FeatureManager";
import { trackUpgradeNowClickedEvent } from "../../../../utils/analytics/business/free-limits/limit_reached";
import { redirectToPricingPlans } from "../../../../utils/RedirectionUtils";

const ImportRulesModal = (props) => {
  const navigate = useNavigate();
  const { toggle: toggleModal, isOpen } = props;
  //Global State
  const globalState = useContext(store);
  const { dispatch, state } = globalState;

  const allRules = getAllRules(state);
  const isRulesListRefreshPending = getIsRefreshRulesPending(state);
  const user = getUserAuthDetails(state);
  const appMode = getAppMode(state);

  // fetch planName from global state
  const userPlanName =
    user.details?.planDetails?.planName ||
    APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE;

  const currentNumberOfRules = allRules.length;

  const planRulesLimit = getFeatureLimits(
    userPlanName,
    user,
    APP_CONSTANTS.FEATURES.RULES
  );

  //Component State
  const [dataToImport, setDataToImport] = useState(false);
  const [processingDataToImport, setProcessingDataToImport] = useState(false);
  const [isImportLimitReached, setIsImportLimitReached] = useState(false);
  const [rulesToImportCount, setRulesToImportCount] = useState(false);
  const [groupsToImportCount, setGroupsToImportCount] = useState(false);
  const [numberOfRulesImportAllowed, setNumberOfRulesImportAllowed] = useState(
    0
  );

  const ImportRulesDropzone = () => {
    const onDrop = useCallback(async (acceptedFiles) => {
      //Ignore other uploaded files
      const file = acceptedFiles[0];

      const reader = new FileReader();

      reader.onabort = () => toggleModal();
      reader.onerror = () => toggleModal();
      reader.onload = () => {
        //Render the loader
        setProcessingDataToImport(true);
        let parsedArray = [];
        try {
          parsedArray = JSON.parse(reader.result);
          //Start processing data
          processDataToImport(parsedArray, user, allRules).then((result) => {
            setDataToImport(result.data);
            setRulesToImportCount(result.rulesCount);
            setGroupsToImportCount(result.groupsCount);
          });
        } catch (error) {
          console.log(error);
          alert(
            "Imported file doesn't match Requestly format. Please choose another file."
          );
          toggleModal();
        }
      };
      reader.readAsText(file);
    }, []);
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <center>
          <h1 className="display-2">
            <FiUpload />
          </h1>
          <p>Drag and drop requestly export file, or click to select</p>
        </center>
      </div>
    );
  };

  const renderFilePicker = () => {
    return (
      <React.Fragment>
        <ImportRulesDropzone />
      </React.Fragment>
    );
  };

  const renderLoader = () => (
    <SpinnerColumn customLoadingMessage="Processing data" />
  );

  const trackImportEvent = () => {
    const reason = APP_CONSTANTS.LIMIT_REACHED_MODAL.REASON.IMPORT_RULE;
    const source = APP_CONSTANTS.LIMIT_REACHED_MODAL.SOURCE.IMPORT_RULE;

    trackUpgradeNowClickedEvent(reason, source);
  };

  const renderImportConfirmation = () => {
    return (rulesToImportCount && rulesToImportCount > 0) ||
      (groupsToImportCount && groupsToImportCount > 0) ? (
      <Col
        lg="12"
        md="12"
        xl="12"
        sm="12"
        xs="12"
        className="text-center"
        style={{ textAlign: "center" }}
      >
        <h1 className="display-2">
          <BsFileEarmarkCheck />
        </h1>
        <h5>
          Successfully parsed{" "}
          {rulesToImportCount > 0 ? rulesToImportCount + " rules" : null}{" "}
          {groupsToImportCount > 0
            ? "and " + groupsToImportCount + " groups"
            : null}
        </h5>
        {isImportLimitReached ? (
          <>
            <h4>Cannot Import</h4>
            <h5>
              {`Max ${planRulesLimit} rules are allowed in the ${getPrettyPlanName(
                userPlanName
              )} Plan. You already have ${currentNumberOfRules} ${
                currentNumberOfRules === 1 ? "rule" : "rules"
              }, so you can${
                numberOfRulesImportAllowed === 0 ? "not" : ""
              } import ${numberOfRulesImportAllowed || ""} more ${
                numberOfRulesImportAllowed === 1 ? "rule" : "rules"
              }. Please `}
              <Typography.Link
                onClick={() => {
                  redirectToPricingPlans(navigate);
                  trackImportEvent();
                }}
              >
                upgrade
              </Typography.Link>
              {` to access all features.`}
            </h5>
          </>
        ) : null}
      </Col>
    ) : (
      renderWarningMessage()
    );
  };

  const doImportRules = () => {
    addRulesAndGroupsToStorage(appMode, dataToImport)
      .then(async () => {
        dispatch(
          getUpdateRefreshPendingStatusActionObject(
            "rules",
            !isRulesListRefreshPending
          )
        );
        toggleModal();
      })
      .then(() => {
        toast.info(`Successfully imported rules`);
        //Analytics
        submitEventUtil(
          GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULES,
          GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.IMPORTED,
          "rules_imported",
          rulesToImportCount
        );
        trackRQLastActivity("rules_imported");
        trackRulesImportedEvent({ count: rulesToImportCount });
      });
  };

  const renderImportRulesBtn = () => {
    return dataToImport &&
      processingDataToImport &&
      rulesToImportCount &&
      rulesToImportCount > 0 ? (
      <Button
        color="primary"
        data-dismiss="modal"
        type="button"
        onClick={doImportRules}
        disabled={isImportLimitReached}
      >
        Import
      </Button>
    ) : null;
  };

  const renderWarningMessage = () => (
    <Col lg="12" md="12" xl="12" sm="12" xs="12" className="text-center">
      <h1 className="display-2">
        <AiOutlineWarning />
      </h1>
      <h5>Could not find valid data in this file. Please try another</h5>
    </Col>
  );

  useEffect(() => {
    if (
      !checkIfCompleteImportAllowed(
        userPlanName,
        user,
        currentNumberOfRules,
        rulesToImportCount
      )
    ) {
      setIsImportLimitReached(true);
      setNumberOfRulesImportAllowed(
        getNumberOfRulesImportAllowed(userPlanName, user, currentNumberOfRules)
      );
    }
  }, [
    rulesToImportCount,
    dataToImport,
    groupsToImportCount,
    userPlanName,
    currentNumberOfRules,
  ]);

  return (
    <>
      <Modal
        className="modal-dialog-centered "
        visible={isOpen}
        onCancel={toggleModal}
        footer={null}
        title="Import Rules Wizard"
      >
        <div className="modal-body ">
          {dataToImport
            ? renderImportConfirmation()
            : processingDataToImport
            ? renderLoader()
            : renderFilePicker()}
        </div>
        <br />
        <div
          className="modal-footer "
          style={{
            // backgroundColor: "white",
            // position: "sticky",
            // bottom: "0",
            // zIndex: "100",
            textAlign: "center",
          }}
        >
          {renderImportRulesBtn()}
        </div>
      </Modal>
    </>
  );
};

export default ImportRulesModal;
