import React, { useContext } from "react";
import { Col, Row, Typography } from "antd";
import { store } from "../../../store/index.js";
import { getIfTrialModeEnabled } from "../../../utils/GlobalStoreUtils";
import { Link } from "react-router-dom";
import APP_CONSTANTS from "../../../config/constants/index.js";
import { FcFlashOn } from "react-icons/fc";

const SignUpPremiumOffer = ({ user, appMode, deadline, isMenuFooter }) => {
  // Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const ifTrialModeEnabled = getIfTrialModeEnabled(state);

  const { Text } = Typography;

  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow = new Date(tomorrow.toDateString());

  const renderUpgradeToPremiumText = () => {
    if (isMenuFooter)
      return (
        <>
          <Col>
            <Row align="middle">
              <FcFlashOn size={36} className="remix-icon hp-mr-8" />

              <div>
                <span className="hp-d-block hp-text-color-black-100 hp-text-color-dark-0 hp-p1-body">
                  Unlock all features
                </span>

                <Link
                  to={APP_CONSTANTS.PATHS.PRICING.ABSOLUTE}
                  className="hp-badge-text hp-text-color-dark-30"
                >
                  Upgrade now
                </Link>
              </div>
            </Row>
          </Col>
        </>
      );

    return (
      <Link
        to={APP_CONSTANTS.PATHS.PRICING.ABSOLUTE}
        className="hp-badge-text orange-color"
      >
        💎 Upgrade to Premium
      </Link>
    );
  };

  return (
    <div
      style={{
        maxWidth: "30ch",
        textAlign: "center",
        padding: "0.5rem 0",
        fontSize: "0.8rem",
      }}
    >
      {ifTrialModeEnabled ? (
        <Text className="cursor-pointer">
          💎 Sign up to start 7 days free trial during which you can access all
          our features.
        </Text>
      ) : (
        renderUpgradeToPremiumText()
      )}
    </div>
  );
};

export default SignUpPremiumOffer;
