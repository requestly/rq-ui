import React, { useState, useEffect, useContext } from "react";
import { Radio } from "antd";
import { Row } from "reactstrap";
import { useMediaQuery } from "react-responsive";
//SUB COMPONENTS
import ComparisonTable from "../ComparisonTable";
import EnterpriseRequestBanner from "../EnterpriseRequestBanner";
//CONFIG
import * as allFeatures from "../../../../config/pricing/features/features.json";
//UTILS
import {
  redirectToSignIn,
  redirectToCheckout,
} from "../../../../utils/RedirectionUtils";
import { submitEventUtil } from "../../../../utils/AnalyticsUtils";
import * as GlobalStoreUtils from "../../../../utils/GlobalStoreUtils";
import * as PricingUtils from "../../../../utils/PricingUtils";
import * as PremiumUtils from "../../../../utils/PremiumUtils";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import APP_CONSTANTS from "../../../../config/constants";
//STORE
import { store } from "../../../../store";
import BuyForTeamsModal from "../BuyForTeamsModal";
//ANALYTICS
import { trackCheckoutInitiatedEvent } from "utils/analytics/business/checkout";
import MoveToProfessionalModal from "components/payments/MoveToProfessionalModal";

const TRACKING = GLOBAL_CONSTANTS.GA_EVENTS;
const { defaultCurrency, getDefaultCurrencyBasedOnLocation } = PricingUtils;

const annualDiscountValue = 0;

