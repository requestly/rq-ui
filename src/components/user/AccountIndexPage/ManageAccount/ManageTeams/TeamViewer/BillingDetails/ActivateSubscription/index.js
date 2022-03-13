import React, { useState } from "react";
import { Row, Button } from "antd";
// Constants
import APP_CONSTANTS from "../../../../../../../../config/constants";
// Sub Components
import BuyForTeamsModal from "../../../../../../../landing/pricing/BuyForTeamsModal";
// ANALYTICS
import { submitEventUtil } from "../../../../../../../../utils/AnalyticsUtils";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import { RightOutlined } from "@ant-design/icons";

const TRACKING = GLOBAL_CONSTANTS.GA_EVENTS;

const ActivateSubscription = () => {
  // Component State
  const [isBuyForTeamsModalActive, setIsBuyForTeamsModalActive] = useState(
    false
  );

  const toggleBuyForTeamsModal = (newValue = !isBuyForTeamsModalActive) => {
    setIsBuyForTeamsModalActive(newValue);
  };

  const renderViewPlansCTA = () => {
    return (
      <Row>
        <div
          style={{
            background: "transparent",
            margin: "auto",
            textAlign: "center",
          }}
        >
          <h3>
            One subscription for all your team members. Subscribe to one of the
            plans to get started.
          </h3>
          <br />
          <p>
            <Button
              type="primary"
              icon={<RightOutlined />}
              onClick={() => {
                setIsBuyForTeamsModalActive(true);

                //Analytics
                submitEventUtil(
                  TRACKING.CATEGORIES.TEAMS,
                  TRACKING.ACTIONS.CLICKED,
                  `Clicked View Plans button on Team Info page redirected@mini pricing table`
                );
              }}
            >
              Get Started
            </Button>
            <Button
              style={{ marginLeft: "10px" }}
              type="secondary"
              onClick={() => {
                window.open(APP_CONSTANTS.PATHS.PRICING.ABSOLUTE);

                //Analytics
                submitEventUtil(
                  TRACKING.CATEGORIES.TEAMS,
                  TRACKING.ACTIONS.CLICKED,
                  `Clicked Learn More button on Team Info page redirected@Pricing table`
                );
              }}
            >
              Learn More
            </Button>
          </p>
        </div>
      </Row>
    );
  };

  return (
    <React.Fragment>
      {renderViewPlansCTA()}
      {isBuyForTeamsModalActive ? (
        <BuyForTeamsModal
          isVisible={isBuyForTeamsModalActive}
          toggleModal={toggleBuyForTeamsModal}
        />
      ) : null}
    </React.Fragment>
  );
};

export default ActivateSubscription;
