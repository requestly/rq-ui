import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProCard from "@ant-design/pro-card";
import { Button } from "antd";
//STORE
import { store } from "../../../../../store";
// UTILS
import * as GlobalStoreUtils from "../../../../../utils/GlobalStoreUtils";
import { redirectToPersonalSubscription } from "../../../../../utils/RedirectionUtils";
// SUB COMPONENTS
import GetASubscription from "./GetASubscription";
import SubscriptionInfo from "./SubscriptionInfo";

const ActiveLicenseInfo = ({
  hideShadow,
  customHeading,
  hideManagePersonalSubscriptionButtion,
  hideIfSubscriptionIsPersonal,
  hideIfNoSubscription,
}) => {
  const navigate = useNavigate();
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const user = GlobalStoreUtils.getUserAuthDetails(state);
  // Component State
  const [planName, setPlanName] = useState(false);
  const [status, setStatus] = useState(false);
  const [type, setType] = useState(false);
  const [validFrom, setValidFrom] = useState(false);
  const [validTill, setValidTill] = useState(false);
  const [subscriptionDoesNotExist, setSubscriptionDoesNotExist] = useState(
    false
  );

  const renderSubscriptionInfo = () => {
    return (
      <SubscriptionInfo
        hideShadow={hideShadow}
        hideManagePersonalSubscriptionButtion={
          hideManagePersonalSubscriptionButtion
        }
        subscriptionDetails={{
          validFrom,
          validTill,
          status,
          type,
          planName,
        }}
      />
    );
  };

  const renderGetASubscription = () => {
    return <GetASubscription hideShadow={hideShadow} />;
  };

  const ManageSubscritionBtn = () => {
    return (
      <span style={{ textAlign: "center" }}>
        <Button
          type="link"
          size="small"
          onClick={() => redirectToPersonalSubscription(navigate)}
        >
          Manage Subscriptions
        </Button>
      </span>
    );
  };

  useEffect(() => {
    if (
      user.details &&
      user.details.planDetails &&
      user.details.planDetails.status
    ) {
      setStatus(user.details.planDetails.status);
      setType(user.details.planDetails.type);
      setPlanName(user.details.planDetails.planName);
      setValidFrom(user.details.planDetails.subscription.startDate);
      setValidTill(user.details.planDetails.subscription.endDate);
    } else {
      setSubscriptionDoesNotExist(true);
    }
  }, [user]);

  if (!user) {
    return <React.Fragment></React.Fragment>;
  }

  if (
    (hideIfSubscriptionIsPersonal &&
      user &&
      user.details &&
      user.details.planDetails &&
      user.details.planDetails.type === "individual") ||
    (hideIfNoSubscription && subscriptionDoesNotExist)
  ) {
    return <React.Fragment></React.Fragment>;
  }

  return (
    <ProCard
      title={<h3 style={{ marginBottom: "0" }}>{customHeading}</h3>}
      headerBordered
      bordered
      extra={
        hideManagePersonalSubscriptionButtion ? null : <ManageSubscritionBtn />
      }
    >
      {status && type && validFrom && validTill && !subscriptionDoesNotExist
        ? renderSubscriptionInfo()
        : renderGetASubscription()}
    </ProCard>
  );
};

export default ActiveLicenseInfo;
