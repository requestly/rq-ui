import React from "react";
import { Row, Col, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const AddQueryParamModificationRow = ({ rowIndex, helperFunctions }) => {
  const { addEmptyModification } = helperFunctions;
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
      <Col offset={3} span={21}>
        <Button
          // className="btn-icon btn-3 float-left has-no-box-shadow"
          type="secondary"
          size="small"
          onClick={addEmptyModification}
          icon={<PlusOutlined />}
        >
          <span className="btn-inner--text">Add Modification</span>
        </Button>
      </Col>
    </Row>
  );
};

export default AddQueryParamModificationRow;
