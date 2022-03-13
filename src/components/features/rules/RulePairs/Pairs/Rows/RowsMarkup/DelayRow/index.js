import React from "react";

import {
  Row,
  Col,
  Input,
  Badge,
  Tooltip,
  Typography,
  Menu,
  Dropdown,
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

  // const validateDelay = (delay) => {
  //   return (
  //     Number(delay) >=
  //       GLOBAL_CONSTANTS.DELAY_REQUEST_CONSTANTS.MIN_DELAY_VALUE &&
  //     Number(delay) <=
  //       GLOBAL_CONSTANTS.DELAY_REQUEST_CONSTANTS.MAX_DELAY_VALUE_NON_XHR
  //   );
  // };

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

  return (
    <>
      <Row
        key={rowIndex}
        span={24}
        style={{
          alignItems: "center",
          justifyContent: "center",
          whiteSpace: "nowrap",
        }}
        gutter={[16, 16]}
      >
        <Col span={4} lg={2} align="center">
          <span>If request</span>
        </Col>
        <Col
          // xl="1"
          // lg="5"
          // md="4"
          // sm={{ size: "auto" }}
          // xs={{ size: "auto" }}
          // style={{ marginTop: "0.2rem" }}
          span={3}
          lg={2}
          align="center"
        >
          <Dropdown overlay={sourceKeyOptions} disabled={isInputDisabled}>
            <Text
              strong
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
              style={{ textTransform: "uppercase", cursor: "pointer" }}
            >
              {pair.source.key} <DownOutlined />
            </Text>
          </Dropdown>
        </Col>
        <Col
          // lg="5"
          // xl={{ size: "auto" }}
          // md="5"
          // sm={{ size: "auto" }}
          // xs={{ size: "auto" }}
          // style={{ marginTop: "0.2rem" }}
          span={4}
          lg={3}
          align="center"
        >
          <Dropdown overlay={sourceOperatorOptions} disabled={isInputDisabled}>
            <Text
              strong
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
              style={{ textTransform: "capitalize", cursor: "pointer" }}
            >
              {pair.source.operator ===
              GLOBAL_CONSTANTS.RULE_OPERATORS.WILDCARD_MATCHES
                ? "Wildcard"
                : pair.source.operator ===
                  GLOBAL_CONSTANTS.RULE_OPERATORS.MATCHES
                ? "RegEx"
                : pair.source.operator}{" "}
              <DownOutlined />
            </Text>
          </Dropdown>
        </Col>
        <Col
          // xl="4"
          // lg="11"
          // md="11"
          // sm="12"
          // xs="12"
          // className="mb-auto"
          span={12}
          lg={9}
        >
          <Input
            placeholder={
              ruleDetails.ALLOW_APPLY_RULE_TO_ALL_URLS
                ? "Leave this field Empty to apply rule to all URLs"
                : generatePlaceholderText(pair.source.operator, "source-value")
            }
            disabled={isInputDisabled}
            type="text"
            onChange={(event) =>
              modifyPairAtGivenPath(event, pairIndex, "source.value")
            }
            // className="display-inline-block has-dark-text "
            value={pair.source.value}
            style={{ width: "98%" }}
          />
        </Col>

        {ruleDetails.ALLOW_REQUEST_SOURCE_FILTERS ? (
          <Col
            // sm={{ size: "auto" }}
            // md={{ size: "auto" }}
            // lg={{ size: "auto" }}
            // xs={{ size: "auto" }}
            // style={{ marginTop: "0.7rem" }}
            span={1}
            align="left"
          >
            <Tooltip title="Filters">
              <span
                onClick={() => openFilterModal(pairIndex)}
                style={{ cursor: "pointer" }}
              >
                <FaFilter color="#4A5868" />{" "}
                {getFilterCount(pairIndex) !== 0 ? (
                  <Badge
                    style={{ color: "#465967", backgroundColor: "#E5EAEF" }}
                  >
                    {getFilterCount(pairIndex)}
                  </Badge>
                ) : null}
              </span>
            </Tooltip>
          </Col>
        ) : null}

        <Col
          // lg={{ size: "auto" }}
          // xl={{ size: "auto" }}
          // style={{ marginTop: "0.7rem" }}
          span={4}
          lg={2}
          align="center"
        >
          <span>Delay (ms)</span>
        </Col>
        <Col
          sm="2"
          xl="3"
          className="mb-auto mt-sm-2 mt-xl-auto"
          span={5}
          lg={3}
        >
          <Input
            className="display-inline-block has-dark-text"
            placeholder={"Time in ms"}
            type="text"
            disabled={isInputDisabled}
            onChange={(event) =>
              modifyPairAtGivenPath(event, pairIndex, "delay")
            }
            value={pair.delay}
            // invalid={!validateDelay(pair.delay)}
          />
          {/* <FormFeedback
            className={validateDelay(pair.delay) ? "invisible d-block" : ""}
          >
            {`Should lie between ${GLOBAL_CONSTANTS.DELAY_REQUEST_CONSTANTS.MIN_DELAY_VALUE} and ${GLOBAL_CONSTANTS.DELAY_REQUEST_CONSTANTS.MAX_DELAY_VALUE_NON_XHR}`}
          </FormFeedback> */}
        </Col>

        {ruleDetails.SHOW_DELETE_PAIR_ICON_ON_SOURCE_ROW && !isInputDisabled ? (
          <Col className="my-auto" span={1} align="right">
            <Tooltip title="Remove Pair">
              <FaTrash
                onClick={(e) => deletePair(e, pairIndex)}
                style={{ cursor: "pointer" }}
              />
            </Tooltip>
          </Col>
        ) : null}
      </Row>
    </>
  );
};

export default RequestSourceRow;
