import ProTable from "@ant-design/pro-table";
import { getFunctions, httpsCallable } from "firebase/functions";
import React, { useState } from "react";
//import { getFeatureLimits, getPlanName } from "utils/FeatureManager";
//import { store } from "store";
//import { getUserAuthDetails } from "utils/GlobalStoreUtils";
import { useNavigate } from "react-router-dom";
import APP_CONSTANTS from "config/constants";
import {
  // redirectToCreateNewFile,
  redirectToFileViewer,
  //redirectToPricingPlans,
} from "utils/RedirectionUtils";
import { submitEventUtil, trackRQLastActivity } from "utils/AnalyticsUtils";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import { Typography, Button, Space, Tooltip, Input, Tag } from "antd";
import UploadFileBtn from "../../UploadFileBtn";
import * as FilesService from "../../../../../utils/files/FilesService";
import {
  DeleteOutlined,
  EditOutlined,
  // LoadingOutlined,
  PlusOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import ReactHoverObserver from "react-hover-observer";
import moment from "moment";
import { toast } from "utils/Toast.js";
import CopyToClipboard from "react-copy-to-clipboard";
import { getMockUrl } from "utils/files/urlUtils";
import { trackDeleteFileEvent } from "utils/analytics/mock-server/files/delete_file";
import { trackDeleteMockEvent } from "utils/analytics/mock-server/mocks/delete_mock";
//import { trackRemoveLimitsClickedEvent } from "utils/analytics/business/free-limits/remove_limits_clicked";
import NewMockSelector from "./mockModal";
import { isEmpty } from "lodash";

const { Link, Text } = Typography;

const Search = Input.Search;

const MyFilesView = ({ filesList = {}, updateCollection, mode, callback }) => {
  //Global State
  //const globalState = useContext(store);
  //const { state } = globalState;
  //const user = getUserAuthDetails(state);
  const navigate = useNavigate();

  //Search
  let allMocks = [];
  const [proData, setProData] = useState(allMocks);
  const [search, setSearch] = useState(false);

  const [copiedText, setCopiedText] = useState("");

  //FUNCTION TO GET PLAN FILES LIMIT
  // const getUserPlanFilesLimit = () => {
  //   const planName = getPlanName(user);
  //   const planFilesLimit = getFeatureLimits(
  //     APP_CONSTANTS.FEATURES.FILES,
  //     planName
  //   );
  //   return planFilesLimit;
  // };

  const deleteFile = (fileDetails, callback) => {
    if (!fileDetails.mockID) {
      FilesService.deleteFile(fileDetails).then(() => {
        toast.info("File deleted");
        //ANALYTICS
        submitEventUtil(
          GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.LIBRARY,
          GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.DELETED,
          "file_deleted"
        );
        trackRQLastActivity("file_deleted");
        trackDeleteFileEvent();
        if (callback) callback();
      });
    } else {
      const functions = getFunctions();
      const deleteMock = httpsCallable(functions, "deleteMock");

      deleteMock(fileDetails.mockID).then((res) => {
        if (res.data.success) {
          toast.info("Mock deleted");

          // delete the object from storage
          if (!fileDetails.isMock) {
            FilesService.deleteFileFromStorage(fileDetails.filePath);
          }

          //ANALYTICS
          submitEventUtil(
            GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.LIBRARY,
            GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.DELETED,
            "mock_deleted"
          );
          trackRQLastActivity("mock_deleted");
          trackDeleteMockEvent();
          if (callback) callback();
        } else {
          toast.error("Mock cannot be deleted. Try again.");
        }
      });
    }
  };

  const onCopyHandler = (fileDetails) => {
    setCopiedText(fileDetails.shortUrl || getMockUrl(fileDetails.mockID));
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "30%",
      textWrap: "word-break",
      ellipsis: true,
      render: (_, record) => {
        return (
          <Link onClick={(e) => redirectToFileViewer(navigate, record.id)}>
            {_}
          </Link>
        );
      },
    },

    {
      title: "Mock Type",
      dataIndex: "contentType",
      align: "center",
      // width: "15%",
      render: (_, record) => {
        const { extension, color } = FilesService.getMockType(record);
        return (
          <span>
            <Tag color={color}>{extension}</Tag>
          </span>
        );
      },
    },

    {
      title: "Last Modified",
      align: "center",
      responsive: ["md"],
      valueType: "date",
      render: (_, record) => {
        const dateToDisplay = record.modifiedTime
          ? record.modifiedTime
          : record.creationDate
          ? record.creationDate
          : record.modificationDate;

        if (!dateToDisplay) return "-";

        return moment(dateToDisplay).format("MMM DD, YYYY");
      },
    },

    {
      title: "Actions",
      align: "right",
      // width: "10%",
      responsive: ["sm"],
      render: (_, record) => {
        if (mode === APP_CONSTANTS.FILES_TABLE_CONSTANTS.MODES.FILE_PICKER) {
          return (
            <Button
              size="small"
              type="secondary"
              onClick={() => callback(record.shortUrl)}
            >
              Insert
            </Button>
          );
        }
        return (
          <ReactHoverObserver>
            {({ isHovering }) => (
              <Space>
                {/* <Text
                  type={isHovering ? "primary" : "secondary"}
                  style={{ cursor: "pointer" }}
                >
                  <CopyToClipboard
                    text={record.shortUrl}
                    onCopy={() => onCopyHandler(record)}
                  >
                    <Tooltip
                      title={
                        copiedText === record.shortUrl
                          ? "Copied"
                          : "Copy Public URL"
                      }
                    >
                      <CopyOutlined />
                    </Tooltip>
                  </CopyToClipboard>
                </Text> */}
                {/* <Text
                  type={isHovering ? "primary" : "secondary"}
                  style={{ cursor: "pointer" }}
                >
                  <Tooltip title="Edit">
                    <EditOutlined
                      onClick={(e) =>
                        redirectToFileViewer(
                          navigate,
                          record.id || record.mockID
                        )
                      }
                    />
                  </Tooltip>
                </Text>
                <Text
                  type={isHovering ? "primary" : "secondary"}
                  style={{ cursor: "pointer" }}
                >
                  <Tooltip title="Delete File">
                    <DeleteOutlined
                      onClick={() => {
                        deleteFile(record, updateCollection);
                        toast.loading("Deleting Mock");
                      }}
                    />
                  </Tooltip>
                </Text> */}
                <Tooltip title="Edit">
                  <Button
                    size="small"
                    type="secondary"
                    icon={<EditOutlined />}
                    onClick={(e) =>
                      redirectToFileViewer(navigate, record.id || record.mockID)
                    }
                  ></Button>
                </Tooltip>
                <Tooltip title="Delete">
                  <Button
                    size="small"
                    type="secondary"
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      deleteFile(record, updateCollection);
                      toast.loading("Deleting Mock");
                    }}
                  ></Button>
                </Tooltip>
              </Space>
            )}
          </ReactHoverObserver>
        );
      },
    },
  ];

  const getFinalColumns = () => {
    if (mode !== APP_CONSTANTS.FILES_TABLE_CONSTANTS.MODES.FILE_PICKER) {
      columns.splice(3, 0, {
        title: "Copy Public URL",
        align: "center",
        // width: "15%",
        textWrap: "word-break",
        ellipsis: true,
        className: "fit-text-content",
        render: (_, record) => {
          return (
            <span style={{ cursor: "pointer" }}>
              <CopyToClipboard
                text={record.shortUrl || getMockUrl(record.mockID)}
                onCopy={() => onCopyHandler(record)}
              >
                <Tooltip
                  placement="topLeft"
                  title={
                    copiedText ===
                    (record.shortUrl || getMockUrl(record.mockID))
                      ? "Copied"
                      : "Click to Copy"
                  }
                  // color="#0a48b3"
                >
                  <CopyOutlined />
                </Tooltip>
              </CopyToClipboard>
            </span>
          );
        },
      });
    }
    return columns;
  };

  //SUBMIT ATTRIBUTE ON FIREBASE DB TO TRACK ONBOARDING
  // useEffect(() => {
  //   if (Object.keys(filesList).length > 0) {
  //     submitAttrUtil("isHostFileTask", true);
  //   }
  // }, [filesList]);

  const getMocksToShow = () => {
    if (!filesList || isEmpty(filesList)) return [];
    allMocks = Object.values(filesList);

    // Let's make mockID our id (primary key)
    return allMocks.map((object) => {
      if (!object.id) object.id = object.mockID;
      return object;
    });
  };

  const handleSearch = (searchText) => {
    let flag = 0;
    if (searchText !== "") {
      for (let i = 0; i < proData.length; i++) {
        if (proData[i].name.toLowerCase().includes(searchText.toLowerCase())) {
          setProData([proData[i]]);
          flag = 1;
          setSearch(true);
          break;
        }
      }
      if (flag === 0) {
        toast.error("No Mock found with given name");
      }
    }
  };

  const handleDataChange = (e) => {
    setProData(allMocks);
    setSearch(false);
  };

  const [
    isNewRuleSelectorModalActive,
    setIsNewRuleSelectorModalActive,
  ] = useState(false);

  const toggleNewRuleSelectorModal = () => {
    setIsNewRuleSelectorModalActive(
      isNewRuleSelectorModalActive ? false : true
    );
  };

  return (
    <React.Fragment>
      <ProTable
        rowKey="id"
        headerTitle={
          <>
            Manage Mocks (JS/HTML/CSS){" "}
            <Search
              placeholder="Enter File Name"
              onChange={(e) => {
                handleDataChange(e);
              }}
              onSearch={(e) => {
                handleSearch(e);
              }}
              style={{ width: 200, marginLeft: "10px" }}
            />
            {/* {getPlanName(user) === "bronze"
              ? `(${
                  Object.keys(filesList).length
                }/${getUserPlanFilesLimit()} Mocks Used)`
              : null}
            {getPlanName(user) === "bronze" ? (
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  redirectToPricingPlans(navigate);

                  //Analytics
                  submitEventUtil(
                    GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.FILES,
                    GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.REMOVE_LIMIT_CLICKED,
                    "remove.limit.clicked@files.page",
                    Object.keys(filesList).length
                  );
                  trackRQLastActivity("Remove Limits Clicked");
                  trackRemoveLimitsClickedEvent();
                }}
                style={{ marginLeft: "1rem" }}
              >
                Remove Limits
              </Link>
            ) : null} */}
          </>
        }
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => setIsNewRuleSelectorModalActive(true)}
            icon={<PlusOutlined />}
          >
            Create New Mock
          </Button>,
          <UploadFileBtn
            updateCollection={updateCollection}
            currentFilesCount={Object.keys(filesList).length}
            buttonType="secondary"
          />,
        ]}
        options={false}
        pagination={false}
        search={false}
        dateFormatter={false}
        columns={getFinalColumns()}
        dataSource={search ? proData : getMocksToShow()}
      />
      {isNewRuleSelectorModalActive ? (
        <NewMockSelector
          isOpen={isNewRuleSelectorModalActive}
          toggle={toggleNewRuleSelectorModal}
          currentMocksCount={getMocksToShow().length}
        />
      ) : null}
    </React.Fragment>
  );
};
export default MyFilesView;
