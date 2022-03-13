import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
//SUB COMPONENTS
import PlanPriceRepresentation from "../PlanPriceRepresentation";
import FeatureRepresentation from "../FeatureRepresentation";
//UTILS
import {
  getIfTrialModeEnabled,
  getUserAuthDetails,
} from "../../../../utils/GlobalStoreUtils";
import {
  getPlanHeader,
  isEnterprisePlan as isEnterprise,
} from "../../../../utils/PremiumUtils";
//CONFIG
import * as plans from "../../../../config/pricing/plans/plans.json";
// STORE
import { store } from "../../../../store";
import { getToggleActiveModalActionObject } from "../../../../store/action-objects";
// CONST
import APP_CONSTANTS from "../../../../config/constants";
// ICONS
import { Card, Button, Typography, Badge } from "antd";
import { RightOutlined } from "@ant-design/icons";
import BuyForTeamsModal from "../BuyForTeamsModal";
// import TeamSlider from "../TeamSlider";
// import { getDaysFromDurationTitle } from "../../../../utils/PricingUtils";
import { useMediaQuery } from "react-responsive";
import { redirectToRules } from "utils/RedirectionUtils";
import ContactUsModal from "components/landing/contactUsModal";

const { Text } = Typography;

const pricingPlans = plans.default;

const { ACTION_LABELS: AUTH_ACTION_LABELS } = APP_CONSTANTS.AUTH;

