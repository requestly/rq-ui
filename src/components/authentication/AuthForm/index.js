import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  // InputGroupAddon,
  // InputGroupText,
  InputGroup,
  Col,
} from "reactstrap";
import { FaEnvelope, FaLock, FaSpinner, FaUser } from "react-icons/fa";
import { Tabs } from "antd";
//STORE
import { store } from "../../../store";
//IMAGES
import GoogleIcon from "../../../assets/img/icons/common/google.svg";
// import MicrosoftIcon from "../../../assets/img/icons/common/microsoft.svg";
import AppleIcon from "../../../assets/img/icons/common/apple.svg";
// import GithubIcon from "../../../assets/img/icons/common/github.svg";
//CONSTANTS
import APP_CONSTANTS from "../../../config/constants";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
//ACTIONS
import {
  handleEmailSignInButtonOnClick,
  handleSignUpButtonOnClick,
  handleForgotPasswordButtonOnClick,
  handleGoogleSignInButtonOnClick,
  handleResetPasswordOnClick,
  // handleMicrosoftSignInButtonOnClick,
  handleAppleSignInButtonOnClick,
} from "./actions";
//UTILS
import { getQueryParamsAsMap } from "../../../utils/URLUtils";
import { getAppMode } from "../../../utils/GlobalStoreUtils";
import { trackAuthModalShownEvent } from "../../../utils/analytics/auth/auth_modal";