const PricingTable = () => {
  const lg = useMediaQuery({ minWidth: 1200 });
  const md = useMediaQuery({ minWidth: 768 });

  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const user = GlobalStoreUtils.getUserAuthDetails(state);
  const userCountry = GlobalStoreUtils.getUserCountry(state);
  //Component State
  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);
  const [selectedDuration, setSelectedDuration] = useState("annual");

  const [features] = useState(allFeatures.default);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [isBuyForTeamsModalActive, setIsBuyForTeamsModalActive] = useState(
    false
  );

  const toggleBuyForTeamsModal = (newValue = !isBuyForTeamsModalActive) => {
    setIsBuyForTeamsModalActive(newValue);
  };

  const [
    isMoveToProfessionalModalVisible,
    setIsMoveToProfessionalModalVisible,
  ] = useState(false);

  const onChoosePlan = (mode, planId, quantity = 1) => {
    if (planId === "bronze") return;
    if (user.details.isLoggedIn) {
      if (PremiumUtils.isEnterprisePlan(planId)) {
        //Analytics
        submitEventUtil(
          TRACKING.CATEGORIES.PRICING,
          TRACKING.ACTIONS.VIEWED,
          `Redirected@TeamsCheckout.from.pricing.page`
        );
        setIsBuyForTeamsModalActive(true);
      } else {
        let planType = PremiumUtils.getPlanNameFromId(planId);
        if (mode === APP_CONSTANTS.PRICING.CHECKOUT.MODES.TEAM) {
          planType = PremiumUtils.getTeamPlanNameFromId(planId);
        }
        // If user is already on Lite plan and tries to get Professional!
        if (
          planType === APP_CONSTANTS.PRICING.PLAN_NAMES.PROFESSIONAL &&
          currentPlan === APP_CONSTANTS.PRICING.PLAN_NAMES.LITE
        ) {
          setIsMoveToProfessionalModalVisible(true);
          return;
        }
        // If user is already on Basic plan and tries to get Professional!
        if (
          planType === APP_CONSTANTS.PRICING.PLAN_NAMES.PROFESSIONAL &&
          currentPlan === APP_CONSTANTS.PRICING.PLAN_NAMES.BASIC
        ) {
          setIsMoveToProfessionalModalVisible(true);
          return;
        }
        //Analytics
        submitEventUtil(
          TRACKING.CATEGORIES.PRICING,
          TRACKING.ACTIONS.VIEWED,
          `Redirected@Checkout.from.Pricing.Page`
        );
        trackCheckoutInitiatedEvent(selectedDuration, planType, quantity);
        redirectToCheckout({
          mode: mode,
          planType: planType,
          days: PricingUtils.getDaysFromDurationTitle(selectedDuration),
          quantity: quantity,
        });
      }
    } else {
      //Analytics
      submitEventUtil(
        TRACKING.CATEGORIES.PRICING,
        TRACKING.ACTIONS.LOGIN_REQUESTED,
        `sign in`
      );
      redirectToSignIn(false, {
        redirectURL: window.location.pathname,
        source: "pricing",
        hardRedirect: true,
      });
    }
  };

  const onDurationToggle = (selectedItem) => {
    setSelectedDuration(selectedItem);
    //Analytics
    submitEventUtil(
      GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.PRICING,
      GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.DURATION_CHANGE,
      `Duration changed to ${selectedItem}`
    );
  };

  useEffect(() => {
    if (user.details.isLoggedIn) {
      setCurrentPlan(user.details?.planDetails?.planName);
    }

    if (userCountry) {
      setSelectedCurrency(getDefaultCurrencyBasedOnLocation(userCountry));
    }
  }, [selectedDuration, selectedCurrency, user, userCountry]);

  return (
    <React.Fragment>
      <Row>
        <div style={{ display: "grid", placeItems: "center" }}>
          <h1
            className="font-weight-bolder mt-4 h1-larger"
            style={{
              fontWeight: 700,
              textAlign: "center",
              lineHeight: "2.6rem",
              fontSize: md ? "" : "1.4rem",
            }}
          >
            Developer Productivity Matters 🚀
          </h1>
          <h3 style={{ textAlign: "center" }}>
            Developers save 2 hours of their development time a week, which
            corresponds to over 200$ a month
          </h3>
        </div>
      </Row>

      <div>
        <Radio.Group
          style={{ display: "grid", placeItems: "center", marginTop: "15px" }}
          defaultValue="annual"
          buttonStyle="solid"
          onChange={(e) => onDurationToggle(e.target.value)}
        >
          <div>
            <Radio.Button
              style={{
                // fontSize: "1.3rem",
                width: md ? "200px" : "100px",
                textAlign: "center",
                borderTopLeftRadius: "20px",
                borderBottomLeftRadius: "20px",
                fontWeight: "bold",
              }}
              value="monthly"
            >
              Monthly
            </Radio.Button>
            <Radio.Button
              style={{
                // fontSize: "1.3rem",
                width: md ? "200px" : "100px",
                textAlign: "center",
                borderTopRightRadius: "20px",
                borderBottomRightRadius: "20px",
                fontWeight: "bold",
              }}
              value="annual"
            >
              Yearly
            </Radio.Button>
          </div>
        </Radio.Group>
        <h4
          style={{
            color: "#0a48b3",
            display: lg ? "grid" : "none",
            placeItems: "center",
            marginLeft: "200px",
            marginTop: "10px",
            fontWeight: "bold",
          }}
        >
          ~2 months EXTRA!
        </h4>
      </div>
      <EnterpriseRequestBanner user={user} />

      {/* <Row style={{ marginBottom: "1rem", marginTop: "1rem" }}>
        <div style={{ display: "grid", placeItems: "center" }}>
          <Alert
            message="Use code BFRIDAY2021 before Tuesday for 30% off on all plans."
            type="info"
            showIcon
          />
        </div>
      </Row> */}

      <ComparisonTable
        features={features}
        currency={selectedCurrency}
        duration={selectedDuration}
        onChoosePlan={onChoosePlan}
        annualDiscountValue={annualDiscountValue}
      />

      {currentPlan === APP_CONSTANTS.PRICING.PLAN_NAMES.SILVER ? (
        <>
          <div className="container section content mb-3">
            <span>
              You are on Silver Plan which expires on{" "}
              {PremiumUtils.getEndDate(user.details.planDetails)}. Silver Plan
              is deprecated and can no longer be renewed. Please contact us at{" "}
              <a href="mailto:contact@requestly.io">contact@requestly.io</a> for
              further questions.
            </span>
            <br />
            <br />
          </div>
        </>
      ) : null}
      {isBuyForTeamsModalActive ? (
        <BuyForTeamsModal
          numberOfDays={PricingUtils.getDaysFromDurationTitle(selectedDuration)}
          isVisible={isBuyForTeamsModalActive}
          toggleModal={toggleBuyForTeamsModal}
        />
      ) : null}
      <MoveToProfessionalModal
        isOpen={isMoveToProfessionalModalVisible}
        toggle={() =>
          setIsMoveToProfessionalModalVisible(!isMoveToProfessionalModalVisible)
        }
      />
    </React.Fragment>
  );
};

export default PricingTable;
