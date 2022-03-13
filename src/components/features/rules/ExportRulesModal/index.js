import React, { useEffect, useState, useContext } from "react";
import { Col } from "antd";
import { Modal } from "antd";
//UTILS
import * as GlobalStoreUtils from "../../../../utils/GlobalStoreUtils";
import {
  submitEventUtil,
  trackRQLastActivity,
} from "../../../../utils/AnalyticsUtils";
//ICONS
import { AiOutlineWarning } from "react-icons/ai";
import { FaDownload } from "react-icons/fa";
//STORE
import { store } from "../../../../store";
//ACTIONS
import { prepareContentToExport, initiateDownload } from "./actions";
import SpinnerColumn from "../../../misc/SpinnerColumn";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import { trackRulesExportedEvent } from "utils/analytics/rules/exported";

const ExportRulesModal = (props) => {
  const { toggle: toggleExportRulesModal, isOpen, rulesToExport } = props;
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const groupwiseRulesToPopulate = GlobalStoreUtils.getGroupwiseRulesToPopulate(
    state
  );
  const appMode = GlobalStoreUtils.getAppMode(state);
  //Component State
  const [dataToExport, setDataToExport] = useState(false);

  const renderLoader = () => (
    <SpinnerColumn customLoadingMessage="Preparing data to export" />
  );

  const renderDownloadSummary = () => {
    if (dataToExport.rulesCount === 0) {
      return renderWarningMessage();
    } else {
      try {
        initiateDownload(dataToExport.fileContent);
        //Analytics
        submitEventUtil(
          GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULES,
          GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.EXPORTED,
          "rules_exported",
          dataToExport.rulesCount
        );
        trackRQLastActivity("rules_exported");

        trackRulesExportedEvent(dataToExport.rulesCount);
      } catch (error) {}

      return (
        <Col lg="12" md="12" xl="12" sm="12" xs="12" className="text-center">
          <h1
            className="display-2 cursor-pointer"
            onClick={() => initiateDownload(dataToExport.fileContent)}
          >
            <FaDownload />
          </h1>
          <br />
          <b>
            Your download will begin in a moment. If it doesn't,{" "}
            <span
              style={{ cursor: "pointer" }}
              onClick={() => initiateDownload(dataToExport.fileContent)}
            >
              click here
            </span>
            .
          </b>
          <br />
          <p>
            <b>Total Rules Exported: </b>
            {dataToExport.rulesCount} <br />
            {/* <b>Total Groups Exported: </b>
            {dataToExport.groupsCount} */}
          </p>
        </Col>
      );
    }
  };

  const renderWarningMessage = () => (
    <Col lg="12" md="12" xl="12" sm="12" xs="12" className="text-center">
      {/* <Jumbotron style={{ background: "transparent" }} className="text-center"> */}
      <h1 className="display-2">
        <AiOutlineWarning />
      </h1>
      <h5>Please select a rule before exporting</h5>
      {/* </Jumbotron> */}
    </Col>
  );

  useEffect(() => {
    if (!dataToExport) {
      prepareContentToExport(
        appMode,
        rulesToExport,
        groupwiseRulesToPopulate
      ).then((result) => {
        setDataToExport(result);
      });
    }
  }, [rulesToExport, groupwiseRulesToPopulate, dataToExport, appMode]);

  return (
    <Modal
      className="modal-dialog-centered "
      visible={isOpen}
      onCancel={toggleExportRulesModal}
      footer={null}
      style={{ textAlign: "center" }}
      title="Export Rules Wizard"
    >
      <div className="modal-body ">
        {dataToExport ? renderDownloadSummary() : renderLoader()}
      </div>
    </Modal>
  );
};

export default ExportRulesModal;
