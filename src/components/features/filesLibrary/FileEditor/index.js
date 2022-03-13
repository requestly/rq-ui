import React, { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  Input,
  Descriptions,
  Space,
  Tooltip,
  Spin,
  AutoComplete,
} from "antd";
import CopyToClipboard from "react-copy-to-clipboard";
//SUB COMPONENTS
import LimitReachedModal from "../../../user/LimitReachedModal";
//STORE
import { store } from "../../../../store";
//UTILS
import * as GlobalStoreUtils from "../../../../utils/GlobalStoreUtils";
import * as FeatureManager from "../../../../utils/FeatureManager";
import {
  redirectToFiles,
  redirectToMocks,
} from "../../../../utils/RedirectionUtils";
//CONSTANTS
import APP_CONSTANTS from "../../../../config/constants";
//TEXT EDITOR
import AceEditor from "react-ace";

import "ace-builds/src-min-noconflict/mode-javascript";
import "ace-builds/src-min-noconflict/mode-css";
import "ace-builds/src-min-noconflict/mode-json";
import "ace-builds/src-min-noconflict/theme-monokai";
import "ace-builds/src-min-noconflict/ext-language_tools";
import ProCard from "@ant-design/pro-card";

import ImageViewer from "./ImageViewer";
import { getByteSize } from "../../../../utils/FormattingHelper";
import { CopyOutlined, RightOutlined } from "@ant-design/icons";
import {
  getMockUrl,
  getMockTypeFromUrl,
  getDelayMockUrl,
} from "utils/files/urlUtils";

const ace = require("ace-builds/src-noconflict/ace");
ace.config.set(
  "basePath",
  "https://cdn.jsdelivr.net/npm/ace-builds@1.4.3/src-noconflict/"
);
ace.config.setModuleUrl(
  "ace/mode/javascript_worker",
  "https://cdn.jsdelivr.net/npm/ace-builds@1.4.3/src-noconflict/worker-javascript.js"
);

const RESOURCE_TYPE_LIST = {
  HTML: "HTML",
  CSS: "CSS",
  JS: "JS",
  IMAGE: "Image",
  MOCK: "API",
};

const HeaderValues = ({ onHeadersChange, headers }) => {
  return (
    <>
      <Row style={{ marginBottom: "0.5rem", marginTop: "0.5rem" }}>
        <Col span={24}>
          <h4>{"Response Headers(Optional)"}</h4>
          <AceEditor
            width="100%"
            height="100px"
            placeholder={"{ 'Header': 'Value'  }"}
            mode={"json"}
            theme="monokai"
            name="headers_editor"
            fontSize={17}
            showPrintMargin={false}
            showGutter={true}
            highlightActiveLine={true}
            onChange={onHeadersChange}
            value={headers}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
              useWorker: false,
            }}
            style={{ marginBottom: "0.5rem", marginTop: "0.5rem" }}
          />
        </Col>
      </Row>
    </>
  );
};

