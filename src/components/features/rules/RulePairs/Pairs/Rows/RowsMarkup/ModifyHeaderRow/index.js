import React from "react";
import { Row, Col, Input, Tooltip, Dropdown, Menu } from "antd";
//ICONS
import { FaTrash } from "react-icons/fa";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import { DownOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";

const ModifyHeaderRow = ({
  rowIndex,
  pair,
  pairIndex,
  helperFunctions,
  isInputDisabled,
}) => {
  const { modifyPairAtGivenPath, deletePair } = helperFunctions;

  const pairTargetMenu = (
    <Menu>
      <Menu.Item key={1}>
        <Text
          onClick={(event) =>
            modifyPairAtGivenPath(
              event,
              pairIndex,
              "target",
              GLOBAL_CONSTANTS.HEADERS_TARGET.REQUEST
            )
          }
        >
          {GLOBAL_CONSTANTS.HEADERS_TARGET.REQUEST}
        </Text>
      </Menu.Item>
      <Menu.Item key={2}>
        <Text
          onClick={(event) =>
            modifyPairAtGivenPath(
              event,
              pairIndex,
              "target",
              GLOBAL_CONSTANTS.HEADERS_TARGET.RESPONSE
            )
          }
        >
          {GLOBAL_CONSTANTS.HEADERS_TARGET.RESPONSE}
        </Text>
      </Menu.Item>
    </Menu>
  );
  const pairTypeMenu = (
    <Menu>
      <Menu.Item key={1}>
        <Text
          onClick={(event) =>
            modifyPairAtGivenPath(
              event,
              pairIndex,
              "type",
              GLOBAL_CONSTANTS.MODIFICATION_TYPES.ADD
            )
          }
        >
          Add
        </Text>
      </Menu.Item>
      <Menu.Item key={2}>
        <Text
          onClick={(event) =>
            modifyPairAtGivenPath(
              event,
              pairIndex,
              "type",
              GLOBAL_CONSTANTS.MODIFICATION_TYPES.REMOVE
            )
          }
        >
          Remove
        </Text>
      </Menu.Item>
      <Menu.Item key={3}>
        <Text
          onClick={(event) =>
            modifyPairAtGivenPath(
              event,
              pairIndex,
              "type",
              GLOBAL_CONSTANTS.MODIFICATION_TYPES.MODIFY
            )
          }
        >
          Modify
        </Text>
      </Menu.Item>
    </Menu>
  );
  return (
    <Row
      className=" margin-top-one rule-builder-row"
      key={rowIndex}
      span={24}
      style={{
        alignItems: "center",
        justifyContent: "center",
        rowGap: "0.5rem",
        whiteSpace: "nowrap",
      }}
    >
      <Col span={6} lg={3} align="center">
        <Dropdown overlay={pairTypeMenu} disabled={isInputDisabled}>
          <Text
            className="ant-dropdown-link cursor-pointer"
            onClick={(e) => e.preventDefault()}
          >
            {pair.type} <DownOutlined />
          </Text>
        </Dropdown>
      </Col>
      <Col span={6} lg={3} align="center">
        <Dropdown overlay={pairTargetMenu} disabled={isInputDisabled}>
          <Text
            className="ant-dropdown-link cursor-pointer"
            onClick={(e) => e.preventDefault()}
          >
            {pair.target} <DownOutlined />
          </Text>
        </Dropdown>
      </Col>
      <Col
        span={12}
        lg={8}
        className="my-auto margin-bottom-1-when-xs margin-bottom-1-when-sm margin-bottom-1-when-md "
      >
        <Input
          addonBefore="Header"
          className="display-inline-block has-dark-text"
          style={{ paddingLeft: "4px", width: "95%" }}
          placeholder="Header Name"
          type="text"
          value={pair.header}
          disabled={isInputDisabled}
          onChange={(event) =>
            modifyPairAtGivenPath(event, pairIndex, "header")
          }
        />
      </Col>
      <Col span={16} lg={9} className="my-auto">
        <Input
          addonBefore="Value"
          className="display-inline-block has-dark-text"
          style={{ paddingLeft: "4px", width: "95%" }}
          placeholder="Header Value"
          type="text"
          value={pair.value}
          disabled={isInputDisabled}
          onChange={(event) =>
            modifyPairAtGivenPath(
              event,
              pairIndex,
              GLOBAL_CONSTANTS.RULE_KEYS.VALUE
            )
          }
          disabled={pair.type === "Remove" ? true : false}
        />
      </Col>
      {!isInputDisabled ? (
        <Col span={1} className="my-auto" align="right">
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

export default ModifyHeaderRow;
