import React from "react";
import { Row, Col, Button } from "antd";
// import APP_CONSTANTS from "../../../../../../../../config/constants";
import { PlusOutlined } from "@ant-design/icons";
//CONSTANTS
// const { THEME_COLORS } = APP_CONSTANTS;

const AddCustomScriptRow = ({ rowIndex, helperFunctions }) => {
  const { addEmptyScript } = helperFunctions;
  return (
    <Row
      className=" margin-top-one"
      key={rowIndex}
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Col
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "0 .8em",
        }}
        // xl={{ size: "auto", offset: 1 }}
        // lg={{ size: "auto", offset: 1 }}
      >
        <Button
          // className="btn-icon btn-3 float-left has-no-box-shadow"
          // color="secondary"
          type="secondary"
          size="small"
          // style={{ color: THEME_COLORS["BTN_COLOR_IN_ROW"] }}
          onClick={addEmptyScript}
          icon={<PlusOutlined />}
        >
          Insert Custom Script
        </Button>
        <p style={{ marginBottom: 0 }}>Scripts are executed serially.</p>
      </Col>
    </Row>
  );
};

export default AddCustomScriptRow;
