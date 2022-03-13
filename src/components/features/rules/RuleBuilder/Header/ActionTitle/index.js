import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Space, Button } from "antd";
import { CrownTwoTone } from "@ant-design/icons";
// import { useNavigate } from 'react-router-dom';
//UTILS
// import { submitEventUtil } from "../../../../../../utils/AnalyticsUtils";
// import { redirectToPricingPlans } from "../../../../../../utils/RedirectionUtils";
// CONSTANTS;
import { store } from "../../../../../../store";
import { getUserAuthDetails } from "../../../../../../utils/GlobalStoreUtils";
import { isRuleTypeEnabled } from "../../../../../../utils/FeatureManager";
import { redirectToPricingPlans } from "../../../../../../utils/RedirectionUtils";
import APP_CONSTANTS from "../../../../../../config/constants";

const ActionTitle = (props) => {
  const navigate = useNavigate();
  const {
    currentlySelectedRuleConfig,
    // topCountShowRequiredDataObject
  } = props;
  const globalState = useContext(store);
  const { state } = globalState;
  const user = getUserAuthDetails(state);
  const userPlanName =
    user.details?.planDetails?.planName ||
    APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE;

  //DESTRUCTURING OBJECT ATTRIBUTES
  // const {
  //   numOfRulePairsOfUser,
  //   planName,
  //   planRulePairLimit,
  // } = topCountShowRequiredDataObject;

  //CONSTANTS
  // const navigate = useNavigate();

  // // TO NOT SHOW RULE PAIRS COUNT ON MODIFY RESPONSE AND INSERT SCRIPTS RULE
  // const hidePairsModifyResponseAndHeader = () => {
  //   if (
  //     currentlySelectedRuleConfig.TYPE === GLOBAL_CONSTANTS.RULE_TYPES.SCRIPT ||
  //     currentlySelectedRuleConfig.TYPE === GLOBAL_CONSTANTS.RULE_TYPES.RESPONSE
  //   ) {
  //     return true;
  //   }
  //   return false;
  // };

  const renderCrownIcon = () => {
    if (
      !isRuleTypeEnabled(currentlySelectedRuleConfig.TYPE, user, userPlanName)
    ) {
      return (
        <>
          {" (Available basic plan onwards)"}
          <Button
            type="link"
            size="small"
            icon={<CrownTwoTone twoToneColor={"limegreen"} />}
            onClick={() => redirectToPricingPlans(navigate)}
          >
            Upgrade Now
          </Button>
        </>
      );
    }
    return null;
  };

  return (
    <Space className="text-center text-sm-center text-xl-left text-lg-left text-md-left margin-bottom-1-when-xs margin-bottom-1-when-sm">
      <h3 className="mb-0">
        {`${currentlySelectedRuleConfig.NAME} Rule `}
        {renderCrownIcon()}
      </h3>
      {/* <h5> */}
      {/* {planName === "bronze" && !hidePairsModifyResponseAndHeader()
          ? `(${numOfRulePairsOfUser}/${planRulePairLimit} Pairs Used)`
          : null} */}

      {/* Remove Limits Button */}

      {/* {planName === "bronze" ? (
          <Button
            type="text"
            className="text-primary btn btn-link"
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.preventDefault();
              redirectToPricingPlans(navigate);
              //Analytics
              submitEventUtil(
                GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULE_PAIRS,
                GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.REMOVE_LIMIT_CLICKED,
                "remove.limit.clicked@rule.pairs.page",
                numOfRulePairsOfUser
              );
            }}
          >
            Remove Limits
          </Button>
        ) : null} */}
      {/* </h5> */}
    </Space>
  );
};

export default ActionTitle;