const { ACTION_LABELS: AUTH_ACTION_LABELS } = APP_CONSTANTS.AUTH;
const { TabPane } = Tabs;
const AuthForm = ({
  setAuthMode: SET_MODE,
  authMode: MODE,
  setPopoverVisible: SET_POPOVER,
  src,
  callbacks,
}) => {
  const navigate = useNavigate();
  //LOAD PROPS
  const callbackFromProps = callbacks || {};
  const { onSignInSuccess, onRequestPasswordResetSuccess } = callbackFromProps;
  //GLOBAL STATE
  const globalState = useContext(store);
  const { state } = globalState;
  const appMode = getAppMode(state);
  //COMPONENT STATE
  // const [MODE, SET_MODE] = useState(
  //   authMode ? authMode : AUTH_ACTION_LABELS.LOG_IN
  // );
  const [actionPending, setActionPending] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState();
  // const [emailOptin, setEmailOptin] = useState(false);
  const [trackEvent, setTrackEvent] = useState(true);

  const emailOptin = false;
  let isSignUp = true;

  useEffect(() => {
    // Updating reference code from query parameters
    let queryParams = getQueryParamsAsMap();
    if (!referralCode && typeof referralCode != "string") {
      if (queryParams["rcode"]) {
        setReferralCode(queryParams["rcode"]);
      } else {
        setReferralCode("");
      }
    }
    if (trackEvent) {
      trackAuthModalShownEvent();
      setTrackEvent(false);
    }
  }, [referralCode, trackEvent]);

  const renderSocialButtons = () => {
    switch (MODE) {
      case AUTH_ACTION_LABELS.LOG_IN:
      case AUTH_ACTION_LABELS.SIGN_UP:
        return (
          <CardHeader
            className="auth-modal-social-auth"
            style={{ border: "unset" }}
          >
            <div
              className="text-center"
              style={{
                display: "flex",
                flexDirection: "row",
                width: "80%",
                margin: "0 auto",
                gap: "1rem",
              }}
            >
              {/* <Button
                    className="btn-neutral btn-icon"
                    color="default"
                    onClick={(e) => e.preventDefault()}
                  >
                    <span className="btn-inner--icon">
                      <img alt="Login with Github" src={GithubIcon} />
                    </span>
                    <span className="btn-inner--text">Github</span>
                  </Button> */}
              <Button
                className="btn-neutral w-75 my-2 btn-icon auth-modal-btn"
                color="default"
                onClick={() =>
                  handleGoogleSignInButtonOnClick(
                    setActionPending,
                    src,
                    onSignInSuccess,
                    appMode,
                    MODE,
                    navigate
                  )
                }
              >
                <span className="btn-inner--icon">
                  <img
                    style={{ width: "1.4rem", margin: "0 .4rem" }}
                    alt="Login with Google"
                    src={GoogleIcon}
                  />
                </span>
                <span className="btn-inner--text">
                  {MODE === AUTH_ACTION_LABELS.LOG_IN
                    ? "Sign in with Google"
                    : "Sign up using Google"}
                </span>
              </Button>
              {appMode &&
              appMode === GLOBAL_CONSTANTS.APP_MODES.EXTENSION &&
              MODE === AUTH_ACTION_LABELS.LOG_IN ? (
                <Button
                  className="btn-neutral w-100 my-2 btn-icon auth-modal-btn"
                  style={{ maxWidth: "3rem" }}
                  color="default"
                  onClick={() =>
                    handleAppleSignInButtonOnClick(
                      setActionPending,
                      src,
                      onSignInSuccess,
                      MODE,
                      navigate
                    )
                  }
                >
                  <span className="btn-inner--icon">
                    <img
                      style={{ width: "1.4rem", margin: "0 .4rem" }}
                      alt="Login with Apple"
                      src={AppleIcon}
                    />
                  </span>
                </Button>
              ) : null}
            </div>
          </CardHeader>
        );

      default:
        return null;
    }
  };

  const renderFormSubmitButton = () => {
    if (actionPending) {
      return (
        <Button
          className="auth-modal-btn primary"
          color="primary"
          type="button"
        >
          <FaSpinner className="icon-spin" />
        </Button>
      );
    }
    switch (MODE) {
      default:
      case AUTH_ACTION_LABELS.LOG_IN:
        return (
          <Button
            id="auth-form-submit-btn"
            className="my-4 auth-modal-btn primary"
            color="primary"
            type="submit"
            onClick={(event) =>
              handleEmailSignInButtonOnClick(
                event,
                email,
                password,
                false,
                appMode,
                setActionPending,
                src,
                onSignInSuccess,
                () => setPassword("")
              )
            }
          >
            Sign in
          </Button>
        );

      case AUTH_ACTION_LABELS.SIGN_UP:
        return (
          <Button
            id="auth-form-submit-btn"
            className="auth-modal-btn primary"
            color="primary"
            type="submit"
            onClick={(event) =>
              handleSignUpButtonOnClick(
                event,
                name,
                email,
                password,
                referralCode,
                setActionPending,
                navigate,
                emailOptin,
                isSignUp
              )
            }
          >
            Sign up
          </Button>
        );
      case AUTH_ACTION_LABELS.REQUEST_RESET_PASSWORD:
        return (
          <Button
            id="auth-form-submit-btn"
            className="auth-modal-btn primary"
            color="primary"
            type="submit"
            onClick={(event) =>
              handleForgotPasswordButtonOnClick(
                event,
                email,
                setActionPending,
                onRequestPasswordResetSuccess
              )
            }
          >
            Send reset link
          </Button>
        );
      case AUTH_ACTION_LABELS.DO_RESET_PASSWORD:
        return (
          <Button
            id="auth-form-submit-btn"
            className="my-4"
            color="primary"
            type="submit"
            onClick={(event) =>
              handleResetPasswordOnClick(
                event,
                password,
                setActionPending,
                navigate,
                () => SET_MODE(AUTH_ACTION_LABELS.LOG_IN)
              )
            }
          >
            Set new password
          </Button>
        );
    }
  };

  // const renderRememberMeCheckbox = () => {
  //   switch (MODE) {
  //     case AUTH_ACTION_LABELS.LOG_IN:
  //       return (
  //         <div className="auth-modal-checkbox">
  //           <input
  //             className="checkbox"
  //             id=" customCheckLogin"
  //             type="checkbox"
  //             defaultChecked
  //           />
  //           <label className="custom-control-label" htmlFor=" customCheckLogin">
  //             <span className="text-muted">Remember me</span>
  //           </label>
  //         </div>
  //       );

  //     default:
  //       return null;
  //   }
  // };

  // const renderEmailOptin = () => {
  //   switch (MODE) {
  //     case AUTH_ACTION_LABELS.SIGN_UP:
  //       return (
  //         <div className="auth-modal-checkbox">
  //           <input
  //             className="checkbox"
  //             id="emailOptin"
  //             type="checkbox"
  //             defaultChecked={emailOptin}
  //             onChange={() => setEmailOptin(!emailOptin)}
  //           />
  //           <label className="custom-control-label" htmlFor="emailOptin">
  //             <span className="text-muted">
  //               Send me updates with tailored offers, feature releases and
  //               product launches
  //             </span>
  //           </label>
  //           <br />
  //           <br />
  //         </div>
  //       );

  //     default:
  //       return null;
  //   }
  // };
  const onTabChange = (clickedTab) => {
    switch (clickedTab) {
      default:
      case AUTH_ACTION_LABELS.LOG_IN: {
        SET_MODE(AUTH_ACTION_LABELS.LOG_IN);
        SET_POPOVER(true);
        break;
      }
      case AUTH_ACTION_LABELS.SIGN_UP: {
        SET_MODE(AUTH_ACTION_LABELS.SIGN_UP);
        SET_POPOVER(true);
        break;
      }
    }
  };
  const renderRightFooterLink = () => {
    switch (MODE) {
      case AUTH_ACTION_LABELS.LOG_IN:
        return (
          <Col style={{ textAlign: "right" }}>
            <span
              className="text-right text-muted cursor-pointer "
              onClick={() => {
                SET_MODE(AUTH_ACTION_LABELS.REQUEST_RESET_PASSWORD);
                SET_POPOVER(false);
              }}
            >
              Reset password
            </span>
          </Col>
        );

      case AUTH_ACTION_LABELS.DO_RESET_PASSWORD:
        return (
          <Col>
            <span
              className="float-right text-muted cursor-pointer"
              onClick={() => {
                SET_MODE(AUTH_ACTION_LABELS.REQUEST_RESET_PASSWORD);
                SET_POPOVER(false);
              }}
            >
              Resend
            </span>
          </Col>
        );

      case AUTH_ACTION_LABELS.REQUEST_RESET_PASSWORD:
        return (
          <Col>
            <span
              className="float-right text-muted cursor-pointer"
              onClick={() => {
                SET_MODE(AUTH_ACTION_LABELS.SIGN_UP);
                SET_POPOVER(true);
              }}
            >
              Sign up
            </span>
          </Col>
        );
      default:
        return null;
    }
  };

  const renderPasswordField = () => {
    switch (MODE) {
      case AUTH_ACTION_LABELS.LOG_IN:
      case AUTH_ACTION_LABELS.SIGN_UP:
      case AUTH_ACTION_LABELS.DO_RESET_PASSWORD:
        return (
          <FormGroup>
            <InputGroup className="input-group">
              <div className="input-group-icon">
                <FaLock size={20} />
              </div>
              {/* <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-lock-circle-open" />
                </InputGroupText>
              </InputGroupAddon> */}
              <Input
                required={true}
                placeholder="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </InputGroup>
            {renderRightFooterLink()}
          </FormGroup>
        );

      default:
        return null;
    }
  };

  const renderNameField = () => {
    switch (MODE) {
      case AUTH_ACTION_LABELS.SIGN_UP:
        return (
          <FormGroup className="mb-3">
            <InputGroup className="input-group">
              {/* <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-single-02" />
                </InputGroupText>
              </InputGroupAddon> */}
              <div className="input-group-icon">
                <FaUser size={20} />
              </div>
              <Input
                required={true}
                placeholder="John Doe"
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </InputGroup>
          </FormGroup>
        );

      default:
        return null;
    }
  };

  const renderEmailField = () => {
    switch (MODE) {
      case AUTH_ACTION_LABELS.DO_RESET_PASSWORD:
        return null;
      default:
        return (
          <FormGroup className="mb-3">
            <InputGroup className="input-group">
              {/* <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-email-83" />
                </InputGroupText>
              </InputGroupAddon> */}
              <div className="input-group-icon ">
                <FaEnvelope size={20} />
              </div>
              <Input
                required={true}
                placeholder="example@microsoft.com"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </InputGroup>
          </FormGroup>
        );
    }
  };
  const renderReferralMessage = () => {
    return (
      <div className="text-center text-muted mb-4 text-green">
        <small>Yay! Referral Code applied successfully!</small> <br />
        <small>
          <b>Sign up with work email</b> to get Free Requestly Premium
        </small>
      </div>
    );
  };

  const renderDivider = () => {
    switch (MODE) {
      case AUTH_ACTION_LABELS.SIGN_UP:
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ borderBottom: "1px solid #92a1b1", width: "100%" }} />
            <span style={{ padding: "10px", minWidth: "fit-content" }}>
              or Sign up using your Email
            </span>
            <div style={{ borderBottom: "1px solid #92a1b1", width: "100%" }} />
          </div>
        );
      case AUTH_ACTION_LABELS.LOG_IN:
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ borderBottom: "1px solid #92a1b1", width: "100%" }} />
            <span style={{ padding: "10px", minWidth: "fit-content" }}>
              or Sign in with Email
            </span>
            <div style={{ borderBottom: "1px solid #92a1b1", width: "100%" }} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      style={{ maxWidth: "400px", margin: "0 auto", paddingTop: "0px" }}
      className="bg-secondary shadow border-0 auth-modal"
    >
      <CardBody className="px-lg-5 py-lg-5">
        <Form role="form">
          <div>
            <Tabs defaultActiveKey={MODE} onChange={(key) => onTabChange(key)}>
              <TabPane tab="Log In" key={AUTH_ACTION_LABELS.LOG_IN}>
                {renderSocialButtons()}
                {renderDivider()}
                {renderNameField()}
                {renderEmailField()}
                {renderPasswordField()}
                {referralCode ? renderReferralMessage() : null}
                <div className="text-center">{renderFormSubmitButton()}</div>
              </TabPane>
              <TabPane tab="Sign Up" key={AUTH_ACTION_LABELS.SIGN_UP}>
                {renderSocialButtons()}
                {renderDivider()}
                {renderNameField()}
                {renderEmailField()}
                {renderPasswordField()}
                {referralCode ? renderReferralMessage() : null}
                <div className="text-center">{renderFormSubmitButton()}</div>
              </TabPane>
            </Tabs>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default AuthForm;
