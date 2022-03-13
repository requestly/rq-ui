import React from "react";
import { Row, Col, Input, Tooltip } from "antd";
import { FaTrash } from "react-icons/fa";

const ReplacePartRow = ({
  rowIndex,
  pair,
  pairIndex,
  helperFunctions,
  isInputDisabled,
}) => {
  const { modifyPairAtGivenPath, deletePair } = helperFunctions;
  return (
    <Row
      className=" margin-top-one"
      key={rowIndex}
      span={24}
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Col
        // className="my-auto margin-bottom-1-when-xs margin-bottom-1-when-sm"
        span={11}
      >
        <Input
          addonBefore="Replace"
          className="display-inline-block has-dark-text"
          placeholder="This part in URL"
          type="text"
          onChange={(event) => modifyPairAtGivenPath(event, pairIndex, "from")}
          value={pair.from}
          disabled={isInputDisabled}
          style={{ width: "95%", paddingLeft: "4px" }}
        />
      </Col>
      <Col
        // className="my-auto"
        // xl="6" lg="6" md="6"
        span={11}
      >
        <Input
          addonBefore="With"
          className="display-inline-block has-dark-text"
          placeholder="This part"
          type="text"
          onChange={(event) => modifyPairAtGivenPath(event, pairIndex, "to")}
          value={pair.to}
          disabled={isInputDisabled}
          style={{ width: "95%", paddingLeft: "4px" }}
        />
      </Col>
      {!isInputDisabled ? (
        <Col span={2} align="right">
          <Tooltip title="Remove Pair">
            <FaTrash
              id="delete-pair"
              color="#4A5868"
              onClick={(e) => deletePair(e, pairIndex)}
              style={{ cursor: "pointer" }}
            />
          </Tooltip>
        </Col>
      ) : null}
    </Row>
  );
};

export default ReplacePartRow;
