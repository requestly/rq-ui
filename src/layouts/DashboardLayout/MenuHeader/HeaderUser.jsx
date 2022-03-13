import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Col, Avatar, Divider, Row, Spin } from "antd";
import { Game, Graph, Password } from "react-iconly";
import { useContext, useState } from "react";
import { store } from "store";
import { getAppMode, getUserAuthDetails } from "utils/GlobalStoreUtils";
import {
  getToggleActiveModalActionObject,
  getUpdateRefreshPendingStatusActionObject,
} from "store/action-objects";
import {
  redirectToGithubIssues,
  redirectToLicenseIndexPage,
  redirectToSettings,
} from "utils/RedirectionUtils";
import { handleLogoutButtonOnClick } from "components/authentication/AuthForm/actions";
import APP_CONSTANTS from "config/constants";
import { parseGravatarImage } from "utils/Misc";

export default function HeaderUser() {
  const navigate = useNavigate();
  //Global State
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const user = getUserAuthDetails(state);
  const appMode = getAppMode(state);
  const userName =
    user.loggedIn && user?.details?.profile?.displayName
      ? user.details.profile.displayName
      : "User";
  const userPhoto =
    user.loggedIn && user?.details?.profile?.photoURL
      ? parseGravatarImage(user.details.profile.photoURL)
      : null;
  // Component State
  const [isLoading, setIsLoading] = useState(false);

  const promptUserToLogin = () => {
    dispatch(
      getToggleActiveModalActionObject("authModal", true, {
        redirectURL: window.location.href,
      })
    );
  };

  const menu = (
    <div
      className="hp-border-radius hp-border-1 hp-border-color-black-40 hp-bg-black-0 hp-bg-dark-100 hp-border-color-dark-80 hp-p-24 hp-mt-12"
      style={{ width: 260 }}
    >
      <span className="hp-d-block h5 hp-text-color-black-100 hp-text-color-dark-0 hp-mb-8">
        {userName}
      </span>

      <Link
        to={APP_CONSTANTS.PATHS.ACCOUNT.ABSOLUTE}
        className="hp-p1-body hp-text-color-primary-1 hp-text-color-dark-primary-2 hp-hover-text-color-primary-2"
      >
        View Profile
      </Link>

      <Divider className="hp-mt-16 hp-mb-6" />

      <Row>
        <Col span={24}>
          <Link
            to="/"
            className="hp-d-flex-center hp-p1-body hp-py-8 hp-px-10 hp-d-block hp-transition hp-hover-bg-primary-4 hp-hover-bg-dark-80 hp-border-radius"
            style={{ marginLeft: -10, marginRight: -10 }}
            onClick={(e) => {
              e.preventDefault();
              redirectToLicenseIndexPage(navigate);
              return false;
            }}
          >
            <Password set="curved" size={16} />

            <span className="hp-ml-8">Manage License</span>
          </Link>
        </Col>

        <Col span={24}>
          <Link
            to="/"
            className="hp-d-flex-center hp-p1-body hp-py-8 hp-px-10 hp-d-block hp-transition hp-hover-bg-primary-4 hp-hover-bg-dark-80 hp-border-radius"
            style={{ marginTop: -7, marginLeft: -10, marginRight: -10 }}
            onClick={(e) => {
              e.preventDefault();
              redirectToSettings(navigate);
              return false;
            }}
          >
            <Graph set="curved" size={16} />

            <span className="hp-ml-8">View Storage</span>
          </Link>
        </Col>

        <Col span={24}>
          <Link
            to="/"
            className="hp-d-flex-center hp-p1-body hp-py-8 hp-px-10 hp-d-block hp-transition hp-hover-bg-primary-4 hp-hover-bg-dark-80 hp-border-radius"
            style={{ marginTop: -7, marginLeft: -10, marginRight: -10 }}
            onClick={(e) => {
              e.preventDefault();
              redirectToGithubIssues(navigate, { newTab: true });
              return false;
            }}
          >
            <Game set="curved" size={16} />

            <span className="hp-ml-8">Help Desk</span>
          </Link>
        </Col>
      </Row>

      <Divider className="hp-mb-16 hp-mt-6" />

      <Link
        to="/"
        className="hp-p1-body"
        onClick={(e) => {
          e.preventDefault();
          setIsLoading(true);
          handleLogoutButtonOnClick(appMode)
            .then(() =>
              dispatch(getUpdateRefreshPendingStatusActionObject("rules"))
            )
            .then(() => setIsLoading(false))
            .catch(() => setIsLoading(false));
          return false;
        }}
      >
        Logout
      </Link>
    </div>
  );

  const loading = (
    <span>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (isLoading) {
    return loading;
  }

  const renderUserDetails = () => {
    return (
      <>
        <Col>
          <Dropdown overlay={menu} placement="bottomLeft">
            <Avatar src={userPhoto} size={40} className="hp-cursor-pointer" />
          </Dropdown>
        </Col>
      </>
    );
  };

  const renderLoginBtn = () => {
    return (
      <Col>
        <Link
          to="/"
          onClick={(event) => {
            event.preventDefault();
            promptUserToLogin();
            return false;
          }}
        >
          Sign in
        </Link>
      </Col>
    );
  };

  let showUserDropdown = true;

  Object.values(APP_CONSTANTS.PATHS.AUTH).forEach((AUTH_PATH) => {
    if (window.location.pathname === AUTH_PATH.ABSOLUTE) {
      showUserDropdown = false;
    }
  });

  if (!showUserDropdown) {
    return null;
  }

  return (
    <>
      {user.loggedIn &&
      user.details &&
      user.details.profile &&
      user.details.profile.displayName &&
      user.details.profile.photoURL
        ? renderUserDetails()
        : renderLoginBtn()}
    </>
  );
}
