import React, { useEffect, useState, useContext, useCallback } from "react";
import { Button, Col, Input, Row, Tooltip } from "antd";
import { Modal } from "antd";
import CopyToClipboard from "react-copy-to-clipboard";
import CreatableReactSelect from "react-select/creatable";
import { MailOutlined, EditFilled } from "@ant-design/icons";
import { toast } from "utils/Toast.js";
//SUB COMPONENTS
import SpinnerColumn from "../../../misc/SpinnerColumn";
import EditableTable from "./editableTable";
//UTILS
import * as GlobalStoreUtils from "../../../../utils/GlobalStoreUtils";
import {
  submitAttrUtil,
  submitEventUtil,
  trackRQLastActivity,
} from "../../../../utils/AnalyticsUtils";
//ICONS
import { AiOutlineWarning } from "react-icons/ai";
//STORE
import { store } from "../../../../store";
//ACTIONS
import { createSharedList, editSharedList } from "./actions";
// import { unselectAllRules } from "../../rules/actions";
// firebase
import { getFunctions, httpsCallable } from "firebase/functions";
import { doc, getFirestore, getDoc } from "firebase/firestore";
//GLOBAL_CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import { CopyOutlined } from "@ant-design/icons";
import firebaseApp from "../../../../firebase";
import {
  trackSharedListCreatedEvent,
  trackSharedListWorkflowStartedEvent,
} from "../../../../utils/analytics/sharedList";

