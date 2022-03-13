import { useContext, useState, useEffect } from "react";
import { store } from "../../../../../store";
import { Popover, Button, Space, Col } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { getUserAuthDetails, getAppMode } from "utils/GlobalStoreUtils";
import { setIsBackupEnabled } from "utils/BackupUtils";
import LimitReachedModal from "components/user/LimitReachedModal";
import APP_CONSTANTS from "config/constants";
import { MdCloudOff } from "react-icons/md";
import { getToggleActiveModalActionObject } from "store/action-objects";
import { IoCloudDoneOutline } from "react-icons/io5";
import { redirectToBackups } from "utils/RedirectionUtils";
import { useNavigate } from "react-router-dom";
import { isFeatureEnabled } from "../../../../../utils/FeatureManager";
import { createBackupIfRequired } from "utils/BackupUtils";
const RulesBackupToggle = () => {
  const navigate = useNavigate();
  // Global State
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const user = getUserAuthDetails(state);
  const appMode = getAppMode(state);
  // Component State
  const [
    isBackupStatusChangeProcessing,
    setIsBackupStatusChangeProcessing,
  ] = useState(false);

  // Premium Check
  const isPremiumUser = user?.details?.isPremium;
  // fetch planName from global state
  const planName =
    user.details?.planDetails?.planName ||
    APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE;

  // State
  const [isLimitReachedModalActive, setIsLimitReachedModalActive] = useState(
    false
  );
  const [
    limitReachedModalFeatureName,
    setLimitReachedModalFeatureName,
  ] = useState(false);

  const toggleLimitReachedModal = () => {
    setIsLimitReachedModalActive(isLimitReachedModalActive ? false : true);
  };

  const promptUserToUpgrade = () => {
    if (!isPremiumUser) {
      //Update state to reflect changes in modal
      setLimitReachedModalFeatureName(APP_CONSTANTS.FEATURES.BACKUP_RULES);
      //Activate modal to notify user to upgrade
      setIsLimitReachedModalActive(true);
    }
  };

  const changeIsBackupEnabled = async (state) => {
    // If user is not logged in
    if (!user.loggedIn || !user.details || !user.details.profile) {
      // Prompt user to log in
      dispatch(
        getToggleActiveModalActionObject("authModal", true, {
          redirectURL: window.location.href,
        })
      );
      return;
    }

    const proceedChangingStatus = async () => {
      setIsBackupStatusChangeProcessing(true);

      const updatedUser = { ...user };
      updatedUser.details.isBackupEnabled = !user.details.isBackupEnabled;

      await setIsBackupEnabled(user.details.profile.uid, state);
      // if (success) {
      // refreshUserInGlobalState(dispatch);
      // }
      // Wait a sec for state to get updated
      // setTimeout(() => {
      setIsBackupStatusChangeProcessing(false);
      // }, 2000);
    };

    // If user is logged in

    // If premium user - allow
    if (isPremiumUser) {
      proceedChangingStatus();
      return;
    }
    // If non-premium user, prompt to upgrade
    else {
      promptUserToUpgrade();
      return;
    }
  };

  const offerToTurnOnBackups = () => {
    return (
      <div style={{ maxWidth: "350px" }}>
        <p>
          Securely backup your Rules to Requestly servers so that you don't ever
          lose them while switching devices.
        </p>

        <Space>
          <Button
            type="primary"
            onClick={() => changeIsBackupEnabled(true)}
            loading={isBackupStatusChangeProcessing}
            icon={<RightOutlined />}
          >
            Turn on backups
          </Button>
          {!user.loggedIn || !user.details || !user.details.profile ? null : (
            <Button
              type="secondary"
              onClick={() => redirectToBackups(navigate)}
            >
              View previous backups
            </Button>
          )}
        </Space>
      </div>
    );
  };

  const offerToTurnOffBackups = () => {
    return (
      <div style={{ maxWidth: "300px" }}>
        <p>
          Securely backup your Rules to Requestly servers so that you don't ever
          lose them while switching devices.
        </p>
        <Space>
          <Button
            type="primary"
            onClick={() => changeIsBackupEnabled(false)}
            loading={isBackupStatusChangeProcessing}
          >
            Turn off backups
          </Button>
          {!user.loggedIn || !user.details || !user.details.profile ? null : (
            <Button
              onClick={() => redirectToBackups(navigate)}
              type="secondary"
            >
              Existing Backups
            </Button>
          )}
        </Space>
      </div>
    );
  };

  const getPopoverContent = () => {
    // If user is not logged in
    if (!user.loggedIn || !user.details || !user.details.profile) {
      return offerToTurnOnBackups();
    }

    if (
      (user.details.profile || user.details || user.loggedIn) &&
      isPremiumUser
    ) {
      // Premium User - Has Backup Enabled
      if (user.details.isBackupEnabled) {
        return offerToTurnOffBackups();
      }
      // Premium User - Backup NOT Enabled
      else {
        return offerToTurnOnBackups();
      }
    }

    if (
      (user.details.profile || user.details || user.loggedIn) &&
      !isPremiumUser
    ) {
      // Non Premium User - Has Backup Enabled (implementation TBD)
      if (user.details.isBackupEnabled) {
        return offerToTurnOffBackups();
      } else {
        // Non - Premium User - Backup NOT Enabled
        return offerToTurnOnBackups();
      }
    }
  };

  useEffect(() => {
    if (
      user?.loggedIn &&
      user?.details?.isPremium &&
      user?.details?.isBackupEnabled
    ) {
      createBackupIfRequired(appMode);
    }
  }, [appMode, user]);

  const BackupIcon = () => {
    // If user is not logged in
    if (!user.loggedIn || !user.details || !user.details.profile) {
      return (
        <Col className="hp-d-flex-center hp-mr-sm-12 ">
          <Button
            type="text"
            icon={
              <Popover
                content={getPopoverContent()}
                placement="bottomRight"
                title="Working locally"
              >
                <div
                  className="hp-position-relative"
                  style={{ fontSize: "1.5em" }}
                >
                  <MdCloudOff className="hp-text-color-black-60 " />
                </div>
              </Popover>
            }
          />
        </Col>
      );
    }

    if (
      (user.details.profile || user.details || user.loggedIn) &&
      isPremiumUser
    ) {
      // Premium User - Has Backup Enabled
      if (user.details.isBackupEnabled) {
        return (
          <Col className="hp-d-flex-center hp-mr-sm-12 ">
            <Button
              type="text"
              icon={
                <Popover
                  content={getPopoverContent()}
                  placement="bottomRight"
                  title="Backups are enabled."
                >
                  <div
                    className="hp-position-relative"
                    style={{ fontSize: "1.5em" }}
                  >
                    <IoCloudDoneOutline className="hp-text-color-black-60 " />
                  </div>
                </Popover>
              }
            />
          </Col>
        );
      }
      // Premium User - Backup NOT Enabled
      else {
        return (
          <Col className="hp-d-flex-center hp-mr-sm-12 ">
            <Button
              type="text"
              icon={
                <Popover
                  content={getPopoverContent()}
                  placement="bottomRight"
                  title="Working locally"
                >
                  <div
                    className="hp-position-relative"
                    style={{ fontSize: "1.5em" }}
                  >
                    <MdCloudOff className="hp-text-color-black-60 " />
                  </div>
                </Popover>
              }
            />
          </Col>
        );
      }
    }

    if (
      (user.details.profile || user.details || user.loggedIn) &&
      !isPremiumUser
    ) {
      // Non Premium User - Has Backup Enabled (implementation TBD)
      if (user.details.isBackupEnabled) {
        return (
          <Col className="hp-d-flex-center hp-mr-sm-12 ">
            <Button
              type="text"
              icon={
                <Popover content={getPopoverContent()} placement="bottomRight">
                  <div
                    className="hp-position-relative"
                    style={{ fontSize: "1.5em" }}
                  >
                    <IoCloudDoneOutline className="hp-text-color-black-60 " />
                  </div>
                </Popover>
              }
            />
          </Col>
        );
      } else {
        // Non - Premium User - Backup NOT Enabled
        return (
          <Col className="hp-d-flex-center hp-mr-sm-12 ">
            <Button
              type="text"
              icon={
                <Popover
                  content={getPopoverContent()}
                  placement="bottomRight"
                  title="Working locally"
                >
                  <div
                    className="hp-position-relative"
                    style={{ fontSize: "1.5em" }}
                  >
                    <MdCloudOff className="hp-text-color-black-60 " />
                  </div>
                </Popover>
              }
            />
          </Col>
        );
      }
    }

    return <></>;
  };

  return (
    <>
      <BackupIcon />
      {isLimitReachedModalActive && limitReachedModalFeatureName ? (
        <LimitReachedModal
          isOpen={isLimitReachedModalActive}
          toggle={toggleLimitReachedModal}
          featureName={limitReachedModalFeatureName}
          userPlanName={planName}
          mode={
            !isFeatureEnabled(limitReachedModalFeatureName, user, planName)
              ? APP_CONSTANTS.LIMIT_REACHED_MODAL.MODES.CHECK_IF_ENABLED
              : APP_CONSTANTS.LIMIT_REACHED_MODAL.MODES.CHECK_IF_ENABLED
          }
        />
      ) : null}
    </>
  );
};

export default RulesBackupToggle;
