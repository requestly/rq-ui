import React, { useContext, useState } from "react";
import { Row, Col, Radio, Typography, Popover } from "antd";
// Constants
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import APP_CONSTANTS from "config/constants";
// Utils
import * as GlobalStoreUtils from "../../../../../../../../utils/GlobalStoreUtils";
import { getByteSize } from "../../../../../../../../utils/FormattingHelper";
// Actions
import { getResponseBodyCharacterLimit } from "./actions";
// Store
import { store } from "../../../../../../../../store";
import LimitReachedModal from "components/user/LimitReachedModal";
import { Popconfirm } from "antd";
import AceEditor from "react-ace";
import FileDialogButton from "components/mode-specific/desktop/misc/FileDialogButton";
import { isFeatureCompatible } from "utils/CompatibilityUtils";
import { FEATURES } from "config/constants/compatibility";
import { getAppDetails } from "utils/AppUtils";

const { Text } = Typography;

const ResponseBodyRow = ({
  rowIndex,
  pair,
  pairIndex,
  helperFunctions,
  ruleDetails,
  isInputDisabled,
}) => {
  const { modifyPairAtGivenPath } = helperFunctions;
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const user = GlobalStoreUtils.getUserAuthDetails(state);
  const [isLimitReachedModalActive, setIsLimitReachedModalActive] = useState(
    false
  );
  const [responseBodyCharacterLimit] = useState(
    getResponseBodyCharacterLimit(user)
  );
  const [responseTypePopupVisible, setResponseTypePopupVisible] = useState(
    false
  );
  const [responseTypePopupSelection, setResponseTypePopupSelection] = useState(
    GLOBAL_CONSTANTS.RESPONSE_BODY_TYPES.STATIC
  );

  // fetch planName from global state
  const planName =
    user.details?.planDetails?.planName ||
    APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE;

  const activeLimitedFeatureName =
    APP_CONSTANTS.FEATURES.RESPONSE_BODY_CHARACTER_LIMIT;

  const toggleLimitReachedModal = () => {
    setIsLimitReachedModalActive(isLimitReachedModalActive ? false : true);
  };

  const promptUserToUpgrade = () => {
    //Activate modal to notify user to upgrade
    setIsLimitReachedModalActive(true);
  };

  const isPremium = user.details?.isPremium;

  const onChangeResponseType = (responseType) => {
    if (
      Object.values(GLOBAL_CONSTANTS.RESPONSE_BODY_TYPES).includes(responseType)
    ) {
      let value = "";
      if (responseType === GLOBAL_CONSTANTS.RESPONSE_BODY_TYPES.CODE) {
        value = ruleDetails["RESPONSE_BODY_JAVASCRIPT_DEFAULT_VALUE"];
      }

      modifyPairAtGivenPath(null, pairIndex, `response.type`, responseType, [
        {
          path: `response.value`,
          value: value,
        },
      ]);
    }
  };

  const handleFileSelectCallback = (selectedFile) => {
    modifyPairAtGivenPath(
      null,
      pairIndex,
      `response.type`,
      GLOBAL_CONSTANTS.RESPONSE_BODY_TYPES.LOCAL_FILE,
      [
        {
          path: `response.value`,
          value: selectedFile,
        },
      ]
    );
  };

  const showPopup = (e) => {
    const responseType = e.target.value;

    setResponseTypePopupSelection(responseType);
    setResponseTypePopupVisible(true);
  };

  const renderFileSelector = () => {
    if (
      pair.response.type === GLOBAL_CONSTANTS.RESPONSE_BODY_TYPES.LOCAL_FILE
    ) {
      return (
        <Row span={24} className="margin-top-one">
          <Col span={24} align="right">
            <Text keyboard style={{ paddingRight: 8 }}>
              {pair.response.value || "No File Selected"}
            </Text>
            <FileDialogButton callback={handleFileSelectCallback} />
          </Col>
        </Row>
      );
    }

    return null;
  };

  return (
    <React.Fragment key={rowIndex}>
      <Row
        className="margin-top-one"
        key={rowIndex}
        span={24}
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Col span={12}>
          <span>Response Body</span>
        </Col>
        <Col span={12} align="right">
          <Popconfirm
            title="This will clear the existing body content"
            onConfirm={() => {
              onChangeResponseType(responseTypePopupSelection);
              setResponseTypePopupVisible(false);
            }}
            onCancel={() => setResponseTypePopupVisible(false)}
            okText="Confirm"
            cancelText="Cancel"
            visible={responseTypePopupVisible}
          >
            <Radio.Group
              onChange={showPopup}
              value={pair.response.type}
              disabled={isInputDisabled}
            >
              <Radio value={GLOBAL_CONSTANTS.RESPONSE_BODY_TYPES.STATIC}>
                Static Data
              </Radio>
              <Radio value={GLOBAL_CONSTANTS.RESPONSE_BODY_TYPES.CODE}>
                Programmatically (JS Script)
              </Radio>
              {getAppDetails().app_mode ===
              GLOBAL_CONSTANTS.APP_MODES.DESKTOP ? (
                isFeatureCompatible(FEATURES.RESPONSE_MAP_LOCAL) ? (
                  <Radio
                    value={GLOBAL_CONSTANTS.RESPONSE_BODY_TYPES.LOCAL_FILE}
                  >
                    Local File
                  </Radio>
                ) : (
                  <Popover
                    placement="left"
                    content={
                      "Update to latest version of app to enjoy this feature"
                    }
                  >
                    <Radio
                      value={GLOBAL_CONSTANTS.RESPONSE_BODY_TYPES.LOCAL_FILE}
                      disabled={true}
                    >
                      Local File
                    </Radio>
                  </Popover>
                )
              ) : null}
            </Radio.Group>
          </Popconfirm>
        </Col>
      </Row>
      {renderFileSelector()}
      {pair.response.type !==
      GLOBAL_CONSTANTS.RESPONSE_BODY_TYPES.LOCAL_FILE ? (
        <>
          <Row
            className=" margin-top-one"
            span={24}
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Col xl="12" span={24}>
              <AceEditor
                width="100%"
                height="400px"
                placeholder="Response Body"
                mode="javascript"
                theme="monokai"
                name="body_editor"
                fontSize={17}
                showPrintMargin={false}
                showGutter={true}
                highlightActiveLine={true}
                wrapEnabled={true}
                onChange={(value) => {
                  modifyPairAtGivenPath(
                    null,
                    pairIndex,
                    `response.value`,
                    value
                  );
                }}
                value={pair.response.value}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  showLineNumbers: true,
                  tabSize: 2,
                }}
                style={{
                  borderRadius: "5px",
                  marginBottom: "0.5rem",
                  marginTop: "0.5rem",
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col xl="12" span={24}>
              <span className="codemirror-character-count">
                {responseBodyCharacterLimit - getByteSize(pair.response.value)}{" "}
                characters left.
              </span>
              {!isPremium && (
                <span
                  style={{
                    marginLeft: ".2rem",
                    color: "blue",
                    fontSize: ".8rem",
                    cursor: "pointer",
                  }}
                  onClick={promptUserToUpgrade}
                >
                  Increase limit
                </span>
              )}
            </Col>
          </Row>
        </>
      ) : null}
      {!!isLimitReachedModalActive && (
        <LimitReachedModal
          isOpen={isLimitReachedModalActive}
          toggle={toggleLimitReachedModal}
          featureName={activeLimitedFeatureName}
          featureLimit={responseBodyCharacterLimit}
          userPlanName={planName}
          mode={
            responseBodyCharacterLimit === 0
              ? APP_CONSTANTS.LIMIT_REACHED_MODAL.MODES.CHECK_IF_ENABLED
              : APP_CONSTANTS.LIMIT_REACHED_MODAL.MODES.CHECK_LIMIT
          }
        />
      )}
    </React.Fragment>
  );
};

export default ResponseBodyRow;
