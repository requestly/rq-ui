import React, { useContext, useState } from "react";
import {
  Row,
  Col,
  Input,
  Tooltip,
  Typography,
  Menu,
  Dropdown,
  Space,
} from "antd";
//SUB COMPONENTS
import FilePickerModal from "../../../../../../filesLibrary/FilePickerModal";
//Icons
import {
  DeleteOutlined,
  DownOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
//Constants
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import AceEditor from "react-ace";
import { store } from "store";
import { getUserAuthDetails } from "utils/GlobalStoreUtils";
import LimitReachedModal from "components/user/LimitReachedModal";
import APP_CONSTANTS from "config/constants";
import { getFeatureLimits } from "../../../../../../../../utils/FeatureManager";

const { Text } = Typography;

const CustomScriptRow = ({
  rowIndex,
  pairIndex,
  helperFunctions,
  script,
  scriptIndex,
  ruleDetails,
  isInputDisabled,
}) => {
  const { modifyPairAtGivenPath, deleteScript } = helperFunctions;
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const user = getUserAuthDetails(state);

  // fetch planName from global state
  const userPlanName =
    user.details?.planDetails?.planName ||
    APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE;

  const characterLimit = getFeatureLimits(
    APP_CONSTANTS.FEATURES.SCRIPT_RULE_CHARACTER_LIMIT,
    user,
    userPlanName
  );

  //Component State
  const [isFilePickerModalActive, setIsFilePickerModalActive] = useState(false);
  const [isLimitReachedModalActive, setIsLimitReachedModalActive] = useState(
    false
  );

  const toggleFilePickerModal = () => {
    setIsFilePickerModalActive(!isFilePickerModalActive);
  };

  const handleFilePick = (e) => {
    setIsFilePickerModalActive(true);
  };

  const handleFilePickerAction = (url) => {
    setIsFilePickerModalActive(false);
    modifyPairAtGivenPath(
      undefined,
      pairIndex,
      `scripts[${scriptIndex}].value`,
      url
    );
  };

  const activeLimitedFeatureName =
    APP_CONSTANTS.FEATURES.SCRIPT_RULE_CHARACTER_LIMIT;

  const toggleLimitReachedModal = () => {
    setIsLimitReachedModalActive(isLimitReachedModalActive ? false : true);
  };

  const promptUserToUpgrade = () => {
    //Activate modal to notify user to upgrade
    setIsLimitReachedModalActive(true);
  };

  const isPremium = user.details?.isPremium;

  const renderURLInput = () => {
    return (
      <React.Fragment>
        <Row
          className="margin-top-one"
          span={24}
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Col span={4}>
            <span>Source</span>
          </Col>
          <Col span={20}>
            <Input
              style={{ cursor: "pointer" }}
              addonAfter={
                <Tooltip
                  title="Import a existing Mock API"
                  onClick={handleFilePick}
                >
                  <FolderOpenOutlined />
                  &nbsp; Pick from Mock Server
                </Tooltip>
              }
              className="display-inline-block has-dark-text"
              placeholder="Enter Source URL (relative or absolute)"
              type="text"
              disabled={isInputDisabled}
              onChange={(event) =>
                modifyPairAtGivenPath(
                  event,
                  pairIndex,
                  `scripts[${scriptIndex}].value`
                )
              }
              value={script.value}
            />
          </Col>
        </Row>
        {/* MODALS */}
        {isFilePickerModalActive ? (
          <FilePickerModal
            isOpen={isFilePickerModalActive}
            toggle={toggleFilePickerModal}
            callback={handleFilePickerAction}
          />
        ) : null}
      </React.Fragment>
    );
  };

  const renderCodeMirror = () => (
    <React.Fragment>
      <Row
        className=" margin-top-one"
        key={rowIndex}
        span={24}
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Col span={24}>
          <AceEditor
            width="100%"
            height="400px"
            placeholder="Response Body"
            mode={
              script.codeType === GLOBAL_CONSTANTS.SCRIPT_CODE_TYPES.JS
                ? "javascript"
                : GLOBAL_CONSTANTS.SCRIPT_CODE_TYPES.CSS
            }
            theme="monokai"
            name="body_editor"
            fontSize={17}
            showPrintMargin={false}
            showGutter={true}
            highlightActiveLine={true}
            wrapEnabled={true}
            onChange={(value) => {
              modifyPairAtGivenPath(
                undefined,
                pairIndex,
                `scripts[${scriptIndex}].value`,
                value
              );
            }}
            value={script.value}
            maxLength="25"
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
      <Row
        span={24}
        // style={{
        //   alignItems: "center",
        //   justifyContent: "center",
        // }}
        // className=" margin-top-one"
      >
        <Col span={24}>
          <span className="codemirror-character-count">
            {characterLimit - script.value.length} characters left
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
    </React.Fragment>
  );

  const scriptTypeChangeHandler = (event, newScriptType) => {
    modifyPairAtGivenPath(
      event,
      pairIndex,
      `scripts[${scriptIndex}].type`,
      newScriptType,
      [
        {
          path: `scripts[${scriptIndex}].value`,
          value: "",
        },
      ]
    );
  };

  const loadTimeOptions = (
    <Menu>
      <Menu.Item key={1}>
        <span
          onClick={(event) =>
            modifyPairAtGivenPath(
              event,
              pairIndex,
              `scripts[${scriptIndex}].loadTime`,
              GLOBAL_CONSTANTS.SCRIPT_LOAD_TIME.AFTER_PAGE_LOAD
            )
          }
        >
          After Page Load
        </span>
      </Menu.Item>
      <Menu.Item key={2}>
        <span
          onClick={(event) =>
            modifyPairAtGivenPath(
              event,
              pairIndex,
              `scripts[${scriptIndex}].loadTime`,
              GLOBAL_CONSTANTS.SCRIPT_LOAD_TIME.BEFORE_PAGE_LOAD
            )
          }
        >
          Before Page Load
        </span>
      </Menu.Item>
    </Menu>
  );

  const scriptTimeOptions = (
    <Menu>
      <Menu.Item key={1}>
        <span
          onClick={(event) =>
            scriptTypeChangeHandler(event, GLOBAL_CONSTANTS.SCRIPT_TYPES.URL)
          }
        >
          URL
        </span>
      </Menu.Item>
      <Menu.Item key={2}>
        <span
          onClick={(event) =>
            scriptTypeChangeHandler(event, GLOBAL_CONSTANTS.SCRIPT_TYPES.CODE)
          }
        >
          Custom Code
        </span>
      </Menu.Item>
    </Menu>
  );
  const codeTypeOptions = (
    <Menu>
      <Menu.Item key={1}>
        <span
          onClick={(event) =>
            modifyPairAtGivenPath(
              event,
              pairIndex,
              `scripts[${scriptIndex}].codeType`,
              GLOBAL_CONSTANTS.SCRIPT_CODE_TYPES.JS
            )
          }
        >
          JavaScript
        </span>
      </Menu.Item>
      <Menu.Item key={2}>
        <span
          onClick={(event) =>
            modifyPairAtGivenPath(
              event,
              pairIndex,
              `scripts[${scriptIndex}].codeType`,
              GLOBAL_CONSTANTS.SCRIPT_CODE_TYPES.CSS
            )
          }
        >
          CSS
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="custom-script-row github-like-border" key={rowIndex}>
      <Row
        className="margin-top-one rule-builder-row"
        style={{
          alignItems: "center",
          justifyContent: "center",
          rowGap: "0.5rem",
          whiteSpace: "nowrap",
        }}
      >
        <Col
          span={12}
          lg={4}
          align="center"
          // style={{text}}
          // xl={{ size: "auto" }}
          // lg={{ size: "auto" }}
          // md={{ size: "auto" }}
          // sm={{ size: "auto" }}
          // xs={{ size: "auto" }}
        >
          <Space>
            <Text>Code Type</Text>
            <Dropdown overlay={codeTypeOptions} disabled={isInputDisabled}>
              <Text
                strong
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
                style={{ textTransform: "uppercase", cursor: "pointer" }}
              >
                {script.codeType} <DownOutlined />
              </Text>
            </Dropdown>
          </Space>
        </Col>
        <Col
          span={12}
          lg={5}
          align="center"
          // xl={{ size: "auto" }}
          // lg={{ size: "auto" }}
          // md={{ size: "auto" }}
          // sm={{ size: "auto" }}
          // xs={{ size: "auto" }}
        >
          <Space>
            <Text>Code Source</Text>
            <Dropdown overlay={scriptTimeOptions} disabled={isInputDisabled}>
              <Text
                strong
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
                style={{ textTransform: "uppercase", cursor: "pointer" }}
              >
                {script.type} <DownOutlined />
              </Text>
            </Dropdown>
          </Space>
        </Col>
        {script.codeType === GLOBAL_CONSTANTS.SCRIPT_CODE_TYPES.JS ? (
          <Col
            // xl={{ size: "auto" }}
            // lg={{ size: "auto" }}
            // md={{ size: "auto" }}
            // sm={{ size: "auto" }}
            // xs={{ size: "auto" }}
            span={12}
            lg={6}
            align="center"
          >
            <Space>
              <Text>Insert</Text>
              <Dropdown overlay={loadTimeOptions} disabled={isInputDisabled}>
                <Text
                  strong
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                  style={{ textTransform: "capitalize", cursor: "pointer" }}
                >
                  {script.loadTime ===
                  GLOBAL_CONSTANTS.SCRIPT_LOAD_TIME.AFTER_PAGE_LOAD
                    ? "After Page Load"
                    : "Before Page Load"}{" "}
                  <DownOutlined />
                </Text>
              </Dropdown>
            </Space>
          </Col>
        ) : null}
        <Col
          className="my-auto center-on-small-screen"
          align="right"
          span={12}
          lg={9}
        >
          <Tooltip title="Remove">
            <DeleteOutlined
              id="delete-pair"
              color="#4A5868"
              onClick={(e) => deleteScript(e, pairIndex, scriptIndex)}
              style={{ cursor: "pointer" }}
            />
          </Tooltip>
        </Col>
      </Row>
      {script.type === GLOBAL_CONSTANTS.SCRIPT_TYPES.URL
        ? renderURLInput()
        : renderCodeMirror()}
      {!!isLimitReachedModalActive && (
        <LimitReachedModal
          isOpen={isLimitReachedModalActive}
          toggle={toggleLimitReachedModal}
          featureName={activeLimitedFeatureName}
          userPlanName={userPlanName}
        />
      )}
    </div>
  );
};

export default CustomScriptRow;
