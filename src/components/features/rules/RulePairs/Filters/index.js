import React, { useContext } from "react";
import ReactSelect from "react-select";

import {
  Modal,
  Row,
  Col,
  Input,
  Typography,
  Dropdown,
  Menu,
  Alert,
} from "antd";
//STORE
import { store } from "../../../../../store";
//UTILITIES
import * as GlobalStoreUtils from "../../../../../utils/GlobalStoreUtils";
import { submitEventUtil } from "../../../../../utils/AnalyticsUtils";
import { isFeatureCompatible } from "utils/CompatibilityUtils";
//EXTERNALS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import { FEATURES } from "config/constants/compatibility";
import APP_CONSTANTS from "config/constants";
//REDUCER ACTION OBJECTS
import { getUpdateCurrentlySelectedRuleDataActionObject } from "../../../../../store/action-objects";
//actions
import deleteObjectAtPath from "./actions/deleteObjectAtPath";
import getObjectValue from "./actions/getObjectValue";
import {
  getReactSelectValue,
  setReactSelectValue,
} from "./actions/reactSelect";
import { CloseCircleOutlined, DownOutlined } from "@ant-design/icons";
import {
  trackPageURlModifiedEvent,
  trackResourceTypeModifiedEvent,
  trackRequestMethodModifiedEvent,
  trackRequestPayloadKeyModifiedEvent,
  trackRequestPayloadValueModifiedEvent,
} from "../../../../../utils/analytics/rules/filters";
const { Text, Link } = Typography;

const RESOURCE_TYPE_OPTIONS = [
  { label: "All (default)", value: "all", isDisabled: true },
  { label: "XHR", value: "xmlhttprequest" },
  { label: "JS", value: "script" },
  { label: "CSS", value: "stylesheet" },
  { label: "Image", value: "image" },
  { label: "Media", value: "media" },
  { label: "Font", value: "font" },
  { label: "Web Socket", value: "websocket" },
  { label: "Main Document", value: "main_frame" },
  { label: "iFrame Document", value: "sub_frame" },
];
const REQUEST_METHOD_OPTIONS = [
  { label: "All (default)", value: "all", isDisabled: true },
  { label: "GET", value: "GET" },
  { label: "POST", value: "POST" },
  { label: "PUT", value: "PUT" },
  { label: "DELETE", value: "DELETE" },
  { label: "PATCH", value: "PATCH" },
  { label: "OPTIONS", value: "OPTIONS" },
  { label: "TRACE", value: "TRACE" },
  { label: "CONNECT", value: "CONNECT" },
  { label: "HEAD", value: "HEAD" },
];

const generatePlaceholderText = (operator) => {
  switch (operator) {
    case GLOBAL_CONSTANTS.RULE_OPERATORS.EQUALS:
      return "e.g. http://www.example.com";
    case GLOBAL_CONSTANTS.RULE_OPERATORS.CONTAINS:
      return "e.g. facebook";
    case GLOBAL_CONSTANTS.RULE_OPERATORS.WILDCARD_MATCHES:
      return "e.g. *://*.mydomain.com/*";
    case GLOBAL_CONSTANTS.RULE_OPERATORS.MATCHES:
      return "e.g. /example-([0-9]+)/ig";
    default:
      return "Select a condition first";
  }
};

