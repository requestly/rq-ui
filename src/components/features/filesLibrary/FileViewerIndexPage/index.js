import React, { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "antd";
import { toast } from "utils/Toast.js";
import { store } from "../../../../store";
import isEmpty from "is-empty";
//SUB COMPONENTS
import SpinnerColumn from "../../../misc/SpinnerColumn";
import FileEditor from "../FileEditor";
//ACTIONS
import { getFileIdFromURL, getMockDetailsFromDatabase } from "./actions";
import { getFunctions, httpsCallable } from "firebase/functions";
import { fetchUserMocks } from "../FilesLibraryIndexPage/actions";
//UTILS
import * as GlobalStoreUtils from "../../../../utils/GlobalStoreUtils";
import * as FilesService from "../../../../utils/files/FilesService";
import {
  redirectTo403,
  redirectTo404,
  redirectToFileViewer,
} from "../../../../utils/RedirectionUtils";
import {
  submitEventUtil,
  trackRQLastActivity,
} from "../../../../utils/AnalyticsUtils";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import ProCard from "@ant-design/pro-card";
import { getByteSize } from "../../../../utils/FormattingHelper";
import APP_CONSTANTS from "../../../../config/constants";
import { trackUpdateFileEvent } from "utils/analytics/mock-server/files/update_file";
import { trackUpdateMockEvent } from "utils/analytics/mock-server/mocks/update_mock";
import { trackCreateFileEvent } from "utils/analytics/mock-server/files/create_file";
import { trackCreateMockEvent } from "utils/analytics/mock-server/mocks/create_mock";

const TRACKING = GLOBAL_CONSTANTS.GA_EVENTS;

const FileViewerIndexPage = () => {
  const navigate = useNavigate();
  //const mockURL = window.location.pathname.includes("API") ? true : false;
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const user = GlobalStoreUtils.getUserAuthDetails(state);

  //Component State
  const [isFileContentLoading, setIsFileContentLoading] = useState(true);
  const [isFileSaving, setIsFileSaving] = useState(false);
  const [fileDetails, setFileDetails] = useState(false);
  const [createNewFile, setCreateNewFile] = useState(false);
  const [currentFilesCount, setCurrentFilesCount] = useState(0);

  const fileId = getFileIdFromURL(window.location.pathname);
  const fetchData = async (uid) => {
    if (fileId === "create") {
      setCreateNewFile(true);
      setIsFileContentLoading(false);
    } else {
      await getMockDetailsFromDatabase(fileId).then((mockData) => {
        if (mockData.success) {
          setFileDetails(mockData.data);
          setIsFileContentLoading(false);
        } else if (mockData.unauthorized) {
          redirectTo403(navigate);
        } else {
          redirectTo404(navigate);
        }
      });
    }
    //Fetch & update number of current files to apply license based limits
    // Not required as files will be moved to firestore with mocks after migration
    // fetchFiles(uid).then((result) => {
    //   console.log("result",result)
    //   console.log("fetchFiles count ",Object.keys(result).length)
    //   if (result) setCurrentFilesCount(Object.keys(result).length);
    // });
    fetchUserMocks().then((result) => {
      if (result) setCurrentFilesCount(result.length);
    });
  };
  const stableFetchData = useCallback(fetchData, [fileId, navigate]);

  const saveFile = (fileDataReceived) => {
    const functions = getFunctions();
    const editMock = httpsCallable(functions, "editMock");
    const {
      name,
      contentType,
      description,
      body,
      headers,
      statusCode,
      isMock,
      method,
      path,
      delay,
      mockVersion,
    } = fileDataReceived;
    editMock({ ...fileDataReceived, id: fileId });
    if (isMock && isEmpty(statusCode)) {
      toast.warn("Please enter statusCode");
      return;
    }
    if (!isMock && isEmpty(body) && contentType !== " image") {
      toast.warn("Please enter file content");
      return;
    }
    if (headers) {
      try {
        JSON.parse(headers);
      } catch {
        toast.warn("Headers must be a JSON object");
        return;
      }
    }
    if (
      isMock &&
      getByteSize(body) > APP_CONSTANTS.MOCK_RESPONSE_BODY_CHARACTER_LIMIT
    ) {
      toast.warn("Response Body exceeds character limit");
      return;
    }
    setIsFileSaving(true);
    // Ignore name type in updating data

    // update new data
    let fileDetailsCopy = { ...fileDetails };
    fileDetailsCopy.description = description;
    const headersFormatted = headers;

    const fileData = {
      name,
      contentType,
      description,
      headers: JSON.parse(headersFormatted), // TODO: fix bug: not always a object is sent to backend. Currently the case is temporarily handled in editMock cloud function
      statusCode: Number(statusCode),
      body,
      isMock,
      method,
      path,
      delay,
      mockVersion,
    };
    if (!isMock) {
      FilesService.updateFile(fileDetails.filePath, body, fileDetailsCopy).then(
        (result) => {
          setIsFileSaving(false);
          if (result.success) {
            toast.info("File Edited Successfully");
            submitEventUtil(
              TRACKING.CATEGORIES.LIBRARY,
              GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.MODIFIED,
              `file_edited`
            );
            trackRQLastActivity("file_edited");
            trackUpdateFileEvent();
            redirectToFileViewer(navigate, fileId);
          } else {
            toast.error("Unable to edit file");
          }
        }
      );
    } else {
      const functions = getFunctions();
      const editMock = httpsCallable(functions, "editMock");
      editMock({ ...fileData, id: fileId }).then((res) => {
        setIsFileSaving(false);
        if (res.data.success) {
          toast.info("Mock Edited Successfully");
          submitEventUtil(
            TRACKING.CATEGORIES.LIBRARY,
            GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.MODIFIED,
            `mock_updated`
          );
          trackRQLastActivity("mock_updated");
          trackUpdateMockEvent();
          redirectToFileViewer(navigate, fileId);
        } else {
          toast.error(res.data.msg || "Unable to edit mock");
        }
      });
    }
  };
  // Save file for creating new files
  const saveNewFile = (fileDataReceived) => {
    const {
      name,
      contentType,
      description,
      body,
      headers,
      statusCode,
      extension,
      isMock,
      method,
      path,
      delay,
      mockVersion,
    } = fileDataReceived;
    if (isEmpty(name)) {
      toast.warn("Please enter a valid file name");
      return;
    }
    if (isMock && isEmpty(statusCode)) {
      toast.warn("Please enter statusCode");
      return;
    }
    if (!isMock && isEmpty(body) && contentType !== "image") {
      toast.warn("Please enter file content");
      return;
    }
    if (headers) {
      try {
        JSON.parse(headers);
      } catch {
        toast.warn("Headers must be a JSON object");
        return;
      }
    }
    if (
      isMock &&
      getByteSize(body) > APP_CONSTANTS.MOCK_RESPONSE_BODY_CHARACTER_LIMIT
    ) {
      toast.warn("Response Body exceeds character limit");
      return;
    }
    if (mockVersion === "v2" && path !== "" && !path) {
      toast.warn("Path cannot be empty");
      return;
    }
    setIsFileSaving(true);
    const headersFormatted = headers;

    const fullName = name + extension;
    const fileData = {
      name: isMock ? name : fullName,
      contentType,
      description,
      headers: JSON.parse(headersFormatted),
      statusCode: Number(statusCode),
      body,
      isMock,
      method,
      path,
      delay,
      mockVersion,
    };

    if (!isMock) {
      FilesService.createFile(fileData, body).then((result) => {
        setIsFileSaving(false);
        if (result.success) {
          toast.info("File Created Successfully");
          submitEventUtil(
            TRACKING.CATEGORIES.LIBRARY,
            TRACKING.ACTIONS.CREATED,
            `file_created`
          );
          trackRQLastActivity("file_created");
          trackCreateFileEvent();
          redirectToFileViewer(navigate, result.data.id, result.data.shortUrl);
        } else {
          toast.error("Unable to create file");
        }
      });
    } else {
      const functions = getFunctions();
      const addMock = httpsCallable(functions, "addMock");
      const pathFormat = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
      if (path === "") {
        toast.warn("Path cannot be empty");
        setIsFileSaving(false);
        return;
      }
      if (pathFormat.test(path)) {
        toast.warn("Path should not contain any special character");
        setIsFileSaving(false);
        return;
      }
      if (!method) {
        fileData.method = "GET";
      }
      addMock(fileData).then((res) => {
        setIsFileSaving(false);
        if (res.data && !res.data.err) {
          toast.info("Mock Created Successfully");
          submitEventUtil(
            TRACKING.CATEGORIES.LIBRARY,
            TRACKING.ACTIONS.CREATED,
            `mock_created`
          );
          trackRQLastActivity("mock_created");
          trackCreateMockEvent();
          redirectToFileViewer(navigate, res.data);
        } else {
          toast.error(res.data.err || "Unable to create Mock");
        }
      });
    }
  };

  useEffect(() => {
    if (
      user.loggedIn &&
      user.details &&
      user.details.profile &&
      user.details.profile.uid
    )
      stableFetchData(user.details.profile.uid);
  }, [stableFetchData, user]);

  useEffect(() => {
    if (fileDetails) {
      setCreateNewFile(false);
    }
  }, [fileDetails]);
  return (
    <ProCard
      className="primary-card github-like-border"
      title={`${
        createNewFile
          ? "Create Mock"
          : fileDetails && !fileDetails.hasOwnProperty("body")
          ? "Mock (Preview Only)"
          : "Edit Mock"
      }`}
    >
      <Row>
        <Col span={24}>
          {isFileContentLoading ? (
            <SpinnerColumn />
          ) : createNewFile ? (
            <FileEditor
              newFile={true}
              fileDetails={fileDetails}
              saveFile={saveNewFile}
              saving={isFileSaving}
              currentFilesCount={currentFilesCount}
            />
          ) : (
            <FileEditor
              fileDetails={fileDetails}
              saveFile={saveFile}
              saving={isFileSaving}
              currentFilesCount={currentFilesCount}
            />
          )}
        </Col>
      </Row>
    </ProCard>
  );
};

export default FileViewerIndexPage;
