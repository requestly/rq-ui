import React from "react";
import { Row, Col, Input, Tooltip, Dropdown, Menu } from "antd";
import { RiDeleteBack2Line } from "react-icons/ri";
import Text from "antd/lib/typography/Text";
import { DownOutlined } from "@ant-design/icons";

const QueryParamModificationRow = ({
  rowIndex,
  pairIndex,
  helperFunctions,
  modification,
  modificationIndex,
  isInputDisabled,
}) => {
  const { modifyPairAtGivenPath, deleteModification } = helperFunctions;

  const modificationTypeOptions = (
    <Menu>
      <Menu.Item key={1}>
        <span
          onClick={(event) =>
            modifyPairAtGivenPath(
              event,
              pairIndex,
              `modifications[${modificationIndex}].type`,
              "Add"
            )
          }
        >
          Add/Replace
        </span>
      </Menu.Item>
      <Menu.Item key={2}>
        <span
          onClick={(event) =>
            modifyPairAtGivenPath(
              event,
              pairIndex,
              `modifications[${modificationIndex}].type`,
              "Remove"
            )
          }
        >
          Remove
        </span>
      </Menu.Item>
      <Menu.Item key={3}>
        <span
          onClick={(event) =>
            modifyPairAtGivenPath(
              event,
              pairIndex,
              `modifications[${modificationIndex}].type`,
              "Remove All"
            )
          }
        >
          Remove All
        </span>
      </Menu.Item>
    </Menu>
  );

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
      <Col span={3}>
        <Dropdown overlay={modificationTypeOptions}>
          <Text
            strong
            className="ant-dropdown-link"
            onClick={(e) => e.preventDefault()}
            style={{ textTransform: "uppercase", cursor: "pointer" }}
          >
            {modification.type} <DownOutlined />
          </Text>
        </Dropdown>
      </Col>
      <Col
        // className="my-auto margin-bottom-1-when-xs margin-bottom-1-when-sm"
        // xl="4"
        // lg="5"
        // md="5"
        span={10}
      >
        <Input
          addonBefore="Param"
          className="display-inline-block has-dark-text"
          style={{ paddingLeft: "4px" }}
          placeholder="Param Name"
          type="text"
          disabled={isInputDisabled}
          onChange={(event) =>
            modifyPairAtGivenPath(
              event,
              pairIndex,
              `modifications[${modificationIndex}].param`
            )
          }
          value={modification.param}
          disabled={modification.type === "Remove All" ? true : false}
        />
      </Col>
      <Col span={10}>
        <Input
          addonBefore="Value"
          className="display-inline-block has-dark-text"
          style={{ paddingLeft: "4px", width: "95%" }}
          placeholder="Param Value"
          type="text"
          disabled={isInputDisabled}
          onChange={(event) =>
            modifyPairAtGivenPath(
              event,
              pairIndex,
              `modifications[${modificationIndex}].value`
            )
          }
          value={modification.value}
          disabled={modification.type === "Add" ? false : true}
        />
      </Col>
      <Col span={1} align="right">
        <Tooltip title="Remove">
          <RiDeleteBack2Line
            id="delete-pair"
            color="#4A5868"
            onClick={(e) => deleteModification(e, pairIndex, modificationIndex)}
            style={{ cursor: "pointer" }}
          />
        </Tooltip>
      </Col>
    </Row>
  );
};

export default QueryParamModificationRow;
