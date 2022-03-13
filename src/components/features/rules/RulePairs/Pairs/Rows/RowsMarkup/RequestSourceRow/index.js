import React from "react";

import {
  Row,
  Col,
  Input,
  Badge,
  Menu,
  Dropdown,
  Typography,
  Tooltip,
} from "antd";
import { FaFilter, FaTrash } from "react-icons/fa";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import { DownOutlined } from "@ant-design/icons";

const { Text } = Typography;

const RequestSourceRow = ({
  rowIndex,
  pair,
  pairIndex,
  helperFunctions,
  options,
  ruleDetails,
  isInputDisabled,
}) => {
  const {
    modifyPairAtGivenPath,
    openFilterModal,
    getFilterCount,
    deletePair,
    generatePlaceholderText,
  } = helperFunctions;
  options = options ? options : {};

  const sourceKeyOptions = (
    <Menu>
      <Menu.Item key={1}>
        <span
          onClick={(event) =>
            modifyPairAtGivenPath(
              event,
              pairIndex,
              GLOBAL_CONSTANTS.PATH_FROM_PAIR.RULE_KEYS,
              GLOBAL_CONSTANTS.RULE_KEYS.URL
            )
          }
        >
          URL
        </span>
      </Menu.Item>
      <Menu.Item key={2}>
        <span
          onClick={(event) =>
            modifyPairAtGivenPath(
              event,
              pairIndex,
              GLOBAL_CONSTANTS.PATH_FROM_PAIR.RULE_KEYS,
              GLOBAL_CONSTANTS.RULE_KEYS.HOST
            )
          }
        >
          Host
        </span>
      </Menu.Item>
      <Menu.Item key={3}>
        <span
          onClick={(event) =>
            modifyPairAtGivenPath(
              event,
              pairIndex,
              GLOBAL_CONSTANTS.PATH_FROM_PAIR.RULE_KEYS,
              GLOBAL_CONSTANTS.RULE_KEYS.PATH
            )
          }
        >
          Path
        </span>
      </Menu.Item>
    </Menu>
  );
  const sourceOperatorOptions = (
    <Menu>
      <Menu.Item key={1}>
        <span
          onClick={(event) =>
            modifyPairAtGivenPath(
              event,
              pairIndex,
              GLOBAL_CONSTANTS.PATH_FROM_PAIR.RULE_OPERATORS,
              GLOBAL_CONSTANTS.RULE_OPERATORS.EQUALS
            )
          }
        >
          Equals
        </span>
      </Menu.Item>
      <Menu.Item key={2}>
        <span
          onClick={(event) =>
            modifyPairAtGivenPath(
              event,
              pairIndex,
              GLOBAL_CONSTANTS.PATH_FROM_PAIR.RULE_OPERATORS,
              GLOBAL_CONSTANTS.RULE_OPERATORS.CONTAINS
            )
          }
        >
          Contains
        </span>
      </Menu.Item>
      <Menu.Item key={3}>
        <span
          onClick={(event) =>
            modifyPairAtGivenPath(
              event,
              pairIndex,
              GLOBAL_CONSTANTS.PATH_FROM_PAIR.RULE_OPERATORS,
              GLOBAL_CONSTANTS.RULE_OPERATORS.MATCHES
            )
          }
        >
          Matches (RegEx)
        </span>
      </Menu.Item>
      <Menu.Item key={4}>
        <span
          onClick={(event) =>
            modifyPairAtGivenPath(
              event,
              pairIndex,
              GLOBAL_CONSTANTS.PATH_FROM_PAIR.RULE_OPERATORS,
              GLOBAL_CONSTANTS.RULE_OPERATORS.WILDCARD_MATCHES
            )
          }
        >
          Matches (Wildcard)
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <Row
      key={rowIndex}
      span={24}
      style={{
        alignItems: "center",
        justifyContent: "center",
        rowGap: "0.5rem",
      }}
      gutter={[16, 24]}
      className="rule-builder-row margin-top-one"
    >
      <Col span={4} lg={2} align="left">
        <span>If request</span>
      </Col>
      <Col span={4} lg={2} align="center">
        <Dropdown overlay={sourceKeyOptions} disabled={isInputDisabled}>
          <Text
            strong
            className="ant-dropdown-link"
            onClick={(e) => e.preventDefault()}
            style={{
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            {pair.source.key} <DownOutlined />
          </Text>
        </Dropdown>
      </Col>
      <Col span={4} lg={3} align="center">
        <Dropdown overlay={sourceOperatorOptions} disabled={isInputDisabled}>
          <Text
            strong
            className="ant-dropdown-link"
            onClick={(e) => e.preventDefault()}
            style={{
              textTransform: "capitalize",
              cursor: "pointer",
            }}
          >
            {pair.source.operator ===
            GLOBAL_CONSTANTS.RULE_OPERATORS.WILDCARD_MATCHES
              ? "Wildcard"
              : pair.source.operator === GLOBAL_CONSTANTS.RULE_OPERATORS.MATCHES
              ? "RegEx"
              : pair.source.operator}{" "}
            <DownOutlined />
          </Text>
        </Dropdown>
      </Col>
      <Col
        span={18}
        lg={
          ruleDetails.SHOW_DELETE_PAIR_ICON_ON_SOURCE_ROW &&
          ruleDetails.ALLOW_REQUEST_SOURCE_FILTERS
            ? 11
            : ruleDetails.SHOW_DELETE_PAIR_ICON_ON_SOURCE_ROW
            ? 13
            : ruleDetails.ALLOW_REQUEST_SOURCE_FILTERS
            ? 15
            : 17
        }
      >
        <Input
          placeholder={
            ruleDetails.ALLOW_APPLY_RULE_TO_ALL_URLS
              ? "Leave this field Empty to apply rule to all URLs"
              : generatePlaceholderText(pair.source.operator, "source-value")
          }
          type="text"
          onChange={(event) =>
            modifyPairAtGivenPath(event, pairIndex, "source.value")
          }
          // className="display-inline-block has-dark-text "
          value={pair.source.value}
          disabled={isInputDisabled}
        />
      </Col>

      {ruleDetails.ALLOW_REQUEST_SOURCE_FILTERS ? (
        <Col span={2} align="left">
          &nbsp;&nbsp;
          <Tooltip title="Filters">
            <span
              onClick={() => openFilterModal(pairIndex)}
              id="edit-filters"
              style={{ cursor: "pointer" }}
            >
              <FaFilter color="#4A5868" />{" "}
              {getFilterCount(pairIndex) !== 0 ? (
                <Badge style={{ color: "#465967", backgroundColor: "#E5EAEF" }}>
                  {getFilterCount(pairIndex)}
                </Badge>
              ) : null}
            </span>
          </Tooltip>
        </Col>
      ) : null}
      {ruleDetails.SHOW_DELETE_PAIR_ICON_ON_SOURCE_ROW && !isInputDisabled ? (
        <Col
          align="right"
          flex={"auto"}
          className="rule-builder-delete-container"
        >
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

export default RequestSourceRow;
