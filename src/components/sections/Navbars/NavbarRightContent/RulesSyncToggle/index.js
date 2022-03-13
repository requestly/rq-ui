import { useContext, useState } from "react";
import { store } from "../../../../../store";
import { Popover, Button, Col } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { getUserAuthDetails } from "utils/GlobalStoreUtils";
// import { setIsBackupEnabled } from "utils/BackupUtils";
import LimitReachedModal from "components/user/LimitReachedModal";
import APP_CONSTANTS from "config/constants";
import { MdSyncDisabled, MdSync } from "react-icons/md";
import { getToggleActiveModalActionObject } from "store/action-objects";
// import { redirectToBackups } from "utils/RedirectionUtils";
// import { useNavigate } from 'react-router-dom';
import { isFeatureEnabled } from "../../../../../utils/FeatureManager";
// import { useHistory } from "react-router";
import { setSyncState } from "utils/syncing/SyncUtils";
import { toast } from "../../../../../utils/Toast";

const RulesSyncToggle = () => {
  //   const navigate = useNavigate();
  // Global State
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const user = getUserAuthDetails(state);
  // Component State
  const [
    isSyncStatusChangeProcessing,
    setIsSyncStatusChangeProcessing,
  ] = useState(false);

  // Premium Check
  const isSyncingAllowed = true;
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
    if (!isSyncingAllowed) {
      //Update state to reflect changes in modal
      setLimitReachedModalFeatureName(APP_CONSTANTS.FEATURES.SYNCING);
      //Activate modal to notify user to upgrade
      setIsLimitReachedModalActive(true);
    }
  };

  const changeIsSyncEnabled = async (syncState) => {
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
      setIsSyncStatusChangeProcessing(true);
      setSyncState(user.details.profile.uid, syncState)
        .then(() => {
          toast.info(
            `We ${
              syncState ? "will" : "won't"
            } be syncing your rules automatically hereon.`
          );
        })
        .catch(() => {
          toast.error(
            `Sorry, we are experiencing issues updating the sync state.`
          );
        });
      setIsSyncStatusChangeProcessing(false);
    };

    // If user is logged in

    // If premium user - allow
    if (isSyncingAllowed) {
      proceedChangingStatus();
      return;
    }
    // If non-premium user, prompt to upgrade
    else {
      promptUserToUpgrade();
      return;
    }
  };

  const offerToTurnOnSync = () => {
    return (
      <div style={{ maxWidth: "350px" }}>
        <p>
          Always keep your rules in sync irrespective of the device you use.
        </p>

        {/* <Space> */}
        <Button
          type="primary"
          onClick={() => changeIsSyncEnabled(true)}
          loading={isSyncStatusChangeProcessing}
          icon={<RightOutlined />}
        >
          Turn on syncing
        </Button>
      </div>
    );
  };

  const offerToTurnOffSync = () => {
    return (
      <div style={{ maxWidth: "300px" }}>
        <p>
          Always keep your rules in sync irrespective of the device you use.
        </p>
        {/* <Space> */}
        <Button
          type="primary"
          onClick={() => changeIsSyncEnabled(false)}
          loading={isSyncStatusChangeProcessing}
        >
          Turn off syncing
        </Button>
      </div>
    );
  };

  const getPopoverContent = () => {
    // If user is not logged in
    if (!user.loggedIn || !user.details || !user.details.profile) {
      return offerToTurnOnSync();
    }

    if (
      (user.details.profile || user.details || user.loggedIn) &&
      isSyncingAllowed
    ) {
      // Premium User - Has Backup Enabled
      if (user.details.isSyncEnabled) {
        return offerToTurnOffSync();
      }
      // Premium User - Backup NOT Enabled
      else {
        return offerToTurnOnSync();
      }
    }

    if (
      (user.details.profile || user.details || user.loggedIn) &&
      !isSyncingAllowed
    ) {
      // Non Premium User - Has Backup Enabled (implementation TBD)
      if (user.details.isSyncEnabled) {
        return offerToTurnOffSync();
      } else {
        // Non - Premium User - Backup NOT Enabled
        return offerToTurnOnSync();
      }
    }
  };

  const SyncIcon = () => {
    // If user is not logged in
    if (!user.loggedIn || !user.details || !user.details.profile) {
      return (
        <Col className="hp-d-flex-center hp-mr-sm-12 ">
          <Button
            type="text"
            icon={
              <Popover
                content={getPopoverContent()}
                title="Working locally"
                placement="bottomRight"
              >
                <div
                  className="hp-position-relative"
                  style={{ fontSize: "1.5em" }}
                >
                  <MdSyncDisabled className="hp-text-color-black-60 " />
                </div>
              </Popover>
            }
          ></Button>
        </Col>
      );
    }

    if (
      (user.details.profile || user.details || user.loggedIn) &&
      isSyncingAllowed
    ) {
      // Premium User - Has Sync Enabled
      if (user.details.isSyncEnabled) {
        return (
          <Col className="hp-d-flex-center hp-mr-sm-12 ">
            <Button
              type="text"
              icon={
                <Popover
                  content={getPopoverContent()}
                  placement="bottomRight"
                  title="Syncing is enabled"
                >
                  <div
                    className="hp-position-relative"
                    style={{ fontSize: "1.5em" }}
                  >
                    <MdSync className="hp-text-color-black-60 " />
                  </div>
                </Popover>
              }
            />
          </Col>
        );
      }
      // Premium User - Sync disabled
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
                    <MdSyncDisabled className="hp-text-color-black-60 " />
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
      !isSyncingAllowed
    ) {
      // Non Premium User - Has Backup Enabled (implementation TBD)
      if (user.details.isSyncEnabled) {
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
                    <MdSync className="hp-text-color-black-60 " />
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
                    <MdSyncDisabled className="hp-text-color-black-60 " />
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
      <SyncIcon />
      {isLimitReachedModalActive && limitReachedModalFeatureName ? (
        <LimitReachedModal
          isOpen={isLimitReachedModalActive}
          toggle={toggleLimitReachedModal}
          featureName={limitReachedModalFeatureName}
          userPlanName={planName}
          mode={
            !isFeatureEnabled(limitReachedModalFeatureName, user, planName)
              ? APP_CONSTANTS.LIMIT_REACHED_MODAL.MODES.CHECK_IF_ENABLED
              : APP_CONSTANTS.LIMIT_REACHED_MODAL.MODES.CHECK_LIMIT
          }
        />
      ) : null}
    </>
  );
};

export default RulesSyncToggle;
