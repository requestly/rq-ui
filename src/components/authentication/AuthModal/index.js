import React, { useContext, useEffect, useState } from "react";
import { Modal, Popover } from "antd";
//SUB COMPONENTS
import AuthForm from "../AuthForm";
import SignUpPremiumOffer from "../../user/SignUpPremiumOffer";
//STORE
import { store } from "../../../store";
//UTILS
import {
  getAppMode,
  getIfTrialModeEnabled,
  getUserAuthDetails,
} from "../../../utils/GlobalStoreUtils";
// CONSTANTS
import APP_CONSTANTS from "../../../config/constants";

const AuthModal = ({
  isOpen,
  toggle,
  authMode: authModeFromProps,
  src,
  callback,
  closable = true,
}) => {
  //GLOBAL STATE
  const globalState = useContext(store);
  const { state } = globalState;
  const user = getUserAuthDetails(state);
  const appMode = getAppMode(state);
  const isTrialModeEnabled = getIfTrialModeEnabled(state);
  // Component State
  const [authMode, setAuthMode] = useState(
    authModeFromProps
      ? authModeFromProps
      : APP_CONSTANTS.AUTH.ACTION_LABELS.LOG_IN
  );
  const [popoverVisible, setPopoverVisible] = useState(
    authMode === APP_CONSTANTS.AUTH.ACTION_LABELS.SIGN_UP ? true : true
  );
  useEffect(() => {
    if (user.loggedIn) {
      toggle();
    }
  }, [user.loggedIn, toggle, authMode]);

  return (
    <Modal
      size="small"
      visible={isOpen}
      onCancel={closable ? () => toggle() : null}
      footer={null}
      style={{ width: "300px", margin: "0 auto" }}
      bodyStyle={{ padding: "0", borderRadius: "0.45rem" }}
      width="400px"
      closable={closable}
    >
      <Popover
        placement="left"
        content={<SignUpPremiumOffer user={user} appMode={appMode} />}
        title=""
        visible={isTrialModeEnabled ? popoverVisible : false}
      >
        <AuthForm
          authMode={authMode}
          src={src}
          callbacks={{
            onSignInSuccess: callback,
            onRequestPasswordResetSuccess: toggle,
          }}
          setAuthMode={setAuthMode}
          popoverVisible={popoverVisible}
          setPopoverVisible={setPopoverVisible}
        />
      </Popover>
    </Modal>
  );
};

export default AuthModal;