const ComparisonTable = ({
  features,
  currency,
  duration,
  onChoosePlan,
  annualDiscountValue,
}) => {
  const navigate = useNavigate();

  const couponDiscountValue = 0;
  const xl = useMediaQuery({ minWidth: 1600 });
  const lg = useMediaQuery({ minWidth: 1200 });
  const md = useMediaQuery({ minWidth: 768 });

  // Global State
  const globalState = useContext(store);
  const { state, dispatch } = globalState;
  const user = getUserAuthDetails(state);
  const isTrialModeEnabled = getIfTrialModeEnabled(state);

  // Component State
  const [isBuyForTeamsModalActive, setIsBuyForTeamsModalActive] = useState(
    false
  );
  const [planName, setPlanName] = useState("");
  const [isContactUsModalOpen, setIsContactUsModalOpen] = useState(false);

  if (!(features && features.length)) {
    return (
      <div className="section is-large has-text-centered">
        <button className="button is-loading">Loading</button>
      </div>
    );
  }

  const toggleBuyForTeamsModal = (newValue = !isBuyForTeamsModalActive) => {
    setIsBuyForTeamsModalActive(newValue);
  };

  const handleSignUpButtonOnClick = () => {
    dispatch(
      getToggleActiveModalActionObject("authModal", true, {
        redirectURL: window.location.href,
        authMode: AUTH_ACTION_LABELS.SIGN_UP,
      })
    );
  };

  const handleSignInButtonOnClick = () => {
    dispatch(
      getToggleActiveModalActionObject("authModal", true, {
        redirectURL: window.location.href,
        authMode: AUTH_ACTION_LABELS.SIGN_IN,
      })
    );
  };

  const renderUpgradeButton = () => {
    return <span>Upgrade Now</span>;
  };

  // const enterpriseFeatures = [
  //   {
  //     title: "API Access",
  //     enabled: true,
  //   },
  //   {
  //     title: "Incoming & Outgoing Webhooks",
  //     enabled: true,
  //   },
  //   {
  //     title: "Identity & Access Management",
  //     enabled: true,
  //   },
  //   {
  //     title: "Team Workspace & Collaboration",
  //     enabled: true,
  //   },
  //   {
  //     title: "Reporting and Analytics",
  //     enabled: true,
  //   },
  //   {
  //     title: "Selenium Grid Support",
  //     enabled: true,
  //   },
  // ];

  const gridTemplateOptionsBasedOnLocation = () => {
    if (isTrialModeEnabled) {
      return xl
        ? "repeat(3,20%)"
        : lg
        ? "repeat(3,25%)"
        : md
        ? "repeat(2,30%)"
        : "auto";
    }
    return xl
      ? "repeat(4,20%)"
      : lg
      ? "repeat(4,25%)"
      : md
      ? "repeat(2,30%)"
      : "auto";
  };

  const disableUpgradeButton = (planId, isPlanActive, currentUserPlan) => {
    if (
      user?.details?.planDetails?.type ===
      APP_CONSTANTS.PRICING.CHECKOUT.MODES.TRIAL
    ) {
      return false;
    }
    if (!isPlanActive) {
      return false;
    }
    if (currentUserPlan === APP_CONSTANTS.PRICING.PLAN_NAMES.ENTERPRISE) {
      return true;
    }
    if (planId === currentUserPlan) {
      return true;
    }
    if (currentUserPlan === APP_CONSTANTS.PRICING.PLAN_NAMES.PROFESSIONAL) {
      return true;
    }
    if (
      currentUserPlan === APP_CONSTANTS.PRICING.PLAN_NAMES.BASIC &&
      planId === APP_CONSTANTS.PRICING.PLAN_NAMES.LITE
    ) {
      return true;
    }
  };

  return (
    <>
      <div
        style={{
          display: "grid",
          justifyContent: "center",
          gridTemplateColumns: gridTemplateOptionsBasedOnLocation(),
          gap: lg ? "10px" : md ? "10px" : "0px",
        }}
      >
        {pricingPlans.map((plan) => {
          if (!plan.isColumnVisible) return null;

          if (
            isTrialModeEnabled &&
            plan.id === APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE
          )
            return null;

          if (duration === "quarterly" || duration === "half-yearly")
            return <React.Fragment key={plan.id}></React.Fragment>;
          let finalPrice;
          if (plan.id === APP_CONSTANTS.PRICING.PLAN_NAMES.ENTERPRISE) {
            finalPrice = plan[duration]["price"][currency];
          } else {
            finalPrice = plan[duration]["price"][currency];
          }
          // if condition so that discounted price only shown at annual premium not anything else
          if (plan.id === "gold" && duration === "annual") {
            finalPrice = finalPrice - (annualDiscountValue / 100) * finalPrice;
          } else if (plan.allowDiscounts) {
            finalPrice = finalPrice - (couponDiscountValue / 100) * finalPrice;
          }
          finalPrice = finalPrice.toFixed(2);

          const isFreePlan = Number(finalPrice) === 0;
          // const isCurrentPlan = plan.id === currentPlan;
          // const price = finalPrice;
          const isEnterprisePlan = isEnterprise(plan.id);
          // const isBasicPlan = isBasic(plan.id);
          const isPlanActive = user?.details?.isPremium;
          let currentUserPlan =
            user?.details?.planDetails?.planName ===
            APP_CONSTANTS.PRICING.PLAN_NAMES.GOLD
              ? APP_CONSTANTS.PRICING.PLAN_NAMES.PROFESSIONAL
              : user?.details?.planDetails?.planName;
          if (
            user?.details?.planDetails?.type ===
            APP_CONSTANTS.PRICING.CHECKOUT.MODES.TRIAL
          ) {
            currentUserPlan = APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE;
          }
          // if (plan.id === APP_CONSTANTS.PRICING.PLAN_NAMES.ENTERPRISE)
          //   return <React.Fragment />;

          const PopularBadge = (props) => {
            if (plan.popular)
              return (
                <Badge.Ribbon text={"Popular"}>{props.children}</Badge.Ribbon>
              );

            return props.children;
          };

          return (
            <React.Fragment key={plan.id}>
              <div key={plan.id}>
                <PopularBadge text="Popular">
                  <Card
                    // hoverable
                    bordered
                    style={
                      plan.popular
                        ? {
                            margin: "10px",
                            display: "flex",
                            justifyContent: "center",
                            borderWidth: "3px",
                            borderRadius: "0.5rem",
                            borderColor: "#0a48b3",
                          }
                        : {
                            margin: "10px",
                            display: "flex",
                            justifyContent: "center",
                            // borderWidth: "0.6px",
                            borderRadius: "0.5rem",
                            borderColor: "#dddddd",
                          }
                    }
                    bodyStyle={{ width: "100%" }}
                    className="pricing-table-shadow"
                  >
                    <div style={{ width: "100%" }}>
                      <h1
                        style={{
                          display: "grid",
                          placeItems: "center",
                          fontWeight: "bolder",
                          fontSize: "1.5rem",
                          marginBottom: md ? "0" : "1.4rem",
                        }}
                      >
                        {getPlanHeader(plan.id)}
                      </h1>
                      <PlanPriceRepresentation
                        currency={currency}
                        duration={duration}
                        price={finalPrice}
                        plan={plan}
                      />
                      {/* {!isEnterprisePlan ? (
                      <>
                        <div style={{ visibility: "hidden" }}>&nbsp;</div>
                        <div style={{ visibility: "hidden" }}>&nbsp;</div>
                      </>
                    ) : (
                      <TeamSlider />
                    )} */}
                      <div
                        style={{
                          textAlign: "center",
                        }}
                      >
                        <Text type="secondary">
                          {isFreePlan
                            ? "No Credit Card Required"
                            : "Cancel Anytime"}
                        </Text>
                      </div>
                      <hr className="hr-light" />
                      <div>
                        {features.map((feature) => {
                          if (feature.showInComparisonTable === false) {
                            return (
                              <React.Fragment key={feature.id}></React.Fragment>
                            );
                          }
                          return (
                            <div key={feature.id} style={{ margin: "5px" }}>
                              <FeatureRepresentation
                                feature={feature[plan.id]}
                              />
                            </div>
                          );
                        })}
                      </div>
                      <br />
                      {isFreePlan ? (
                        <Button
                          block
                          size="large"
                          shape="round"
                          type={"secondary"}
                          onClick={() =>
                            user.loggedIn
                              ? redirectToRules(navigate)
                              : handleSignUpButtonOnClick()
                          }
                        >
                          {user.loggedIn ? "Go to Rules" : "Sign up for free"}
                        </Button>
                      ) : isEnterprisePlan ? (
                        <Button
                          block
                          size="large"
                          shape="round"
                          // style={{ textTransform: "uppercase" }}
                          type={
                            isPlanActive && !isEnterprisePlan
                              ? "default"
                              : "primary"
                          }
                          // href={APP_CONSTANTS.LINKS.CONTACT_US}
                          // disabled={isPlanActive && !isEnterprisePlan}
                          // icon={<MailOutlined />}
                          icon={<RightOutlined />}
                          onClick={(e) => {
                            user.loggedIn
                              ? setIsBuyForTeamsModalActive(true)
                              : handleSignInButtonOnClick();
                            e.stopPropagation();
                          }}
                        >
                          {isEnterprisePlan
                            ? "Upgrade"
                            : isPlanActive
                            ? "Current plan"
                            : "Contact Us"}
                        </Button>
                      ) : (
                        <Button
                          block
                          size="large"
                          shape="round"
                          // style={{ textTransform: "uppercase" }}
                          type={
                            (isPlanActive &&
                              currentUserPlan === plan.id &&
                              !isEnterprisePlan) ||
                            currentUserPlan ===
                              APP_CONSTANTS.PRICING.PLAN_NAMES.PROFESSIONAL ||
                            currentUserPlan ===
                              APP_CONSTANTS.PRICING.PLAN_NAMES.ENTERPRISE
                              ? "default"
                              : "primary"
                          }
                          disabled={disableUpgradeButton(
                            plan.id,
                            isPlanActive,
                            currentUserPlan
                          )}
                          icon={<RightOutlined />}
                          onClick={(e) => {
                            onChoosePlan("individual", plan.id);
                            e.stopPropagation();
                          }}
                        >
                          {isEnterprisePlan
                            ? renderUpgradeButton()
                            : isPlanActive && currentUserPlan === plan.id
                            ? "Current plan"
                            : renderUpgradeButton()}
                        </Button>
                      )}
                      <div
                        style={{
                          textAlign: "center",
                          marginTop: "10px",
                          visibility:
                            isFreePlan ||
                            plan.id === APP_CONSTANTS.PRICING.PLAN_NAMES.LITE
                              ? "hidden"
                              : "",
                        }}
                      >
                        <Button
                          type="link"
                          onClick={(e) => {
                            setIsBuyForTeamsModalActive(true);
                            setPlanName(getPlanHeader(plan.id));
                            e.stopPropagation();
                          }}
                        >
                          {"Buy for Team"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </PopularBadge>
              </div>
              {isBuyForTeamsModalActive ? (
                <BuyForTeamsModal
                  isVisible={isBuyForTeamsModalActive}
                  toggleModal={toggleBuyForTeamsModal}
                  planName={planName}
                  planId={planName.toLowerCase()}
                  duration={duration}
                  onChoosePlan={onChoosePlan}
                  currency={currency}
                />
              ) : null}
            </React.Fragment>
          );
        })}

        {/* Enterprise Plan */}
        {/* <React.Fragment key="enterprise">
          <div key="enterprise">
            <Card
              bordered
              style={{
                margin: "10px",
                display: "flex",
                justifyContent: "center",
                borderRadius: "0.5rem",
                borderColor: "#dddddd",
              }}
              bodyStyle={{ width: "100%" }}
              className="pricing-table-shadow"
            >
              <div style={{ width: "100%" }}>
                <h1
                  style={{
                    display: "grid",
                    placeItems: "center",
                    fontWeight: "bolder",
                    fontSize: "1.5rem",
                    marginBottom: "0",
                  }}
                >
                  {
                    APP_CONSTANTS.PRICING.PLAN_HEADERS[
                      APP_CONSTANTS.PRICING.PLAN_NAMES.ENTERPRISE
                    ]
                  }
                </h1>
                <PlanPriceRepresentation
                  currency={"USD"}
                  duration={"annual"}
                  price={7999}
                  plan={{
                    id: "enterprise",
                  }}
                  showOnlyExactAmount={true}
                />

                <div
                  style={{
                    textAlign: "center",
                  }}
                >
                  <Text type="secondary">Centrally manage everything</Text>
                </div>
                <hr className="hr-light" />
                <div>
                  {enterpriseFeatures.map((feature, index) => {
                    return (
                      <div key={index} style={{ margin: "5px" }}>
                        <FeatureRepresentation
                          feature={{
                            title: feature.title,
                            enabled: feature.enabled,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <br />

                <Button
                  block
                  size="large"
                  shape="round"
                  type="primary"
                  icon={<RightOutlined />}
                  onClick={() => setIsContactUsModalOpen(true)}
                >
                  Contact Sales
                </Button>
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "17px",
                  }}
                ></div>
              </div>
            </Card>
          </div>
        </React.Fragment> */}
        <ContactUsModal
          isOpen={isContactUsModalOpen}
          handleToggleModal={() =>
            setIsContactUsModalOpen(!isContactUsModalOpen)
          }
        />
      </div>
    </>
  );
};

export default ComparisonTable;
