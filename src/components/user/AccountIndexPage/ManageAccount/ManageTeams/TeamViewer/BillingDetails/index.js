import React, { useCallback, useEffect, useRef, useState } from "react";

import { Col, Row, Card, Button } from "antd";
// Sub Components
import InvoiceTable from "./InvoiceTable";
import ActivateSubscription from "./ActivateSubscription";
import SpinnerColumn from "../../../../../../misc/SpinnerColumn";
// Firebase
import { getFunctions, httpsCallable } from "firebase/functions";
import { toast } from "utils/Toast.js";

// UTILS
import { redirectToUpdatePaymentMethod } from "../../../../../../../utils/RedirectionUtils";
import { CreditCardOutlined } from "@ant-design/icons";

// Common Component for Team & Individual Payments
const BillingDetails = ({ teamId }) => {
  const mountedRef = useRef(true);
  // Component State
  const [subscriptionInfo, setSubscriptionInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchSubscriptionInfo = () => {
    setIsLoading(true);
    const functions = getFunctions();
    const getTeamSubscriptionInfo = httpsCallable(
      functions,
      "getTeamSubscriptionInfo"
    );

    getTeamSubscriptionInfo({
      teamId: teamId,
    })
      .then((res) => {
        if (!mountedRef.current) return null;
        setSubscriptionInfo(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!mountedRef.current) return null;
        toast.error(
          "You might not have permission to manage the team members."
        );
        setIsLoading(false);
      });
  };

  const stableFetchSubscriptionInfo = useCallback(fetchSubscriptionInfo, [
    teamId,
  ]);

  const renderBillingDetails = () => {
    return (
      <Card
        title="Billing"
        extra={
          subscriptionInfo.subscriptionStatus ? (
            <Col>
              <Button
                type="primary"
                onClick={() =>
                  redirectToUpdatePaymentMethod({
                    mode: "team",
                    teamId: teamId,
                  })
                }
                icon={<CreditCardOutlined />}
              >
                Update Payment Method
              </Button>
            </Col>
          ) : null
        }
      >
        {subscriptionInfo.subscriptionStatus ? (
          <InvoiceTable mode="team" teamId={teamId} />
        ) : (
          <ActivateSubscription teamId={teamId} />
        )}
      </Card>
    );
  };

  useEffect(() => {
    stableFetchSubscriptionInfo();
    return () => {
      mountedRef.current = false;
    };
  }, [stableFetchSubscriptionInfo]);

  return (
    <React.Fragment>
      <Row>
        <Col span={24}>
          {isLoading ? (
            <SpinnerColumn customLoadingMessage="Fetching subscription" />
          ) : (
            renderBillingDetails()
          )}
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default BillingDetails;
