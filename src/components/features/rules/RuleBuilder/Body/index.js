import React, { useContext } from "react";
import { CardBody } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { Row, Col, Input, Alert, Button } from "antd";
//SUB COMPONENTS
import RulePairs from "../../RulePairs";
import GroupName from "./Columns/GroupName";
import Description from "./Columns/Description";
import PairTitle from "./Columns/PairTitle";
import AddPairButton from "./Columns/AddPairButton";
//CONSTANTS
import APP_CONSTANTS from "../../../../../config/constants";
import { getCurrentlySelectedRuleData } from "utils/GlobalStoreUtils";
import { store } from "store";
import { onChangeHandler } from "./actions";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import { redirectToTraffic } from "utils/RedirectionUtils";
import { isDesktopMode } from "../../../../../utils/AppUtils";
import { QuestionCircleOutlined } from "@ant-design/icons";

const Body = ({
  currentlySelectedRuleConfig,
  setIsChangeRuleGroupModalActive,
  currentlySelectedGroup,
  mode,
}) => {
  //Global State
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const currentlySelectedRuleData = getCurrentlySelectedRuleData(state);

  //Utils
  const navigate = useNavigate();
  const navigateToTraffic = () => {
    redirectToTraffic(navigate);
  };

  return (
    <CardBody>
      {mode !== APP_CONSTANTS.RULE_EDITOR_CONFIG.MODES.SHARED_LIST_RULE_VIEW ? (
        <>
          <Row className="one-margin-bottom">
            <Col
              className="col-auto text-xl-right text-md-right text-lg-right"
              // style={{ paddingRight: "0px", marginRight: "0px" }}
              span={
                currentlySelectedGroup &&
                typeof currentlySelectedGroup === "string" &&
                currentlySelectedGroup.length > 28
                  ? 24
                  : 8
              }
            >
              <Input
                addonBefore={
                  <GroupName
                    currentlySelectedRuleConfig={currentlySelectedRuleConfig}
                    setIsChangeRuleGroupModalActive={
                      setIsChangeRuleGroupModalActive
                    }
                    currentlySelectedGroup={currentlySelectedGroup}
                  />
                }
                placeholder="Rule Name"
                name="name"
                type="text"
                className=" has-dark-text "
                value={currentlySelectedRuleData.name}
                onChange={(event) =>
                  onChangeHandler(currentlySelectedRuleData, dispatch, event)
                }
                autoFocus
              />
            </Col>

            <Col
              span={
                currentlySelectedGroup &&
                typeof currentlySelectedGroup === "string" &&
                currentlySelectedGroup.length > 28
                  ? 24
                  : 14
              }
              offset={
                currentlySelectedGroup &&
                typeof currentlySelectedGroup === "string" &&
                currentlySelectedGroup.length > 28
                  ? 0
                  : 2
              }
              style={
                currentlySelectedGroup &&
                typeof currentlySelectedGroup === "string" &&
                currentlySelectedGroup.length > 28
                  ? { marginTop: "1%" }
                  : {}
              }
            >
              <Description />
            </Col>
          </Row>
          <br />
        </>
      ) : null}

      {currentlySelectedRuleConfig.ALLOW_ADD_PAIR ? (
        <Row justify="end">
          <Col span={18}>
            <PairTitle
              currentlySelectedRuleConfig={currentlySelectedRuleConfig}
            />
          </Col>
          <Col span={6} align="right">
            {mode !==
            APP_CONSTANTS.RULE_EDITOR_CONFIG.MODES.SHARED_LIST_RULE_VIEW ? (
              <AddPairButton
                currentlySelectedRuleConfig={currentlySelectedRuleConfig}
              />
            ) : null}
          </Col>
        </Row>
      ) : null}

      {/* Info for some specific rule types */}
      {!isDesktopMode() &&
      currentlySelectedRuleConfig.TYPE ===
        GLOBAL_CONSTANTS.RULE_TYPES.RESPONSE ? (
        <>
          <Row style={{ marginBottom: 5 }}>
            <Col span={24}>
              <Alert
                style={{ fontSize: 13, padding: 5 }}
                message={
                  <>
                    <li>
                      Only API Responses triggered by XHR/fetch can be modified
                      by Chrome Extension.
                      <a
                        target="_blank"
                        href="https://docs.requestly.io/using-rules/modify-ajax-response-rule/modify-response-faqs"
                      >
                        {" "}
                        Read FAQ.
                      </a>{" "}
                    </li>
                    <li>
                      To Modify Response for every request types, Use{" "}
                      <a target="_blank" href="https://requestly.io/desktop/">
                        Requestly Desktop App.
                      </a>
                      <a
                        target="_blank"
                        href="https://www.youtube.com/watch?v=xUdwViRtiY0"
                      >
                        {" "}
                        Watch Demo.
                      </a>
                    </li>
                  </>
                }
                type="info"
                showIcon
                closable
              />
            </Col>
          </Row>
        </>
      ) : null}
      {currentlySelectedRuleConfig.TYPE ===
      GLOBAL_CONSTANTS.RULE_TYPES.DELAY ? (
        <>
          <Row style={{ marginBottom: 5 }}>
            <Col span={24}>
              <Alert
                message="Delay is capped automatically to avoid browsing performance degradation."
                type="info"
                showIcon
                description={`For XHR/Fetch, max delay is ${GLOBAL_CONSTANTS.DELAY_REQUEST_CONSTANTS.MAX_DELAY_VALUE_XHR}ms & for other resources (JS, CSS, Images etc), max delay is ${GLOBAL_CONSTANTS.DELAY_REQUEST_CONSTANTS.MAX_DELAY_VALUE_NON_XHR}ms`}
                closable
                // onClose={(e)=>console.log(e)} // TODO: Save close state to local storage
              />
            </Col>
          </Row>
        </>
      ) : null}
      {currentlySelectedRuleConfig.TYPE ===
      GLOBAL_CONSTANTS.RULE_TYPES.HEADERS ? (
        <>
          <Row className=" margin-top-one">
            <Col span={24}>
              {isDesktopMode() ? (
                <Alert
                  message="Request Headers modification done by Requestly are not visible in the Browsers devtool but they are actually modified"
                  type="info"
                  showIcon
                  description="You can see the original headers in the Requestly Traffic logger."
                  closable
                  action={
                    <>
                      &nbsp;
                      <Button shape="round" onClick={navigateToTraffic}>
                        See Traffic
                      </Button>
                    </>
                  }
                />
              ) : (
                <Alert
                  message="Response Headers modification done by Requestly are not visible in Browsers devtool but they are actually modified"
                  type="info"
                  showIcon
                  closable
                />
              )}
            </Col>
          </Row>
          <br />
        </>
      ) : null}

      {/* Render Pairs */}
      <RulePairs
        mode={mode}
        currentlySelectedRuleConfig={currentlySelectedRuleConfig}
      />
    </CardBody>
  );
};

export default Body;
