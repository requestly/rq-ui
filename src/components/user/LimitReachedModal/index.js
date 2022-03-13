import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Row, Card } from "antd";
import { Modal } from "antd";
//UTILS
import { redirectToPricingPlans } from "../../../utils/RedirectionUtils";
import {
  getPrettyPlanName,
  getPrettyString,
} from "../../../utils/FormattingHelper";
import * as GlobalStoreUtils from "../../../utils/GlobalStoreUtils";
//CONSTANTS
import APP_CONSTANTS from "../../../config/constants";
import { getFeatureLimits } from "../../../utils/FeatureManager";
import {
  trackLimitReachedDialogEvent,
  trackUpgradeNowClickedEvent,
  trackCharacterLimitReachedEvent,
} from "utils/analytics/business/free-limits/limit_reached";
import { trackSharedListLimitReachedEvent } from "utils/analytics/sharedList";
import { trackMockLimitReachedEvent } from "utils/analytics/mock-server/mocks/mock_limit";
//STORE
import { store } from "../../../store";
import MoveToProfessionalModal from "components/payments/MoveToProfessionalModal";
// Images
import Coding from "assets/images/illustrations/growth.svg";
import CodingDark from "assets/images/illustrations/growth-dark.svg";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { AddUser, Discovery, Document, Filter, InfoCircle } from "react-iconly";
import { IoPeopleOutline, IoRocket } from "react-icons/io5";

const { THEMES } = APP_CONSTANTS;