const CreateSharedListModal = (props) => {
  const { toggle: toggleModal, isOpen, rulesToShare } = props;
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  // const rulesToPopulate = GlobalStoreUtils.getRulesToPopulate(state);
  const groupwiseRulesToPopulate = GlobalStoreUtils.getGroupwiseRulesToPopulate(
    state
  );
  const user = GlobalStoreUtils.getUserAuthDetails(state);
  const appMode = GlobalStoreUtils.getAppMode(state);
  //Component State
  const [createSharedListConfirmed, setCreateSharedListConfirmed] = useState(
    false
  );
  const [createSharedListDone, setCreateSharedListDone] = useState(false);
  const [sharedListName, setSharedListName] = useState(() => {
    const firstName = user.details.profile.displayName.split(" ")[0];
    const date = new Date().toLocaleDateString().split("/").join("-");
    const finalName = firstName + "-shared-list-" + date;
    return finalName;
  });
  const [sharedListPublicURL, setSharedListPublicURL] = useState("");
  const [copiedText, setCopiedText] = useState("");
  const [sharedListRecipients, setSharedListRecipients] = useState([]);
  const [sharedListData, setSharedListData] = useState("");
  const [notifySpinner, setNotifySpinner] = useState(false);
  const [options, setOptions] = useState([]);
  const [createdSharedListId, setCreatedSharedListId] = useState(null);
  const rulesCount = rulesToShare.length;
  var modalTriggerPage,
    modalTriggerSource = "";
  if (window.location.pathname.includes("my-rules")) {
    modalTriggerSource = "toolbar";
    modalTriggerPage = "rules_index";
  } else {
    modalTriggerSource = "bottom_link";
    modalTriggerPage = "editor";
  }

  const nameColumns = [
    {
      title: "Row Header",
      dataIndex: "RowHeader",
      width: "40",
      render: (data) => <b>{data}</b>,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: "70%",
      editable: true,
      render: (data) => (
        <>
          {data}&nbsp;&nbsp;&nbsp;&nbsp;
          <Tooltip title="Edit Shared List Name">
            <EditFilled style={{ color: "#0095ff" }} />
          </Tooltip>
        </>
      ),
    },
  ];
  const urlColumns = [
    {
      title: "Row Header",
      dataIndex: "RowHeader",
      width: "auto",
      render: (data) => <b>{data}</b>,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: "auto",
      editable: false,
      render: (data) => {
        return (
          <Input
            value={sharedListPublicURL}
            disabled={true}
            addonAfter={
              <CopyURLSection
                url={sharedListPublicURL}
                onCopyHandler={onCopyHandler}
              />
            }
          />
        );
      },
    },
  ];
  const [nameDataSource, setNameDataSource] = useState([
    {
      key: "0",
      RowHeader: "List Name",
      name: sharedListName,
    },
  ]);
  const [urlDataSource] = useState([
    {
      key: "0",
      RowHeader: "Public URL",
      name: "sharedlistname",
    },
  ]);

  useEffect(() => {
    const newName = nameDataSource[0].name;
    const newUrl = GLOBAL_CONSTANTS.getSharedListURL(
      createdSharedListId,
      newName
    );
    setSharedListName((prevName) => {
      if (prevName !== newName) {
        editSharedList(createdSharedListId, user.details.profile.uid, newName)
          .then((res) => toast.success("Name Changed Successfully"))
          .catch((err) => toast.error("Something Went Wrong"));
      }
      return newName;
    });
    setSharedListPublicURL(newUrl);
  }, [createdSharedListId, nameDataSource, user.details.profile.uid]);

  const onCopyHandler = () => {
    //Analytics
    submitEventUtil(
      GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.SHARED_LIST,
      GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.COPIED,
      "sharedList_url_copied"
    );
    trackRQLastActivity("sharedList_url_copied");
    setCopiedText(sharedListPublicURL);
  };

  const renderLoader = () => (
    <SpinnerColumn customLoadingMessage="Creating List" />
  );

  const confirmSharedList = useCallback(() => {
    if (sharedListName === "") {
      toast.warn("Provide a shared list name");
      // setSharedListName((prevValue) => console.log(prevValue));
      // Untitled Shared List
    } else {
      setCreateSharedListConfirmed(true);
    }
  }, [sharedListName]);

  const renderModalFooter = (options) => {
    const { showConfirmationBtn } = options;
    return (
      <div
        className="modal-footer "
        style={{
          // backgroundColor: "white",
          pointerEvents: "none",
          position: "sticky",
          bottom: "0",
          zIndex: "100",
        }}
      >
        {showConfirmationBtn ? (
          <>
            <br />
            <Button
              style={{ pointerEvents: "all" }}
              color="primary"
              data-dismiss="modal"
              type="primary"
              onClick={() => confirmSharedList()}
            >
              Skip
            </Button>
            &nbsp;&nbsp;
            <Button
              style={{ pointerEvents: "all" }}
              color="primary"
              data-dismiss="modal"
              type="primary"
              onClick={() => confirmSharedList()}
            >
              Create
            </Button>
          </>
        ) : null}
      </div>
    );
  };

  const shareSharedList = () => {
    //Analytics
    submitEventUtil(
      GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.SHARED_LIST,
      GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.CLICKED,
      "sharedList_notify_button_clicked"
    );
    trackRQLastActivity("sharedList_notify_button_clicked");
    setNotifySpinner(true);
    const functions = getFunctions();
    const sendShareListUrlAsEmailToShare = httpsCallable(
      functions,
      "sendShareListUrlAsEmailToShare"
    );

    sendShareListUrlAsEmailToShare({
      sharedListData: sharedListData,
      recipientEmails: sharedListRecipients,
    })
      .then(async (res) => {
        const response = res.data;
        if (response.success) {
          toast.success("We've notified them");
          setOptions([...options, ...response.emails]);
          toggleModal();
        } else {
          setNotifySpinner(false);
          toast.error("Opps! Check the email and try again");
        }
        //Analytics
        submitEventUtil(
          GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.SHARED_LIST,
          GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.SHARED,
          "Notification Sent To people"
        );
      })
      .catch((err) => {
        toast.error("Opps! Couldn't send the notification");
        toggleModal();
      });
  };

  const CopyURLSection = ({ url, onCopyHandler }) => {
    return (
      <span style={{ cursor: "pointer" }}>
        <CopyToClipboard text={url} onCopy={onCopyHandler}>
          <span>
            {copiedText === sharedListPublicURL ? (
              "Copied!"
            ) : (
              <>
                <span>Copy</span> <CopyOutlined style={{ marginLeft: "1%" }} />
              </>
            )}
          </span>
        </CopyToClipboard>
      </span>
    );
  };

  const renderCreationSummary = () => {
    return (
      <React.Fragment>
        <Row>
          <Col span={24}>
            <p>
              You can share this list with other users and they will be able to
              import these rules.
            </p>
            <EditableTable
              dataSource={nameDataSource}
              columns={nameColumns}
              setDataSource={setNameDataSource}
            />
            <EditableTable
              dataSource={urlDataSource}
              columns={urlColumns}
              // setDataSource={setDataSource}
            />
            <br />
            {renderModalFooter({
              showConfirmationBtn: false,
              showNotifyBtn: true,
            })}
            <p className="m-3">Send link via email (optional)</p>
          </Col>
        </Row>
        <Row
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Col align="center" span={18}>
            <CreatableReactSelect
              isMulti={true}
              options={options}
              onChange={(ev) => {
                const emails = ev ? ev.map((email) => email.value.trim()) : [];
                setSharedListRecipients(emails);
              }}
              className="flex-grow-1 has-dark-text border-0"
            />
          </Col>
          <Col span={6} align="center">
            <Button
              data-dismiss="modal"
              type="secondary"
              onClick={shareSharedList}
              disabled={!sharedListRecipients}
              loading={notifySpinner}
              icon={<MailOutlined />}
            >
              Notify
            </Button>
          </Col>
        </Row>
      </React.Fragment>
    );
  };

  const renderWarningMessage = () => (
    <React.Fragment>
      <Row style={{ textAlign: "center" }}>
        <Col span={24}>
          <h1 className="display-2">
            <AiOutlineWarning />
          </h1>
          <h4>Please select a rule before sharing</h4>
          <br />
          <h4>Confused? See how this works!</h4>
          <iframe
            width="100%"
            height="300"
            src="https://www.youtube.com/embed/BM7kTFy-vdc"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </Col>
      </Row>

      {renderModalFooter({
        showConfirmationBtn: false,
        showNotifyBtn: false,
      })}
    </React.Fragment>
  );

  const postCreationSteps = (
    sharedListId,
    sharedListName,
    sharedListData,
    rulesCount,
    modalTriggerPage,
    modalTriggerSource
  ) => {
    const publicUrlOfList = GLOBAL_CONSTANTS.getSharedListURL(
      sharedListId,
      sharedListName
    );
    setCreatedSharedListId(sharedListId);
    setSharedListPublicURL(publicUrlOfList);
    setSharedListData(sharedListData);
    setCreateSharedListDone(true);
    //Analytics
    submitEventUtil(
      GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.SHARED_LIST,
      GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.CREATED,
      "sharedList_created "
    );
    trackRQLastActivity("sharedList_created");
    trackSharedListCreatedEvent(
      rulesCount,
      modalTriggerSource,
      modalTriggerPage
    );
  };

  const stablePostCreationSteps = useCallback(postCreationSteps, []);

  // populating options for invites
  const fetchOptions = async (uid) => {
    const db = getFirestore(firebaseApp);
    const userQuery = doc(db, `sharedListEmails/${uid}`);
    const docSnap = await getDoc(userQuery);
    if (docSnap.exists()) {
      const { emails } = docSnap.data();

      const updatedOptions = emails.map((email) => ({
        value: email,
        label: email,
      }));
      setOptions(updatedOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    const populateOptions = async () => {
      await fetchOptions(user.details.profile.uid);
    };

    populateOptions();
  }, [user.details.profile.uid]);

  useEffect(() => {
    if (rulesCount !== 0) {
      confirmSharedList();
    }
  }, [confirmSharedList, rulesCount]);

  //adding enter shortcut for creating new rule
  //eslint-disable-next-line
  const enterFn = (event) => {
    if (event.keyCode === 13) confirmSharedList();
  };

  useEffect(() => {
    if (createSharedListConfirmed && !createSharedListDone) {
      createSharedList(
        appMode,
        rulesToShare,
        sharedListName,
        groupwiseRulesToPopulate,
        user.details.profile.uid
      ).then(({ sharedListId, sharedListName, sharedListData }) => {
        stablePostCreationSteps(
          sharedListId,
          sharedListName,
          sharedListData,
          rulesCount,
          modalTriggerPage,
          modalTriggerSource
        );
      });
    }
    //Submitting attribute on base for onboarding
    submitAttrUtil("iscreatesharedlisttask", true);
  }, [
    createSharedListConfirmed,
    createSharedListDone,
    rulesToShare,
    sharedListName,
    groupwiseRulesToPopulate,
    user.details.profile.uid,
    stablePostCreationSteps,
    appMode,
    rulesCount,
    modalTriggerPage,
    modalTriggerSource,
  ]);

  useEffect(() => {
    //Escape shortcut
    document.addEventListener("keydown", enterFn);
    //Analytics
    submitEventUtil(
      GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.SHARED_LIST,
      GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.WORKFLOW_STARTED,
      "sharedList_creation_workflow_started"
    );
    trackRQLastActivity("sharedList_creation_workflow_started");
    trackSharedListWorkflowStartedEvent(
      rulesCount,
      modalTriggerSource,
      modalTriggerPage
    );
    return () => {
      document.removeEventListener("keydown", enterFn);
    };
  }, [enterFn, rulesCount, modalTriggerSource, modalTriggerPage]);

  return (
    <Modal
      className="modal-dialog-centered "
      visible={isOpen}
      onCancel={toggleModal}
      footer={null}
      title="Share with others"
    >
      {rulesToShare.length === 0
        ? renderWarningMessage()
        : createSharedListConfirmed
        ? renderCreationSummary()
        : renderLoader()}
    </Modal>
  );
};

export default CreateSharedListModal;
