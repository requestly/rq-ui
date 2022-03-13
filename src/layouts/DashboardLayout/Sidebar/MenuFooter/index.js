import { Avatar, Col, Divider, Row, Tooltip } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { RiSettings3Line } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import fallbackAvatar from "assets/images/memoji/memoji-1.png";
import { store } from "store";
import { getAppMode, getUserAuthDetails } from "utils/GlobalStoreUtils";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { isPlanExpired as checkIfPlanIsExpired } from "utils/PremiumUtils";
import APP_CONSTANTS from "config/constants";
import { redirectToPricingPlans } from "utils/RedirectionUtils";
import SignUpPremiumOffer from "components/user/SignUpPremiumOffer";
import { parseGravatarImage } from "utils/Misc";

const MenuFooter = (props) => {
  const { collapsed, onClose } = props;
  const navigate = useNavigate();
  // Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const appMode = getAppMode(state);
  const user = getUserAuthDetails(state);
  const userName =
    user.loggedIn && user?.details?.profile?.displayName
      ? user.details.profile.displayName
      : "User";
  const userPhoto =
    user.loggedIn && user?.details?.profile?.photoURL
      ? parseGravatarImage(user.details.profile.photoURL)
      : null;

  // Component State
  const [isPlanExpired, setIsPlanExpired] = useState(false);
  const [isPlanActive, setIsPlanActive] = useState(false);
  // ToDo @sagar - show org count
  // eslint-disable-next-line no-unused-vars
  const [organizationUserCount, setOrganizationUserCount] = useState(0);

  const getOrganizationUserCount = async (user) => {
    if (!user.loggedIn) return () => {};
    const userOrganization = user?.details?.profile?.email?.split("@")[1];
    const firestore = getFirestore();
    const organizationRef = doc(
      collection(firestore, `companies`),
      userOrganization
    );
    const doesOrganizationExist = (await getDoc(organizationRef)).exists();

    if (!doesOrganizationExist) return () => {};
    const organizationData = (await getDoc(organizationRef)).data();

    if (!organizationData.showToMembers) return () => {};
    setOrganizationUserCount(organizationData.totalUsersCount);
  };

  const renderPlanExpiredText = () => {
    return (
      <>
        <Row
          style={{ marginTop: "-1.5rem", position: "relative" }}
          className="hp-sidebar-footer hp-pb-24 hp-px-24 hp-bg-color-dark-100"
          align="middle"
          justify="space-between"
        >
          <Divider className="hp-border-color-black-20 hp-border-color-dark-70 hp-mt-0" />

          <Col>
            <Row align="middle">
              <Avatar
                size={36}
                src={userPhoto ? userPhoto : fallbackAvatar}
                className="hp-mr-8"
              />

              <div>
                <span className="hp-d-block hp-text-color-black-100 hp-text-color-dark-0 hp-p1-body">
                  {userName}
                </span>

                <Link
                  to="#"
                  className="hp-badge-text hp-text-color-dark-30"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(APP_CONSTANTS.PATHS.PRICING.ABSOLUTE);
                    return false;
                  }}
                  style={{ color: "red" }}
                >
                  Premium Expired
                </Link>
              </div>
            </Row>
          </Col>

          <Col>
            <Link to="#" onClick={onClose}>
              <RiSettings3Line
                className="remix-icon hp-text-color-black-100 hp-text-color-dark-0"
                size={24}
              />
            </Link>
          </Col>
        </Row>
      </>
    );
  };

  const renderPremiumPlanText = () => {
    return (
      <>
        <Row
          style={{ marginTop: "-1.5rem", position: "relative" }}
          className="hp-sidebar-footer hp-pb-24 hp-px-24 hp-bg-color-dark-100"
          align="middle"
          justify="space-between"
        >
          <Divider className="hp-border-color-black-20 hp-border-color-dark-70 hp-mt-0" />

          <Col>
            <Row align="middle">
              <Avatar
                size={36}
                src={userPhoto ? userPhoto : fallbackAvatar}
                className="hp-mr-8"
              />

              <div>
                <span className="hp-d-block hp-text-color-black-100 hp-text-color-dark-0 hp-p1-body">
                  {userName}
                </span>

                <Link
                  to="#"
                  className="hp-badge-text hp-text-color-dark-30"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(APP_CONSTANTS.PATHS.ACCOUNT.ABSOLUTE);
                    return false;
                  }}
                  style={{ color: "green" }}
                >
                  Premium User
                </Link>
              </div>
            </Row>
          </Col>

          <Col>
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                navigate(APP_CONSTANTS.PATHS.ACCOUNT.ABSOLUTE);
                return false;
              }}
            >
              <RiSettings3Line
                className="remix-icon hp-text-color-black-100 hp-text-color-dark-0"
                size={24}
              />
            </Link>
          </Col>
        </Row>
      </>
    );
  };

  const renderUpgradePlanText = (user, appMode) => {
    return (
      <>
        {user.loggedIn ? (
          <>
            <Row
              style={{ marginTop: "-1.5rem", position: "relative" }}
              className="hp-sidebar-footer hp-pb-24 hp-px-24 hp-bg-color-dark-100"
              align="middle"
              justify="space-between"
            >
              <Divider className="hp-border-color-black-20 hp-border-color-dark-70 hp-mt-0" />

              <Col>
                <Row align="middle">
                  <Avatar
                    size={36}
                    src={userPhoto ? userPhoto : fallbackAvatar}
                    className="hp-mr-8"
                  />

                  <div>
                    <span className="hp-d-block hp-text-color-black-100 hp-text-color-dark-0 hp-p1-body">
                      {userName}
                    </span>

                    <Link
                      to="#"
                      className="hp-badge-text orange-color"
                      onClick={(e) => {
                        e.preventDefault();
                        redirectToPricingPlans(navigate);
                        return false;
                      }}
                    >
                      Upgrade to Premium
                    </Link>
                  </div>
                </Row>
              </Col>
              {
                <Col>
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(APP_CONSTANTS.PATHS.PRICING.ABSOLUTE);
                      return false;
                    }}
                  >
                    <Tooltip title="Unlock Unlimited Rules">
                      <span style={{ fontSize: 24 }}>🚀</span>
                    </Tooltip>
                  </Link>
                </Col>
              }
            </Row>
          </>
        ) : (
          renderBanner()
        )}
      </>
    );
  };

  const renderBanner = () => {
    // let tomorrow = new Date();
    // tomorrow.setDate(tomorrow.getDate() + 1);
    // tomorrow = new Date(tomorrow.toDateString());

    return (
      <Row
        style={{ marginTop: "-1.5rem", position: "relative" }}
        className="hp-sidebar-footer hp-pb-24 hp-px-24 hp-bg-color-dark-100"
        align="middle"
        justify="space-between"
      >
        <Divider className="hp-border-color-black-20 hp-border-color-dark-70 hp-mt-0" />

        {/* <Row align="middle"> */}
        {/* <div> */}
        {/* <span
                className="hp-badge-text hp-text-color-dark-30"
                onClick={(e) => {
                e.preventDefault();
                  dispatch(getToggleActiveModalActionObject("authModal", true));
                  return false;
                }}
                style={{ cursor: "pointer" }}
              > */}
        <SignUpPremiumOffer
          user={user}
          appMode={appMode}
          deadline={false}
          isMenuFooter={true}
        />
        {/* </span> */}
        {/* </div> */}
        {/* </Row> */}
      </Row>
    );
  };

  useEffect(() => {
    getOrganizationUserCount(user);
  }, [user]);
  useEffect(() => {
    if (user.details && user.details.isLoggedIn) {
      if (!user.details.planDetails) {
        setIsPlanActive(false);
        setIsPlanExpired(false);
      } else {
        setIsPlanExpired(checkIfPlanIsExpired(user.details.planDetails));
        setIsPlanActive(user.details.isPremium);
      }
    } else {
      setIsPlanActive(false);
      setIsPlanExpired(false);
    }
  }, [user]);

  if (collapsed) {
    return (
      <Row
        style={{ marginTop: "-1.5rem", position: "relative" }}
        className="hp-sidebar-footer hp-pt-16 hp-mb-16 hp-bg-color-dark-100"
        align="middle"
        justify="center"
      >
        <Col>
          <Link to="#" onClick={onClose}>
            <Avatar size={36} src={userPhoto ? userPhoto : fallbackAvatar} />
          </Link>
        </Col>
      </Row>
    );
  }

  return isPlanActive
    ? isPlanExpired
      ? renderPlanExpiredText()
      : renderPremiumPlanText()
    : renderUpgradePlanText(user, appMode);
};

export default MenuFooter;