const Filters = (props) => {
  const { modifyPairAtGivenPath } = props;
  const { pairIndex } = props;
  //Global State
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const currentlySelectedRuleData = GlobalStoreUtils.getCurrentlySelectedRuleData(
    state
  );
  const setCurrentlySelectedRule = (newRule) =>
    dispatch(getUpdateCurrentlySelectedRuleDataActionObject(newRule));
  const isRequestPayloadFilterCompatible =
    isFeatureCompatible(FEATURES.REQUEST_PAYLOAD_FILTER) &&
    currentlySelectedRuleData.ruleType === GLOBAL_CONSTANTS.RULE_TYPES.RESPONSE;
  const getCurrentPageURLOperatorText = () => {
    switch (
      getObjectValue(
        currentlySelectedRuleData,
        pairIndex,
        GLOBAL_CONSTANTS.PATH_FROM_PAIR.SOURCE_PAGE_URL_OPERATOR
      )
    ) {
      case GLOBAL_CONSTANTS.RULE_OPERATORS.WILDCARD_MATCHES:
        return "Wildcard";
      case GLOBAL_CONSTANTS.RULE_OPERATORS.MATCHES:
        return "RegEx";
      case "":
        return "Select";
      default:
        return getObjectValue(
          currentlySelectedRuleData,
          pairIndex,
          GLOBAL_CONSTANTS.PATH_FROM_PAIR.SOURCE_PAGE_URL_OPERATOR
        );
    }
  };

  const clearRequestPayload = (e) => {
    if (e === "") {
      deleteObjectAtPath(
        currentlySelectedRuleData,
        setCurrentlySelectedRule,
        `source.filters.requestPayload`,
        pairIndex
      );
      deleteObjectAtPath(
        currentlySelectedRuleData,
        setCurrentlySelectedRule,
        `source.filters.requestPayload`,
        pairIndex
      );
    }
  };

  const renderClearFilterIcon = (filterToClear) => (
    <span
      // className="float-right custom-tooltip"
      onClick={() => {
        deleteObjectAtPath(
          currentlySelectedRuleData,
          setCurrentlySelectedRule,
          `source.filters.${filterToClear}`,
          pairIndex
        );
        //Analytics
        submitEventUtil(
          GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULE,
          GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.DELETE,
          "Rule source " + filterToClear + " filter modified"
        );
      }}
      className="cursor-pointer"
    >
      <CloseCircleOutlined />
    </span>
  );

  //Analytics
  const LOG_ANALYTICS = {};
  LOG_ANALYTICS.PAGE_URL_MODIFIED = () => {
    submitEventUtil(
      GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULE,
      GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.MODIFIED,
      "rule_source_pageUrl_filter_modified"
    );
    trackPageURlModifiedEvent(currentlySelectedRuleData.ruleType);
  };
  LOG_ANALYTICS.RESOURCE_TYPE_MODIFIED = () => {
    submitEventUtil(
      GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULE,
      GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.MODIFIED,
      "rule_source_resourceType_filter_modified"
    );
    trackResourceTypeModifiedEvent(currentlySelectedRuleData.ruleType);
  };
  LOG_ANALYTICS.REQUEST_METHOD_MODIFIED = () => {
    submitEventUtil(
      GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULE,
      GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.MODIFIED,
      "rule_source_requestMethod_filter_modified"
    );
    trackRequestMethodModifiedEvent(currentlySelectedRuleData.ruleType);
  };
  LOG_ANALYTICS.KEY = () => {
    submitEventUtil(
      GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULE,
      GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.MODIFIED,
      "request_payload_key_changed"
    );
    trackRequestPayloadKeyModifiedEvent(currentlySelectedRuleData.ruleType);
  };
  LOG_ANALYTICS.VALUE = () => {
    submitEventUtil(
      GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULE,
      GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.MODIFIED,
      "request_payload_value_changed"
    );
    trackRequestPayloadValueModifiedEvent(currentlySelectedRuleData.ruleType);
  };

  const urlOperatorOptions = (
    <Menu>
      <Menu.Item key={1}>
        <span
          onClick={(event) =>
            modifyPairAtGivenPath(
              event,
              pairIndex,
              GLOBAL_CONSTANTS.PATH_FROM_PAIR.SOURCE_PAGE_URL_OPERATOR,
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
              GLOBAL_CONSTANTS.PATH_FROM_PAIR.SOURCE_PAGE_URL_OPERATOR,
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
              GLOBAL_CONSTANTS.PATH_FROM_PAIR.SOURCE_PAGE_URL_OPERATOR,
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
              GLOBAL_CONSTANTS.PATH_FROM_PAIR.SOURCE_PAGE_URL_OPERATOR,
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
    <React.Fragment>
      <Modal
        // className="modal-dialog-centered max-width-60-percent"
        visible={pairIndex !== false ? true : false}
        onCancel={() => props.closeModal()}
        footer={null}
        title="Source Filters"
        width={700}
      >
        <span
          style={{
            margin: "auto",
            marginBottom: "10px",
            marginTop: "-15px",
            display: "table",
          }}
        >
          <Alert
            message="Values are saved automatically"
            type="info"
            showIcon
            closable
          />
        </span>
        <Row
          style={{
            paddingBottom: "1rem",
            alignItems: "center",
          }}
        >
          <Col span={3}>
            <span>Page URL</span>
          </Col>
          <Col span={6} align="center">
            <Dropdown
              overlay={urlOperatorOptions}
              disabled={props.isInputDisabled}
            >
              <Text
                strong
                className="ant-dropdown-link all-caps-text"
                onClick={(e) => {
                  e.preventDefault();
                  LOG_ANALYTICS.PAGE_URL_MODIFIED(e);
                }}
                style={{ textTransform: "uppercase", cursor: "pointer" }}
              >
                {getCurrentPageURLOperatorText()} <DownOutlined />
              </Text>
            </Dropdown>
          </Col>
          <Col span={12}>
            <Input
              placeholder={generatePlaceholderText(
                getObjectValue(
                  currentlySelectedRuleData,
                  pairIndex,
                  GLOBAL_CONSTANTS.PATH_FROM_PAIR.SOURCE_PAGE_URL_OPERATOR
                )
              )}
              name="description"
              type="text"
              // className="has-dark-text height-two-rem"
              value={getObjectValue(
                currentlySelectedRuleData,
                pairIndex,
                GLOBAL_CONSTANTS.PATH_FROM_PAIR.SOURCE_PAGE_URL_VALUE
              )}
              onChange={(event) => {
                modifyPairAtGivenPath(
                  event,
                  pairIndex,
                  GLOBAL_CONSTANTS.PATH_FROM_PAIR.SOURCE_PAGE_URL_VALUE
                );
                LOG_ANALYTICS.PAGE_URL_MODIFIED();
              }}
              disabled={
                getCurrentPageURLOperatorText() === "Select"
                  ? true
                  : props.isInputDisabled
              }
            />
          </Col>
          <Col align="right" span={3}>
            {renderClearFilterIcon(
              GLOBAL_CONSTANTS.RULE_SOURCE_FILTER_TYPES.PAGE_URL
            )}
          </Col>
        </Row>

        <Row
          className="one-padding-bottom"
          style={{
            paddingBottom: "1rem",
            alignItems: "center",
          }}
        >
          <Col span={5}>
            <span>Resource Type</span>
          </Col>
          <Col span={17}>
            <ReactSelect
              isMulti={true}
              name="resource-type"
              options={RESOURCE_TYPE_OPTIONS}
              isDisabled={props.isInputDisabled}
              placeholder="All (default)"
              value={getReactSelectValue(
                currentlySelectedRuleData,
                pairIndex,
                GLOBAL_CONSTANTS.PATH_FROM_PAIR.SOURCE_RESOURCE_TYPE,
                RESOURCE_TYPE_OPTIONS
              )}
              onChange={(newValues) => {
                setReactSelectValue(
                  currentlySelectedRuleData,
                  setCurrentlySelectedRule,
                  pairIndex,
                  newValues,
                  GLOBAL_CONSTANTS.PATH_FROM_PAIR.SOURCE_RESOURCE_TYPE
                );
                LOG_ANALYTICS.RESOURCE_TYPE_MODIFIED();
              }}
            />
          </Col>
          <Col span={2} align="right">
            {renderClearFilterIcon(
              GLOBAL_CONSTANTS.RULE_SOURCE_FILTER_TYPES.RESOURCE_TYPE
            )}
          </Col>
        </Row>

        <Row
          className="one-padding-bottom"
          style={{
            paddingBottom: "1rem",
            alignItems: "center",
          }}
        >
          <Col span={5}>
            <span>Request Method</span>
          </Col>
          <Col span={17}>
            <ReactSelect
              isMulti={true}
              name="request-method"
              isDisabled={props.isInputDisabled}
              options={REQUEST_METHOD_OPTIONS}
              placeholder="All (default)"
              value={getReactSelectValue(
                currentlySelectedRuleData,
                pairIndex,
                GLOBAL_CONSTANTS.PATH_FROM_PAIR.SOURCE_REQUEST_METHOD,
                REQUEST_METHOD_OPTIONS
              )}
              onChange={(newValues) =>
                setReactSelectValue(
                  currentlySelectedRuleData,
                  setCurrentlySelectedRule,
                  pairIndex,
                  newValues,
                  GLOBAL_CONSTANTS.PATH_FROM_PAIR.SOURCE_REQUEST_METHOD
                )
              }
            />
          </Col>
          <Col span={2} align="right">
            {renderClearFilterIcon(
              GLOBAL_CONSTANTS.RULE_SOURCE_FILTER_TYPES.REQUEST_METHOD
            )}
          </Col>
        </Row>
        {isRequestPayloadFilterCompatible ? (
          <>
            <Row
              className="one-padding-bottom"
              style={{
                paddingBottom: "0.25rem",
                alignItems: "center",
              }}
            >
              <Col span={5}>
                <span>Request Payload</span>
              </Col>
              <Col span={8}>
                <Input
                  placeholder="key"
                  name="key"
                  type="text"
                  disabled={props.isInputDisabled}
                  // className="has-dark-text height-two-rem"
                  value={getObjectValue(
                    currentlySelectedRuleData,
                    pairIndex,
                    GLOBAL_CONSTANTS.PATH_FROM_PAIR.SOURCE_REQUEST_PAYLOAD_KEY
                  )}
                  onChange={(event) => {
                    modifyPairAtGivenPath(
                      event,
                      pairIndex,
                      GLOBAL_CONSTANTS.PATH_FROM_PAIR.SOURCE_REQUEST_PAYLOAD_KEY
                    );
                    clearRequestPayload(event.target.value);
                    LOG_ANALYTICS.KEY();
                  }}
                />
              </Col>
              <Col span={8} offset={1}>
                <Input
                  placeholder="value"
                  name="value"
                  type="text"
                  disabled={props.isInputDisabled}
                  // className="has-dark-text height-two-rem"
                  value={getObjectValue(
                    currentlySelectedRuleData,
                    pairIndex,
                    GLOBAL_CONSTANTS.PATH_FROM_PAIR.SOURCE_REQUEST_PAYLOAD_VALUE
                  )}
                  onChange={(event) => {
                    modifyPairAtGivenPath(
                      event,
                      pairIndex,
                      GLOBAL_CONSTANTS.PATH_FROM_PAIR
                        .SOURCE_REQUEST_PAYLOAD_VALUE
                    );
                    clearRequestPayload(event.target.value);
                    LOG_ANALYTICS.VALUE();
                  }}
                />
              </Col>
              <Col offset={5}>
                <span style={{ fontSize: "0.75rem" }}>
                  Through Request Payload you can also target GraphQL APIs.{" "}
                  <Link
                    onClick={() =>
                      window.open(
                        APP_CONSTANTS.LINKS.REQUESTLY_DOCS_MOCK_GRAPHQL,
                        "_blank"
                      )
                    }
                    className="cursor-pointer"
                  >
                    Read more
                  </Link>
                </span>
              </Col>
            </Row>
          </>
        ) : null}
      </Modal>
    </React.Fragment>
  );
};

export default Filters;
