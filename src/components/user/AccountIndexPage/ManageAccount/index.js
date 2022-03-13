import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Card,
  CardHeader,
  Col,
  CardBody,
  Input,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { Button as AntButton } from "antd";
import { toast } from "utils/Toast.js";
//SUB COMPONENTS
import ManageTeams from "./ManageTeams";
import ActiveLicenseInfo from "./ActiveLicenseInfo";
import UserInfo from "./UserInfo";
//STORE
import { store } from "../../../../store";
//UTILS
import * as GlobalStoreUtils from "../../../../utils/GlobalStoreUtils";
import DataStoreUtils from "../../../../utils/DataStoreUtils";
import {
  redirectToForgotPassword,
  redirectToRefreshSubscription,
  redirectToUpdateSubscriptionContactUs,
} from "../../../../utils/RedirectionUtils";
// ACTIONS
import { handleLogoutButtonOnClick } from "../../../authentication/AuthForm/actions";
import { refreshUserInGlobalState } from "../../common/actions";
// CONSTANTS
import APP_CONSTANTS from "../../../../config/constants";
import ProCard from "@ant-design/pro-card";
import { Dropdown, Menu, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";

import isEmpty from "is-empty";

const getDesignationDisplayValue = (originalValue) => {
  switch (originalValue) {
    case "marketer":
      return "Marketer";

    case "developer":
      return "Developer";

    case "designer":
      return "Designer";

    case "consultant":
      return "Consultant";

    case "support":
      return "Customer Support";

    case "eng_manager":
      return "Engineering Manager";

    case "prod_manager":
      return "Product Manager";

    case "tester":
      return "Tester";

    case "gamer":
      return "Video Gamer";

    case "goanimator":
      return "Goanimator";

    case "student":
      return "Student";

    case "other":
      return "Other";

    default:
      return "Developer";
  }
};

const MenuComponent = ({ onChangeHandler }) => (
  <Menu>
    <Menu.Item key={0}>
      <span
        onClick={() =>
          onChangeHandler("marketer", getDesignationDisplayValue("marketer"))
        }
      >
        {getDesignationDisplayValue("marketer")}
      </span>
    </Menu.Item>
    <Menu.Item key={1}>
      <span
        onClick={() =>
          onChangeHandler("developer", getDesignationDisplayValue("developer"))
        }
      >
        {getDesignationDisplayValue("developer")}
      </span>
    </Menu.Item>
    <Menu.Item key={2}>
      <span
        onClick={() =>
          onChangeHandler("designer", getDesignationDisplayValue("designer"))
        }
      >
        {getDesignationDisplayValue("designer")}
      </span>
    </Menu.Item>
    <Menu.Item key={3}>
      <span
        onClick={() =>
          onChangeHandler(
            "consultant",
            getDesignationDisplayValue("consultant")
          )
        }
      >
        {getDesignationDisplayValue("consultant")}
      </span>
    </Menu.Item>
    <Menu.Item key={4}>
      <span
        onClick={() =>
          onChangeHandler("support", getDesignationDisplayValue("support"))
        }
      >
        {getDesignationDisplayValue("support")}
      </span>
    </Menu.Item>
    <Menu.Item key={5}>
      <span
        onClick={() =>
          onChangeHandler(
            "eng_manager",
            getDesignationDisplayValue("eng_manager")
          )
        }
      >
        {getDesignationDisplayValue("eng_manager")}
      </span>
    </Menu.Item>
    <Menu.Item key={6}>
      <span
        onClick={() =>
          onChangeHandler(
            "prod_manager",
            getDesignationDisplayValue("prod_manager")
          )
        }
      >
        {getDesignationDisplayValue("prod_manager")}
      </span>
    </Menu.Item>
    <Menu.Item key={7}>
      <span
        onClick={() =>
          onChangeHandler("tester", getDesignationDisplayValue("tester"))
        }
      >
        {getDesignationDisplayValue("tester")}
      </span>
    </Menu.Item>
    <Menu.Item key={8}>
      <span
        onClick={() =>
          onChangeHandler("gamer", getDesignationDisplayValue("gamer"))
        }
      >
        {getDesignationDisplayValue("gamer")}
      </span>
    </Menu.Item>
    <Menu.Item key={9}>
      <span
        onClick={() =>
          onChangeHandler(
            "goanimator",
            getDesignationDisplayValue("goanimator")
          )
        }
      >
        {getDesignationDisplayValue("goanimator")}
      </span>
    </Menu.Item>
    <Menu.Item key={10}>
      <span
        onClick={() =>
          onChangeHandler("student", getDesignationDisplayValue("student"))
        }
      >
        {getDesignationDisplayValue("student")}
      </span>
    </Menu.Item>
    <Menu.Item key={11}>
      <span
        onClick={() =>
          onChangeHandler("other", getDesignationDisplayValue("other"))
        }
      >
        {getDesignationDisplayValue("other")}
      </span>
    </Menu.Item>
  </Menu>
);

const getUserProfileDropdown = (currentValue, onChangeHandler) => {
  return (
    <Dropdown
      trigger={["click"]}
      overlay={<MenuComponent onChangeHandler={onChangeHandler} />}
      style={{
        background: "transparent",
        border: "none",
        boxShadow: "none",
      }}
    >
      <Typography.Text
        strong
        className="ant-dropdown-link"
        onClick={(e) => e.preventDefault()}
        style={{ textTransform: "capitalize", cursor: "pointer" }}
      >
        {isEmpty(currentValue) ? "Choose" : currentValue} <DownOutlined />
      </Typography.Text>
    </Dropdown>
  );
};

const ManageAccount = () => {
  const navigate = useNavigate();
  //Global State
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const user = GlobalStoreUtils.getUserAuthDetails(state);
  const appMode = GlobalStoreUtils.getAppMode(state);
  //Component State
  const [areChangesPending, setAreChangesPending] = useState(false);
  const [userDesignation, setUserDesignation] = useState("");
  const [userCompanyName, setUserCompanyName] = useState("");
  // const [cancelFormText, setCancelFormText] = useState("");
  // const [alternateEmail, setAlternateEmail] = useState("");
  // const [confirmLoading, setConfirmLoading] = useState(false);
  // const [cancelSubscriptionModal, setCancelSubscriptionModal] = useState(false);
  // Fallback image
  const defaultImageSrc =
    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
  const isUserPremium = user.details?.isPremium;
  let userImageSrc = user.details.profile.photoURL
    ? user.details.profile.photoURL
    : defaultImageSrc;

  const userDisplayName = user.details.profile.displayName
    ? user.details.profile.displayName
    : "User";

  // Reqeust larger gravatar
  if ("URLSearchParams" in window) {
    // To URL
    let userImageSrcURL = new URL(userImageSrc);
    let userImageSrcParams = userImageSrcURL.searchParams;
    // Set query param
    userImageSrcParams.set("s", "180");
    // Attach to new URL
    userImageSrcURL.search = userImageSrcParams.toString();
    // Attach to original URL
    userImageSrc = userImageSrcURL.toString();
  }

  const handleDesignationDropdownOnChange = (newValue, newDisplayValue) => {
    // Update local state
    setUserDesignation(newDisplayValue);
    // Save change to DB
    DataStoreUtils.updateValueAsPromise(
      ["customProfile", user.details.profile.uid],
      {
        position: newValue,
      }
    ).then(() => {
      // Refresh user in global state
      refreshUserInGlobalState(dispatch);
    });
  };

  const handleSaveProfileOnClick = () => {
    // Save change to DB
    DataStoreUtils.updateValueAsPromise(
      ["customProfile", user.details.profile.uid],
      {
        companyName: userCompanyName,
      }
    ).then(() => {
      // Notify
      toast.info("Profile saved");
      setAreChangesPending(false);
    });
  };

  const handleCancelSubscription = () => {
    // if (!isUserPremium) {
    //   return;
    // }
    // setConfirmLoading(true);
    // const userEmail = user.details.isLoggedIn && user.details.profile.email;
    // const functions = getFunctions();
    // const cancelSubscription = httpsCallable(functions, "cancelSubscription");
    // cancelSubscription({ userEmail, cancelFormText, alternateEmail })
    //   .then((response) => {
    //     if (response.data.success) {
    //       toast.success(
    //         "Your request for cancellation has been sent. It will be processed within 1-2 business days."
    //       );
    //       setCancelSubscriptionModal(false);
    //     }
    //   })
    //   .catch((err) => {
    //     toast.error("Something Went Wrong!");
    //   });
    // setConfirmLoading(false);
    redirectToUpdateSubscriptionContactUs();
  };
  useEffect(() => {
    // Initial values. Fetch full profile
    if (user.details) {
      DataStoreUtils.getValue(["customProfile", user.details.profile.uid]).then(
        (customProfile) => {
          if (!customProfile) return;
          const { position, companyName } = customProfile;
          if (position)
            setUserDesignation(getDesignationDisplayValue(position));
          if (companyName) setUserCompanyName(companyName);
        }
      );
    }
  }, [user.details.profile.uid, user]);

  return (
    <React.Fragment>
      {/* Page content */}
      <ProCard className="primary-card github-like-border">
        <Row className="profile-container">
          <Col
            className="profile-container-left profile-container-child"
            xl="8"
          >
            <UserInfo shadow={true} hideBillingAddress={true} />
            {/* Active License Info */}
            <br />
            <ActiveLicenseInfo customHeading={"Active Subscription"} />
          </Col>
          <Col
            className="profile-container-right profile-container-child mb-5 mb-xl-0"
            xl="4"
          >
            <Card className="profile-card profile-card-shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a
                      href="https://gravatar.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        alt="..."
                        className="rounded-circle"
                        src={userImageSrc}
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className="profile-card-header border-0 pt-1 pt-md-1 pb-0 pb-md-1"></CardHeader>
              <CardBody
                className="profile-card-body pt-0 pt-md-1"
                style={{ fontSize: "14px" }}
              >
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5"></div>
                  </div>
                </Row>
                <div className="text-center">
                  <h3>{userDisplayName}</h3>
                  <div className="h5 mt-4">
                    <i className="ni business_briefcase-24 mr-2" />
                    {getUserProfileDropdown(
                      userDesignation,
                      handleDesignationDropdownOnChange
                    )}
                  </div>
                  <div style={{ margin: "1rem 0" }}>
                    <InputGroup className="input-group mb-4">
                      <InputGroupText>
                        <i className="ni ni-building" />
                      </InputGroupText>
                      <Input
                        className="form-control-alternative"
                        type="text"
                        placeholder="Company name"
                        id="companyName"
                        value={userCompanyName}
                        onChange={(e) => {
                          setAreChangesPending(true);
                          setUserCompanyName(e.target.value);
                        }}
                        style={{ textTransform: "capitalize" }}
                      />
                    </InputGroup>
                  </div>
                  <div className="my-4">
                    <AntButton
                      type={areChangesPending ? "primary" : "secondary"}
                      onClick={handleSaveProfileOnClick}
                      size="small"
                      disabled={!areChangesPending}
                    >
                      Save profile
                    </AntButton>
                  </div>
                  <hr className="my-4" />
                  <div style={{ textAlign: "left" }}>
                    <Row className="my-2">
                      <Col>
                        <AntButton
                          type="secondary"
                          size="small"
                          onClick={() => {
                            // Logout user and redirect to forget password page
                            handleLogoutButtonOnClick(appMode).then(() => {
                              redirectToForgotPassword(navigate);
                            });
                          }}
                        >
                          Reset Password
                        </AntButton>
                      </Col>
                    </Row>
                    <Row className="my-2">
                      <Col>
                        <AntButton
                          type="secondary"
                          size="small"
                          onClick={() =>
                            window.open(
                              APP_CONSTANTS.LINKS.GDPR.EXPORT_DATA,
                              "_blank"
                            )
                          }
                        >
                          Request Data Download
                        </AntButton>
                      </Col>
                    </Row>
                    <Row className="my-2">
                      <Col>
                        <AntButton
                          type="secondary"
                          size="small"
                          onClick={() =>
                            window.open(
                              APP_CONSTANTS.LINKS.GDPR.DELETE_ACCOUNT,
                              "_blank"
                            )
                          }
                        >
                          Request Account Deletion
                        </AntButton>
                      </Col>
                    </Row>
                    <Row className="my-2">
                      <Col>
                        <AntButton
                          type="secondary"
                          size="small"
                          onClick={() => {
                            redirectToRefreshSubscription(navigate);
                          }}
                        >
                          Refresh Subscription
                        </AntButton>
                      </Col>
                    </Row>
                    {isUserPremium ? (
                      <Row className="my-2">
                        <Col>
                          <AntButton
                            type="secondary"
                            size="small"
                            onClick={() => {
                              // setCancelSubscriptionModal(true);
                              handleCancelSubscription();
                            }}
                          >
                            Cancel Subscription
                          </AntButton>
                        </Col>
                      </Row>
                    ) : null}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Teams */}
        <Row className="profile-team">
          <Col>
            <CardBody className="profile-team-body">
              <ManageTeams />
            </CardBody>
          </Col>
        </Row>
      </ProCard>
      {/* <Modal
        title="Request Cancellation "
        visible={cancelSubscriptionModal}
        onOk={handleCancelSubscription}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setCancelSubscriptionModal(false);
          setConfirmLoading(false);
        }}
        destroyOnClose={true}
        okText={"Submit"}
        cancelText="Cancel"
        width={600}
      >
        <AntInput
          addonBefore="Alternate Email"
          defaultValue="(Optional)"
          value={alternateEmail}
          onChange={(e) => setAlternateEmail(e.target.value)}
          style={{ marginBottom: "1rem" }}
        />
        We are sad to see you go. Please let us know the reason.
        <TextArea
          rows={5}
          value={cancelFormText}
          onChange={(e) => setCancelFormText(e.target.value)}
        />
      </Modal> */}
    </React.Fragment>
  );
};

export default ManageAccount;
