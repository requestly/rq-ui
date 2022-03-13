import React, { useState } from "react";
import { Row, Col, Input, Tooltip } from "antd";
import { FolderOpenOutlined } from "@ant-design/icons";
//SUB COMPONENTS
import FilePickerModal from "../../../../../../filesLibrary/FilePickerModal";

const DestinationURLRow = ({
  rowIndex,
  pair,
  pairIndex,
  helperFunctions,
  isInputDisabled,
}) => {
  const { generatePlaceholderText, modifyPairAtGivenPath } = helperFunctions;
  //Component State
  const [isFilePickerModalActive, setIsFilePickerModalActive] = useState(false);

  const toggleFilePickerModal = () => {
    setIsFilePickerModalActive(!isFilePickerModalActive);
  };

  const handleFilePick = (e) => {
    setIsFilePickerModalActive(true);
  };

  const handleFilePickerAction = (url) => {
    setIsFilePickerModalActive(false);
    modifyPairAtGivenPath(undefined, pairIndex, "destination", url);
  };

  return (
    <React.Fragment>
      <Row
        className=" margin-top-one"
        key={rowIndex}
        span={24}
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Col span={3}>
          <span>Redirect to</span>
        </Col>
        <Col span={21}>
          <Input
            className="display-inline-block has-dark-text"
            placeholder={generatePlaceholderText(
              pair.source.operator,
              "destination"
            )}
            type="text"
            onChange={(event) =>
              modifyPairAtGivenPath(event, pairIndex, "destination")
            }
            style={{ cursor: "pointer" }}
            value={pair.destination}
            disabled={isInputDisabled}
            addonAfter={
              <Tooltip
                title="Import a existing Mock API"
                onClick={handleFilePick}
              >
                <FolderOpenOutlined />
                &nbsp; Pick from Mock Server
              </Tooltip>
            }
          />
        </Col>
      </Row>
      {/* MODALS */}
      {isFilePickerModalActive ? (
        <FilePickerModal
          isOpen={isFilePickerModalActive}
          toggle={toggleFilePickerModal}
          callback={handleFilePickerAction}
        />
      ) : null}
    </React.Fragment>
  );
};

export default DestinationURLRow;