const LimitReachedModal = ({
  isOpen,
  toggle,
  featureName = "rules",
  userPlanName = "Free",
  featureLimit,
  mode = APP_CONSTANTS.LIMIT_REACHED_MODAL.MODES.CHECK_LIMIT,
  numberOfRulesImportAllowed,
  currentNumberOfRules,
}) => {
  const navigate = useNavigate();
  // Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const user = GlobalStoreUtils.getUserAuthDetails(state);
  const appMode = GlobalStoreUtils.getAppMode(state);
  const appTheme = GlobalStoreUtils.getAppTheme(state);
  const currentUserPlan =
    user?.details?.planDetails?.planName ===
    APP_CONSTANTS.PRICING.PLAN_NAMES.GOLD
      ? APP_CONSTANTS.PRICING.PLAN_NAMES.PROFESSIONAL
      : user?.details?.planDetails?.planName;

  const planNameToDisplay = getPrettyPlanName(userPlanName);
  const featureLimitToDisplay =
    featureLimit || getFeatureLimits(featureName, user, userPlanName);
  const prettyFeatureName = getPrettyString(featureName);

  // To set copy text
  const [monthlyCouponCode, setCopyMonthlyCouponCode] = useState("");
  const [annualCouponCode, setCopyAnnualCouponCode] = useState("");

  const generateModalHeader = () => {
    if (mode === APP_CONSTANTS.LIMIT_REACHED_MODAL.MODES.CHECK_LIMIT) {
      return (
        <strong>{`You have reached the ${featureLimitToDisplay} ${prettyFeatureName} limit`}</strong>
      );
    } else if (mode === APP_CONSTANTS.LIMIT_REACHED_MODAL.MODES.IMPORT_LIMIT) {
      return (
        <strong>{`You can${
          numberOfRulesImportAllowed === 0 ? "not" : ""
        } import ${
          numberOfRulesImportAllowed !== 0 ? numberOfRulesImportAllowed : ""
        }  more ${
          numberOfRulesImportAllowed === 1 ? "rule" : "rules"
        }`}</strong>
      );
    }
    return (
      <strong>
        <span
          style={{ textTransform: "capitalize" }}
        >{`${prettyFeatureName} `}</span>
        {`is not available in the ${planNameToDisplay} plan`}
      </strong>
    );
  };

  const getModalBodyPrefix = () => {
    if (mode === APP_CONSTANTS.LIMIT_REACHED_MODAL.MODES.CHECK_LIMIT) {
      if (featureName === APP_CONSTANTS.FEATURES.ACTIVE_RULES) {
        return "To activate more rules";
      } else if (
        featureName === APP_CONSTANTS.FEATURES.RESPONSE_BODY_CHARACTER_LIMIT ||
        featureName === APP_CONSTANTS.FEATURES.SCRIPT_RULE_CHARACTER_LIMIT
      ) {
        return `To increase the ${prettyFeatureName}`;
      } else if (featureName === APP_CONSTANTS.FEATURES.IMPORT) {
        return `To be able to import more rules`;
      } else {
        return `To create more ${prettyFeatureName}`;
      }
    } else if (mode === APP_CONSTANTS.LIMIT_REACHED_MODAL.MODES.IMPORT_LIMIT) {
      return `To increase the number of available rules`;
    } else {
      return `To enable ${prettyFeatureName}`;
    }
  };

  //To handle copy monthly coupon code
  const copyMonthlyCouponCode = () => {
    setCopyAnnualCouponCode("");
    setCopyMonthlyCouponCode("RQ7Monthly");
    navigator.clipboard.writeText("RQ7Monthly").then(
      function () {
        // console.log('Copying to clipboard was successful!');
        submitEventUtil(
          GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.REQUEST_UPGRADE,
          GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LIMIT_REACHED,
          "Monthly coupon code copied"
        );
      },
      function (err) {
        console.error("Could not copy text: ", err);
      }
    );
  };

  //To handle copy of annual coupon code
  const copyAnnualCouponCode = () => {
    setCopyMonthlyCouponCode("");
    setCopyAnnualCouponCode("RQ7Annual");
    navigator.clipboard.writeText("RQ7Annual").then(
      function () {
        // console.log('Copying to clipboard was successful!');
        submitEventUtil(
          GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.REQUEST_UPGRADE,
          GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.LIMIT_REACHED,
          "Annual coupon code copied"
        );
      },
      function (err) {
        console.error("Could not copy text: ", err);
      }
    );
  };
  const couponValidityEndDate = "2021-07-30";
  const isDiscountCouponValid = () => {
    const couponEndDate = new Date(couponValidityEndDate);
    const todayDate = new Date();
    return todayDate.getTime() <= couponEndDate.getTime();
  };

  let reason,
    source = "";
  if (prettyFeatureName === "rules") {
    reason = APP_CONSTANTS.LIMIT_REACHED_MODAL.REASON.CREATE_RULE;
    source = APP_CONSTANTS.LIMIT_REACHED_MODAL.SOURCE.CREATE_RULE;
    trackLimitReachedDialogEvent(
      APP_CONSTANTS.LIMIT_REACHED_MODAL.REASON.CREATE_RULE,
      APP_CONSTANTS.LIMIT_REACHED_MODAL.SOURCE.CREATE_RULE
    );
  } else if (prettyFeatureName === "active rules") {
    reason = APP_CONSTANTS.LIMIT_REACHED_MODAL.REASON.ACTIVE_RULE;
    source = APP_CONSTANTS.LIMIT_REACHED_MODAL.SOURCE.ACTIVE_RULE;
    trackLimitReachedDialogEvent(
      APP_CONSTANTS.LIMIT_REACHED_MODAL.REASON.ACTIVE_RULE,
      APP_CONSTANTS.LIMIT_REACHED_MODAL.SOURCE.ACTIVE_RULE
    );
  } else if (prettyFeatureName.includes("character_limit")) {
    trackCharacterLimitReachedEvent(prettyFeatureName);
    reason = APP_CONSTANTS.LIMIT_REACHED_MODAL.REASON.CHARACTER_LIMIT;
    source = APP_CONSTANTS.LIMIT_REACHED_MODAL.SOURCE.CHARACTER_LIMIT;
    trackLimitReachedDialogEvent(
      APP_CONSTANTS.LIMIT_REACHED_MODAL.REASON.CHARACTER_LIMIT,
      APP_CONSTANTS.LIMIT_REACHED_MODAL.SOURCE.CHARACTER_LIMIT
    );
  } else if (prettyFeatureName === "shared lists") {
    trackSharedListLimitReachedEvent(featureLimitToDisplay);
    reason = APP_CONSTANTS.LIMIT_REACHED_MODAL.REASON.SHARED_LIST;
    source = APP_CONSTANTS.LIMIT_REACHED_MODAL.SOURCE.SHARED_LIST;
    trackLimitReachedDialogEvent(
      APP_CONSTANTS.LIMIT_REACHED_MODAL.REASON.SHARED_LIST,
      APP_CONSTANTS.LIMIT_REACHED_MODAL.SOURCE.SHARED_LIST
    );
  } else if (prettyFeatureName === "files") {
    trackMockLimitReachedEvent(featureLimitToDisplay);
    reason = APP_CONSTANTS.LIMIT_REACHED_MODAL.REASON.MOCK_SERVER;
    source = APP_CONSTANTS.LIMIT_REACHED_MODAL.SOURCE.MOCK_SERVER;
    trackLimitReachedDialogEvent(
      APP_CONSTANTS.LIMIT_REACHED_MODAL.REASON.MOCK_SERVER,
      APP_CONSTANTS.LIMIT_REACHED_MODAL.SOURCE.MOCK_SERVER
    );
  } else if (prettyFeatureName === "rule pairs") {
    reason = APP_CONSTANTS.LIMIT_REACHED_MODAL.REASON.RULE_PAIRS;
    source = APP_CONSTANTS.LIMIT_REACHED_MODAL.SOURCE.RULE_PAIRS;
    trackLimitReachedDialogEvent(
      APP_CONSTANTS.LIMIT_REACHED_MODAL.REASON.RULE_PAIRS,
      APP_CONSTANTS.LIMIT_REACHED_MODAL.SOURCE.RULE_PAIRS
    );
  } else if (prettyFeatureName === "import") {
    reason = APP_CONSTANTS.LIMIT_REACHED_MODAL.REASON.IMPORT_RULE;
    source = APP_CONSTANTS.LIMIT_REACHED_MODAL.SOURCE.IMPORT_RULE;
    trackLimitReachedDialogEvent(
      APP_CONSTANTS.LIMIT_REACHED_MODAL.REASON.IMPORT_RULE,
      APP_CONSTANTS.LIMIT_REACHED_MODAL.SOURCE.IMPORT_RULE
    );
  }

  const getCodingImage = () => {
    if (appTheme === THEMES.DARK) {
      return CodingDark;
    }
    return Coding;
  };

  const renderLimitReachModal = () => {
    return (
      <Modal
        className="modal-dialog-centered modal-danger"
        contentClassName="bg-gradient-danger bg-gradient-blue"
        visible={isOpen}
        onCancel={() => toggle()}
        footer={null}
        // title={generateModalHeader()}
        title={null}
        width="50%"
      >
        <div className="modal-body">
          <Row gutter={[32, 32]}>
            <Col span={12}>
              <div className="py-3 text-center">
                <center>
                  <img
                    src={getCodingImage()}
                    alt={"Upgrade"}
                    height={"30%"}
                    style={{ maxHeight: "25vh", textAlign: "center" }}
                  />
                </center>
                <Title level={1} className="font-weight-900 white-in-light">
                  Hey, just a heads up!
                </Title>
                <p>
                  <Text type="secondary">
                    You've reached {String(planNameToDisplay).toLowerCase()}{" "}
                    plan limits.
                  </Text>
                </p>
                <p>
                  <Text type="secondary">
                    Please upgrade to Requestly Pro. Or better yet, get Pro for
                    your entire team and manage billing centrally.
                  </Text>
                </p>
                <br />
                <Row>
                  <Col className="mr-2">
                    <InfoCircle
                      set="curved"
                      className="hp-text-color-black-60"
                    />
                  </Col>
                  <Col>
                    <a
                      href="https://docs.requestly.io/premium-subscription#faqs"
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      What if I'm not ready to upgrade?
                    </a>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col span={12}>
              <Row>
                <Col span={24}>
                  <Card className="hp-border-color-black-40 hp-pb-10">
                    <Row>
                      <Col span={24}>
                        <Title
                          level={3}
                          className="font-weight-900 white-in-light"
                        >
                          Go Pro to keep your features
                        </Title>

                        <div>
                          <Row>
                            <Col span={24}>
                              <Text strong type="danger">
                                {mode ===
                                APP_CONSTANTS.LIMIT_REACHED_MODAL.MODES
                                  .CHECK_LIMIT ? (
                                  <span>
                                    <span
                                      style={{ textTransform: "capitalize" }}
                                    >
                                      {String(planNameToDisplay)}
                                    </span>{" "}
                                    plan allows only {featureLimitToDisplay}{" "}
                                    {prettyFeatureName}.
                                  </span>
                                ) : mode ===
                                  APP_CONSTANTS.LIMIT_REACHED_MODAL.MODES
                                    .IMPORT_LIMIT ? (
                                  <span>
                                    {`Max ${featureLimitToDisplay} rules are allowed in the ${planNameToDisplay} Plan. You already have ${currentNumberOfRules} ${
                                      currentNumberOfRules === 1
                                        ? "rule"
                                        : "rules"
                                    }, so you can${
                                      numberOfRulesImportAllowed === 0
                                        ? "not"
                                        : ""
                                    } import ${
                                      numberOfRulesImportAllowed || ""
                                    } more ${
                                      numberOfRulesImportAllowed === 1
                                        ? "rule"
                                        : "rules"
                                    }.`}
                                  </span>
                                ) : (
                                  <span>
                                    <span
                                      style={{ textTransform: "capitalize" }}
                                    >
                                      {prettyFeatureName}
                                    </span>{" "}
                                    is not available in the {planNameToDisplay}{" "}
                                    plan.
                                  </span>
                                )}{" "}
                                {getModalBodyPrefix() + ", "}
                                <strong> upgrade to Pro.</strong>
                              </Text>
                            </Col>
                          </Row>
                        </div>
                        <br />
                        <div>
                          <Row>
                            <Col span={24}>
                              <Text strong>Pro Plan features:</Text>
                            </Col>
                          </Row>
                          <Row className="mt-1">
                            <Col span={24}>
                              <Row gutter={[16, 16]}>
                                {/* Hardcode for now. @todo @sagar - fetch from features.json */}

                                {/* Feature Start */}
                                <Col className="gutter-row" span={12}>
                                  <Row align="middle" justify="space-between">
                                    <Col>
                                      <Row align="middle">
                                        <Filter
                                          size={24}
                                          set="curved"
                                          className="remix-icon hp-text-color-primary-1 hp-mr-8"
                                        />

                                        <Col>
                                          <p className="hp-mb-0 hp-badge-text hp-font-weight-400">
                                            Unlimited Rules
                                          </p>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </Col>
                                {/* Feature End */}
                                {/* Feature Start */}
                                <Col className="gutter-row" span={12}>
                                  <Row align="middle" justify="space-between">
                                    <Col>
                                      <Row align="middle">
                                        <Document
                                          size={24}
                                          set="curved"
                                          className="remix-icon hp-text-color-primary-1 hp-mr-8"
                                        />

                                        <Col>
                                          <p className="hp-mb-0 hp-badge-text hp-font-weight-400">
                                            Unlimited Mocks
                                          </p>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </Col>
                                {/* Feature End */}
                                {/* Feature Start */}
                                <Col className="gutter-row" span={12}>
                                  <Row align="middle" justify="space-between">
                                    <Col>
                                      <Row align="middle">
                                        <AddUser
                                          size={24}
                                          set="curved"
                                          className="remix-icon hp-text-color-primary-1 hp-mr-8"
                                        />

                                        <Col>
                                          <p className="hp-mb-0 hp-badge-text hp-font-weight-400">
                                            Unlimited Sharing
                                          </p>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </Col>
                                {/* Feature End */}
                                {/* Feature Start */}
                                <Col className="gutter-row" span={12}>
                                  <Row align="middle" justify="space-between">
                                    <Col>
                                      <Row align="middle">
                                        <Discovery
                                          size={24}
                                          set="curved"
                                          className="remix-icon hp-text-color-primary-1 hp-mr-8"
                                        />

                                        <Col>
                                          <p className="hp-mb-0 hp-badge-text hp-font-weight-400">
                                            Remote Rules
                                          </p>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </Col>
                                {/* Feature End */}
                              </Row>
                            </Col>
                          </Row>
                        </div>
                        <br />
                        <div>
                          <Button
                            onClick={() => {
                              redirectToPricingPlans(navigate);
                              trackUpgradeNowClickedEvent(reason, source);
                              toggle();
                            }}
                            className="btn-white ml-auto"
                            type="primary"
                            size="small"
                            icon={<IoRocket />}
                          >
                            &nbsp; Upgrade to Pro
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <br />
              <Row>
                <Col span={24}>
                  <Card className="hp-border-color-black-40 hp-pb-10">
                    <Row>
                      <Col span={24}>
                        <Title
                          level={3}
                          className="font-weight-900 white-in-light"
                        >
                          Get Requestly for your team
                        </Title>

                        <div>
                          <Row>
                            <Col span={24}>
                              <Text>
                                Centralized billing to simplify payment for your
                                team. Licensed to your team, not permanently
                                linked to individuals.
                              </Text>
                            </Col>
                          </Row>
                          <br />

                          <Button
                            onClick={() => {
                              redirectToPricingPlans(navigate);
                              trackUpgradeNowClickedEvent(reason, source);
                              toggle();
                            }}
                            className="btn-white ml-auto"
                            type="secondary"
                            size="small"
                            icon={<IoPeopleOutline />}
                          >
                            &nbsp; Create Team
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>

        {isDiscountCouponValid() ? (
          <>
            <h4 className="heading text-center">A sweet surprise for you</h4>
            <div className="d-flex px-3 justify-content-between">
              <p className="text-white">
                50% OFF for first 3 months on Monthly Plan
              </p>
              <h3>
                <UncontrolledTooltip
                  delay={0}
                  trigger="hover focus"
                  target="monthlyCoupon"
                >
                  {monthlyCouponCode ? "Copied" : "Copy To Clipboard"}
                </UncontrolledTooltip>
                <CopyToClipboard
                  text={monthlyCouponCode}
                  onCopy={copyMonthlyCouponCode}
                >
                  <Badge
                    style={{ textTransform: "none" }}
                    id="monthlyCoupon"
                    className="text-dark cursor-pointer"
                    color="light"
                  >
                    RQ7Monthly
                  </Badge>
                </CopyToClipboard>
              </h3>
            </div>
            <div className="d-flex px-3 justify-content-between">
              <p className="text-white">Flat 25% OFF on Annual Plan</p>
              <h3>
                <CopyToClipboard
                  text={annualCouponCode}
                  onCopy={copyAnnualCouponCode}
                >
                  <Badge
                    style={{ textTransform: "none" }}
                    id="annualCoupon"
                    className="text-dark cursor-pointer"
                    color="light"
                  >
                    RQ7Annual
                  </Badge>
                </CopyToClipboard>
                <UncontrolledTooltip
                  delay={0}
                  trigger="hover focus"
                  target="annualCoupon"
                >
                  {annualCouponCode ? "Copied" : "Copy To Clipboard"}
                </UncontrolledTooltip>
              </h3>
            </div>
          </>
        ) : null}
      </Modal>
    );
  };

  const renderUpgradeToProfessionalModal = () => {
    return <MoveToProfessionalModal isOpen={isOpen} toggle={toggle} />;
  };

  if (
    currentUserPlan &&
    currentUserPlan === APP_CONSTANTS.PRICING.PLAN_NAMES.BASIC
  ) {
    return renderUpgradeToProfessionalModal();
  } else {
    return renderLimitReachModal();
  }
};

export default LimitReachedModal;
