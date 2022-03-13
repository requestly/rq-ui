import React, { useContext, useState } from "react";
import {
  Col,
  Row,
  Space,
  Card,
  Avatar,
  Button,
  Typography,
  Collapse,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "utils/Toast.js";
// SUB COMPONENTS
import CloseConfirmModal from "./ErrorHandling/CloseConfirmModal";
// CONSTANTS
import APP_CONSTANTS from "../../../../../config/constants";
// STORE
import { store } from "../../../../../store";
import { getUpdateDesktopSpecificDetails } from "../../../../../store/action-objects";
// UTILS
import { getDesktopSpecificDetails } from "../../../../../utils/GlobalStoreUtils";
import { ArrowRightOutlined, PoweroffOutlined } from "@ant-design/icons";
import InstructionsModal from "./InstructionsModal";
import { FEATURES } from "config/constants/compatibility";
import { isFeatureCompatible } from "utils/CompatibilityUtils";
import {
  trackAppConnectedEvent,
  trackAppDisconnectedEvent,
  trackAppConnectFailureEvent,
} from "utils/analytics/desktop-app/apps";
import { redirectToTraffic } from "utils/RedirectionUtils";

const { Meta } = Card;
const { Panel } = Collapse;

const Sources = () => {
  // Global State
  const navigate = useNavigate();
  const globalState = useContext(store);
  const { state, dispatch } = globalState;
  const desktopSpecificDetails = getDesktopSpecificDetails(state);
  // Component State
  const [processingApps, setProcessingApps] = useState({});
  const [isCloseConfirmModalActive, setIsCloseConfirmModalActive] = useState(
    false
  );
  const [appIdToCloseConfirm, setAppIdToCloseConfirm] = useState(false);

  const { appsList: appsListObject, proxyPort } = desktopSpecificDetails;

  const appsListArray = Object.values(appsListObject);

  const [currentApp, setCurrentApp] = useState(null);

  const toggleCloseConfirmModal = () => {
    if (isCloseConfirmModalActive) {
      setAppIdToCloseConfirm(false);
      setIsCloseConfirmModalActive(false);
    } else {
      setIsCloseConfirmModalActive(true);
    }
  };

  const handleCloseConfirmContinue = () => {
    if (!appIdToCloseConfirm) return;
    setIsCloseConfirmModalActive(false);
    handleActivateAppOnClick(appIdToCloseConfirm, { closeConfirmed: true });
  };

  const renderInstructionsModal = (appId) => {
    setCurrentApp(appId);
  };

  const handleActivateAppOnClick = (appId, options = {}) => {
    renderInstructionsModal(appId);
    setProcessingApps({ ...processingApps, appId: true });
    // If URL is opened in browser instead of desktop app
    if (!window.RQ || !window.RQ.DESKTOP) return;

    window.RQ.DESKTOP.SERVICES.IPC.invokeEventInBG("activate-app", {
      id: appId,
      proxyPort,
      options: { ...options },
    })
      .then((res) => {
        setProcessingApps({ ...processingApps, appId: false });

        // Notify user and update state
        if (res.success) {
          toast.success(`Connected ${appsListObject[appId].name}`);
          const currentList = { ...appsListObject };
          currentList[appId].isActive = true;
          // Update state with new changes
          dispatch(
            getUpdateDesktopSpecificDetails({
              appsListObject: currentList,
            })
          );
          trackAppConnectedEvent(appsListObject[appId].name);

          // @nsr Redirect to traffic table
          redirectToTraffic(navigate);
        } else if (res.metadata && res.metadata.closeConfirmRequired) {
          setAppIdToCloseConfirm(appId);
          setIsCloseConfirmModalActive(true);
        } else {
          toast.error(
            `Unable to activate ${appsListObject[appId].name}. Issue reported.`
          );
          trackAppConnectFailureEvent(appsListObject[appId].name);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDisconnectAppOnClick = (appId) => {
    setProcessingApps({ ...processingApps, appId: true });
    // If URL is opened in browser instead of dekstop app
    if (!window.RQ || !window.RQ.DESKTOP) return;

    window.RQ.DESKTOP.SERVICES.IPC.invokeEventInBG("deactivate-app", {
      id: appId,
      proxyPort,
    })
      .then((res) => {
        setProcessingApps({ ...processingApps, appId: false });

        // Notify user and update state
        if (res.success) {
          toast.info(`Disconnected ${appsListObject[appId].name}`);
          const currentList = { ...appsListObject };
          currentList[appId].isActive = false;
          // Update state with new changes
          dispatch(
            getUpdateDesktopSpecificDetails({
              appsListObject: currentList,
            })
          );
          trackAppDisconnectedEvent(appsListObject[appId].name);
        } else {
          toast.error(
            `Unable to deactivate ${appsListObject[appId].name}. Issue reported.`
          );
        }
      })
      .catch((err) => console.log(err));
  };

  const renderChangeAppStatusBtn = (
    appId,
    isScanned,
    isActive,
    isAvailable
  ) => {
    if (!isAvailable) {
      return (
        <span className="text-primary cursor-disabled">
          Couldn't find it on your system
        </span>
      );
    } else if (!isActive) {
      return (
        <Button
          type="secondary"
          icon={<ArrowRightOutlined />}
          onClick={() => handleActivateAppOnClick(appId)}
          loading={!isScanned || processingApps[appId]}
        >
          Open
        </Button>
      );
    } else {
      return (
        <Button
          danger
          type="link"
          icon={<PoweroffOutlined />}
          className="btn btn-danger btn-icon btn-3  has-no-box-shadow"
          onClick={() => handleDisconnectAppOnClick(appId)}
        >
          Close
        </Button>
      );
    }
  };

  const renderComingSoonBtn = (appName) => {
    return (
      <span className="text-primary cursor-disabled">
        Support for {appName} is coming soon
      </span>
    );
  };

  const renderInstructionsActionButton = (app) => {
    return (
      <Button
        type="secondary"
        icon={<ArrowRightOutlined />}
        onClick={() => renderInstructionsModal(app.id)}
      >
        Open
      </Button>
    );
  };

  const renderSourceCardActionButton = (app) => {
    if (
      app.id === "android" ||
      (app.id === "existing-terminal" &&
        isFeatureCompatible(FEATURES.DESKTOP_APP_TERMINAL_PROXY))
    ) {
      return renderInstructionsActionButton(app);
    }

    const button = app.comingSoon
      ? renderComingSoonBtn(app.name)
      : renderChangeAppStatusBtn(
          app.id,
          app.isScanned,
          app.isActive,
          app.isAvailable
        );

    return button;
  };

  const renderSourceCard = (app) => {
    return (
      <Card
        key={app.id}
        style={{ width: 270 }}
        actions={[<p>{renderSourceCardActionButton(app)}</p>]}
      >
        <Row>
          <Col flex="auto">
            <Meta
              avatar={
                <Avatar
                  src={
                    window.location.origin +
                    "/assets/img/thirdPartyAppIcons/" +
                    app.icon
                  }
                />
              }
              title={app.name}
              description={app.description}
            />
          </Col>
          <Col>
            {app.isDocAvailable ? (
              <a href={app.isDocAvailable} rel="noreferrer" target="_blank">
                <InfoCircleOutlined />
              </a>
            ) : null}
          </Col>
        </Row>
      </Card>
    );
  };

  const renderSources = () => {
    return (
      <Collapse defaultActiveKey={["1"]}>
        <Panel header="Available" key="1">
          <Space align="start" wrap>
            {renderAvailableSources()}
          </Space>
        </Panel>
        <Panel header="Unavailable" key="2">
          <Space align="start" wrap>
            {renderUnavailableSources()}
          </Space>
        </Panel>
        <Panel header="Coming Soon" key="3">
          <Space align="start" wrap>
            {renderComingSoonSources()}
          </Space>
        </Panel>
      </Collapse>
    );
  };

  const renderAvailableSources = () => {
    // TODO @sahil: Remove this hack. Hack for now for Android
    const availableSources = appsListArray.filter(
      (app) =>
        !app.comingSoon &&
        (app.isAvailable ||
          !app.isScanned ||
          app.id === "android" ||
          (app.id === "existing-terminal" &&
            isFeatureCompatible(FEATURES.DESKTOP_APP_TERMINAL_PROXY)))
    );
    return availableSources.map((app) => {
      return renderSourceCard(app);
    });
  };

  const renderUnavailableSources = () => {
    const unavailableSources = appsListArray.filter(
      (app) =>
        !app.isAvailable &&
        !app.comingSoon &&
        app.id !== "android" &&
        app.id !== "existing-terminal"
    );

    return unavailableSources.map((app) => {
      return renderSourceCard(app);
    });
  };

  const renderComingSoonSources = () => {
    const comingSoonSources = appsListArray.filter((app) => app.comingSoon);

    return comingSoonSources.map((app) => {
      return renderSourceCard(app);
    });
  };

  return (
    <React.Fragment>
      {<InstructionsModal appId={currentApp} setCurrentApp={setCurrentApp} />}
      <Row>
        <Col span={24} align="center">
          <p className="text-center lead">
            Connect your system apps to Requestly. After connecting the required
            app, click <Link to={APP_CONSTANTS.PATHS.RULES.RELATIVE}>here</Link>{" "}
            to setup Rules.
          </p>
        </Col>
      </Row>
      <br />
      <Row>
        <Col span={24} align="center">
          {renderSources()}
        </Col>
      </Row>
      <br />
      <Row>
        <Col span={24} align="center">
          <Typography.Title level={5}>
            Couldn't find required app? To manually set proxy and install
            certificate{" "}
            <Link to={APP_CONSTANTS.PATHS.DESKTOP.MANUAL_SETUP.RELATIVE}>
              <Button type="primary">Click Here</Button>
            </Link>{" "}
          </Typography.Title>
        </Col>
      </Row>
      {/* Modals */}
      {isCloseConfirmModalActive ? (
        <CloseConfirmModal
          isOpen={isCloseConfirmModalActive}
          toggle={toggleCloseConfirmModal}
          action={handleCloseConfirmContinue}
        />
      ) : null}
    </React.Fragment>
  );
};

export default Sources;