const FileEditor = (props) => {
  const { newFile, currentFilesCount } = props;
  const responseBodyCharacterLimit =
    APP_CONSTANTS.MOCK_RESPONSE_BODY_CHARACTER_LIMIT;
  // navigate
  const navigate = useNavigate();
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const user = GlobalStoreUtils.getUserAuthDetails(state);
  // fetch planName from global state
  const planName =
    user.details?.planDetails?.planName ||
    APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE;

  //Component State
  const [name, setName] = useState(
    props.fileDetails ? props.fileDetails.name : ""
  );
  const [contentType, setContentType] = useState(
    props.fileDetails ? props.fileDetails.contentType : "application/json"
  );
  const [method, setMethod] = useState(
    props.fileDetails ? props.fileDetails.method : "GET"
  );
  const [delayMock, setDelayMock] = useState(
    props.fileDetails ? (props.fileDetails.delay ? true : false) : false
  );
  const [delay, setDelay] = useState(
    props.fileDetails ? props.fileDetails.delay : 0
  );

  const [mockType, setMockType] = useState(
    getMockTypeFromUrl(window.location.pathname)
  );
  const [path, setPath] = useState(
    props.fileDetails ? props.fileDetails.path : ""
  );

  const [isCopied, setIsCopied] = useState("Click To Copy");

  const [resourceType, setResourceType] = useState(
    !props.fileDetails && RESOURCE_TYPE_LIST.MOCK
  );
  const [extension, setExtension] = useState(".js");
  const [description, setDescription] = useState(
    props.fileDetails ? props.fileDetails.description : ""
  );
  const [statusCode, setStatusCode] = useState(
    props.fileDetails ? props.fileDetails.statusCode : 200
  );
  const [headers, setHeaders] = useState(
    props.fileDetails ? JSON.stringify(props.fileDetails.headers) : "{}"
  );
  const [body, setBody] = useState(
    props.fileDetails
      ? props.fileDetails.body || props.fileDetails.body === ""
        ? props.fileDetails.body
        : ""
      : ""
  );
  const [isEditorReadOnly, setEditorReadOnly] = useState(false);
  const [isContentLoading, setContentLoading] = useState(false);
  const [userPlanName, setUserPlanName] = useState("Free");
  const [isLimitReachedModalActive, setIsLimitReachedModalActive] = useState(
    false
  );

  const mockVersion =
    mockType === RESOURCE_TYPE_LIST.MOCK ? (!path ? "v1" : "v2") : "v0";

  const mockUrlPath = window.location.pathname;

  const toggleLimitReachedModal = () => {
    setIsLimitReachedModalActive(isLimitReachedModalActive ? false : true);
  };

  const onBodyChange = (body) => {
    setBody(body);
  };

  const onHeadersChange = (headers) => {
    setHeaders(headers);
  };

  const handleFileExtensionOnChange = (newExtension) => {
    switch (newExtension) {
      case "JS":
        changeResourceType("application/javascript", ".js", mockType);
        break;

      case "HTML":
        changeResourceType("text/html", ".html", mockType);
        break;

      case "CSS":
        changeResourceType("text/css", ".css", mockType);
        break;

      case "API":
        changeResourceType(contentType, "", mockType);
        break;

      default:
        break;
    }
  };

  const changeResourceType = (newType, extension, resourceType) => {
    setExtension(extension);
    setContentType(newType);
    setResourceType(resourceType);
  };

  const handleDelayMock = (e) => {
    if (e > 0) {
      setDelayMock(true);
      setDelay(e);
    } else {
      setDelayMock(false);
      setDelay();
    }
  };

  const getPublicMockUrl = () => {
    if (delayMock)
      return getDelayMockUrl(
        props.fileDetails.mockID,
        delay,
        user.details.profile.uid
      );
    return (
      props.fileDetails.shortUrl ||
      getMockUrl(
        props.fileDetails.id ? props.fileDetails.id : props.fileDetails.path,
        props.fileDetails.id ? null : user.details.profile.uid
      )
    );
  };

  const handleFileWrite = () => {
    let ifLimitReached = false;
    if (newFile) {
      ifLimitReached = FeatureManager.checkIfLimitReached(
        currentFilesCount,
        APP_CONSTANTS.FEATURES.FILES,
        user,
        planName
      );
    }
    if (ifLimitReached) {
      setUserPlanName(planName);
      //Activate modal to notify user to upgrade
      setIsLimitReachedModalActive(true);
    } else {
      handleFileExtensionOnChange(mockType);
      if (resourceType === mockType) {
        //Continue allowing file save
        props.saveFile({
          name,
          contentType,
          description,
          body,
          headers,
          statusCode,
          extension,
          method,
          path,
          delay,
          isMock: mockType === RESOURCE_TYPE_LIST.MOCK,
          mockVersion,
        });
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveAndEscFn = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      mockUrlPath.includes("API") || props.fileDetails.isMock === true
        ? redirectToMocks(navigate)
        : redirectToFiles(navigate);
    } else if (
      event.key === "s" &&
      (navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)
    ) {
      if (!props.saving) {
        event.preventDefault();
        handleFileWrite();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", saveAndEscFn);
    return () => {
      document.removeEventListener("keydown", saveAndEscFn);
    };
  }, [saveAndEscFn]);

  useEffect(() => {
    const { fileDetails } = props;
    if (fileDetails) {
      const isImage = fileDetails.contentType.startsWith("image");
      if (fileDetails.isMock) {
        setResourceType(RESOURCE_TYPE_LIST.MOCK);
      } else if (isImage) {
        setResourceType(RESOURCE_TYPE_LIST.IMAGE);
      } else {
        setResourceType(fileDetails.name.split(".")[1].toUpperCase());
      }
    }
    if (props.fileDetails) {
      if (props.fileDetails.isMock) {
        setMockType("API");
      }
      if (
        props.fileDetails.contentType === "application/javascript" &&
        !props.fileDetails.isMock
      ) {
        setMockType("JS");
      }
      if (
        props.fileDetails.contentType === "text/html" &&
        !props.fileDetails.isMock
      ) {
        setMockType("HTML");
      }
      if (
        props.fileDetails.contentType === "text/css" &&
        !props.fileDetails.isMock
      ) {
        setMockType("CSS");
      }
    }
  }, [props]);

  const fetchFileContent = async () => {
    const response = await fetch(props.fileDetails.webContentLink);
    const data = await response.text();
    if (!props.fileDetails.hasOwnProperty("body")) {
      setBody(data);
      setEditorReadOnly(true);
      setContentLoading(false);
    }
  };

  const stableFetchFileContent = useCallback(fetchFileContent, [
    props.fileDetails,
  ]);

  // fetch uploaded file data
  useEffect(() => {
    if (
      props.fileDetails &&
      !props.fileDetails.hasOwnProperty("body") &&
      !isEditorReadOnly
    ) {
      stableFetchFileContent();
      setContentLoading(true);
    }
  }, [props.fileDetails, isEditorReadOnly, stableFetchFileContent]);

  const renderSaveButtonRow = (rowStyles) => {
    return (
      <Row style={rowStyles}>
        <Col span={24} align="right">
          <Space>
            {isEditorReadOnly === false ? (
              <Button
                type="primary"
                onClick={handleFileWrite}
                loading={props.saving ? true : false}
                disabled={props.saving ? true : false}
                icon={<RightOutlined />}
              >
                {props.saving ? "Creating" : newFile ? "Create Mock" : "Save"}
              </Button>
            ) : null}
            <Button
              className="btn-icon btn-3 float-right"
              type="button"
              color="secondary"
              onClick={() => {
                mockUrlPath.includes("API") || props.fileDetails.isMock === true
                  ? redirectToMocks(navigate)
                  : redirectToFiles(navigate);
              }}
            >
              <span className="btn-inner--text">Close</span>
            </Button>
          </Space>
        </Col>
      </Row>
    );
  };

  return (
    <React.Fragment>
      <ProCard className="primary-card github-like-border">
        {renderSaveButtonRow({ marginTop: "-1rem" })}
        <br />
        <Row>
          <Col span={24}>
            <Descriptions title={null} bordered>
              {/* <Descriptions.Item label="Response Type" span={3}>
                {mockType === "JS" ? (
                  <Tag color="yellow">{newFile ? mockType : resourceType}</Tag>
                ) : mockType === "CSS" ? (
                  <Tag color="geekblue">
                    {newFile ? mockType : resourceType}
                  </Tag>
                ) : mockType === "HTML" ? (
                  <Tag color="orange">{newFile ? mockType : resourceType}</Tag>
                ) : mockType === "API" ? (
                  <Tag color="green">{newFile ? mockType : resourceType}</Tag>
                ) : (
                  <Tag color="blue">{newFile ? mockType : resourceType}</Tag>
                )}
              </Descriptions.Item> */}
              <Descriptions.Item required label="Name">
                <Input
                  type="text"
                  placeholder="Name your mock"
                  value={name}
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  disabled={!newFile}
                  // addonBefore={newFile ? renderFileExtensionChange() : null}
                  style={{ width: "95%" }}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                <Input
                  type="text"
                  placeholder="(Optional)"
                  value={description}
                  name="desc"
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: "95%" }}
                />
              </Descriptions.Item>
              {mockType === RESOURCE_TYPE_LIST.MOCK ? (
                <>
                  <Descriptions.Item label="Method">
                    <AutoComplete
                      style={{ width: "95%" }}
                      options={APP_CONSTANTS.METHOD_TYPE}
                      defaultValue={method}
                      placeholder="Method"
                      onChange={(e) => setMethod(e)}
                      disabled={!newFile}
                      filterOption={(inputValue, option) => {
                        if (option.value) {
                          return option.value.includes(inputValue);
                        }
                      }}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Delay" span={2}>
                    <Input
                      type="text"
                      maxLength={5}
                      controls={false}
                      placeholder="Delay"
                      value={delay}
                      name="delay"
                      onChange={(e) => {
                        handleDelayMock(e.target.value);
                      }}
                      style={{ width: "95%" }}
                      addonAfter="ms"
                    />
                  </Descriptions.Item>
                  {!props.fileDetails.id ? (
                    <Descriptions.Item label="Path" span={3}>
                      <Input
                        addonBefore={method + "/"}
                        type="text"
                        placeholder="path"
                        value={path}
                        name="path"
                        onChange={(e) => setPath(e.target.value)}
                        style={{ width: "95%" }}
                        disabled={!newFile}
                      />
                    </Descriptions.Item>
                  ) : null}
                </>
              ) : null}
              {mockType === RESOURCE_TYPE_LIST.MOCK ? (
                <>
                  <Descriptions.Item label="Status Code" span={1}>
                    <AutoComplete
                      style={{ width: "95%" }}
                      options={APP_CONSTANTS.STATUS_CODE}
                      defaultValue={statusCode}
                      placeholder="Response Code"
                      onChange={(e) => setStatusCode(e)}
                      filterOption={(inputValue, option) => {
                        if (option.value) {
                          return option.value.includes(inputValue);
                        }
                      }}
                    />
                  </Descriptions.Item>
                </>
              ) : null}
              {mockType === RESOURCE_TYPE_LIST.MOCK ? (
                <>
                  <Descriptions.Item label="Content Type" span={2}>
                    <AutoComplete
                      style={{ width: "95%" }}
                      type="text"
                      placeholder="content"
                      defaultValue={contentType}
                      options={APP_CONSTANTS.CONTENT_TYPE}
                      name="type"
                      onChange={(e) => setContentType(e)}
                    />
                  </Descriptions.Item>
                </>
              ) : null}
              {/* Show spinner if undefined */}
              {newFile ? null : props.fileDetails.shortUrl ||
                props.fileDetails.mockID ? (
                <Descriptions.Item label="Public URL">
                  {/* <Tag onClick={() => setIsCopied("Copied")}>
                    <span style={{ cursor: "pointer" }}>
                      <CopyToClipboard text={getPublicMockUrl()}>
                        <Tooltip placement="topLeft" title={isCopied}>
                          Copy URL <CopyOutlined />
                        </Tooltip>
                      </CopyToClipboard>
                    </span>
                  </Tag> */}
                  <Input
                    type="text"
                    style={{ width: "60%" }}
                    value={getPublicMockUrl()}
                    onClick={() => setIsCopied("Copied")}
                    disabled={true}
                    addonAfter={
                      <CopyToClipboard text={getPublicMockUrl()}>
                        <Tooltip title={isCopied}>
                          <CopyOutlined onClick={() => setIsCopied("Copied")} />
                        </Tooltip>
                      </CopyToClipboard>
                    }
                  />
                </Descriptions.Item>
              ) : (
                <div>
                  <Spin />
                </div>
              )}
            </Descriptions>
          </Col>
        </Row>
        <div className="margin-bottom-one" />

        <Row>
          <Col span={24}>
            {contentType.startsWith("image") ? (
              <Row>
                <Col className="text-align-center" span={24} align="center">
                  {<ImageViewer src={props.fileDetails.webContentLink} />}
                </Col>
              </Row>
            ) : (
              <div>
                {mockType === RESOURCE_TYPE_LIST.MOCK ? (
                  <div>
                    <Row className="pl-3">
                      <Col span={24}></Col>
                    </Row>
                    <HeaderValues
                      headers={headers}
                      onHeadersChange={onHeadersChange}
                    />
                  </div>
                ) : null}
                <Row style={{ marginBottom: "0.5rem", marginTop: "0.5rem" }}>
                  <Col span={24}>
                    <h4>
                      {mockType === RESOURCE_TYPE_LIST.MOCK
                        ? "Response Body"
                        : "File Content"}
                    </h4>
                    {isContentLoading === false ? (
                      <AceEditor
                        width="100%"
                        height="200px"
                        placeholder={
                          mockType === RESOURCE_TYPE_LIST.MOCK
                            ? "{\n\t'user': { \n\t\t'id': 'zuAdQ2wsPnIUa', \n\t\t'type': 'admin'\n\t} \n}"
                            : "File Content"
                        }
                        mode={
                          mockType === RESOURCE_TYPE_LIST.JS
                            ? "javascript"
                            : mockType === RESOURCE_TYPE_LIST.CSS
                            ? "css"
                            : mockType === RESOURCE_TYPE_LIST.HTML
                            ? "html"
                            : "text"
                        }
                        theme="monokai"
                        name="body_editor"
                        fontSize={17}
                        readOnly={isEditorReadOnly}
                        showPrintMargin={false}
                        showGutter={true}
                        highlightActiveLine={true}
                        onChange={onBodyChange}
                        value={body || ""}
                        setOptions={{
                          enableBasicAutocompletion: true,
                          enableLiveAutocompletion: true,
                          enableSnippets: true,
                          showLineNumbers: true,
                          tabSize: 2,
                        }}
                        style={{ marginBottom: "0.5rem", marginTop: "0.5rem" }}
                      />
                    ) : (
                      <Col offset={10}>
                        <Spin tip="Loading... File Content"></Spin>
                      </Col>
                    )}
                  </Col>
                </Row>
                {mockType === RESOURCE_TYPE_LIST.MOCK ? (
                  <Row>
                    <Col xl="12">
                      <span className="codemirror-character-count">
                        {responseBodyCharacterLimit - getByteSize(body) >= 0
                          ? responseBodyCharacterLimit - getByteSize(body)
                          : 0}{" "}
                        characters left
                      </span>
                    </Col>
                  </Row>
                ) : null}
              </div>
            )}
          </Col>
        </Row>
        {renderSaveButtonRow({ marginTop: "1rem" })}
      </ProCard>
      {/* MODALS */}
      {isLimitReachedModalActive ? (
        <LimitReachedModal
          isOpen={isLimitReachedModalActive}
          toggle={toggleLimitReachedModal}
          featureName={APP_CONSTANTS.FEATURES.FILES}
          userPlanName={userPlanName}
        />
      ) : null}
    </React.Fragment>
  );
};

export default FileEditor;
