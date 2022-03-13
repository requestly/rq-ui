import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Button, Descriptions, Input, message } from "antd";
// Sub Components
import SpinnerColumn from "../../../../../../misc/SpinnerColumn";
// Firebase
import { getFunctions, httpsCallable } from "firebase/functions";
// Utils
import {
  redirectTo404,
  redirectToUpdateSubscription,
} from "../../../../../../../utils/RedirectionUtils";
import { beautifySubscriptionStatus } from "../../../../../../../utils/PricingUtils";
import { isEmpty } from "lodash";
// ANALYTICS
import { submitEventUtil } from "../../../../../../../utils/AnalyticsUtils";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import { CalendarOutlined, SyncOutlined } from "@ant-design/icons";
import { doc, getFirestore, updateDoc } from "firebase/firestore";

const TRACKING = GLOBAL_CONSTANTS.GA_EVENTS;

const TeamInfo = ({ teamId }) => {
  const navigate = useNavigate();
  const mountedRef = useRef(true);
  const inputRef = useRef(null);

  if (!teamId) redirectTo404(navigate);
  // Component State
  const [name, setName] = useState("");
  const [originalTeamName, setOriginalTeamName] = useState("");
  const [creationTime, setCreationTime] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [
    subscriptionCurrentPeriodEnd,
    setSubscriptionCurrentPeriodEnd,
  ] = useState("");
  const [
    subscriptionCurrentPeriodStart,
    setSubscriptionCurrentPeriodStart,
  ] = useState("");
  const [isTeamInfoLoading, setIsTeamInfoLoading] = useState(false);
  const [renameInProgress, setRenameInProgress] = useState(false);

  const fetchTeamInfo = () => {
    setIsTeamInfoLoading(true);
    const functions = getFunctions();
    const getTeamInfo = httpsCallable(functions, "getTeamInfo");

    getTeamInfo({ teamId: teamId }).then((res) => {
      if (!mountedRef.current) return null;
      const response = res.data;
      if (!response.success) throw new Error(response.message);
      const teamInfo = response.data;
      setName(teamInfo.name);
      setOriginalTeamName(teamInfo.name);
      setCreationTime(
        new Date(teamInfo.creationTime._seconds * 1000).toDateString()
      );
      setSubscriptionStatus(teamInfo.subscriptionStatus);
      setSubscriptionCurrentPeriodStart(
        new Date(teamInfo.subscriptionCurrentPeriodStart * 1000).toDateString()
      );
      setSubscriptionCurrentPeriodEnd(
        new Date(teamInfo.subscriptionCurrentPeriodEnd * 1000).toDateString()
      );
      setIsTeamInfoLoading(false);
    });
  };

  const stableFetchTeamInfo = useCallback(fetchTeamInfo, [teamId]);

  const renderTeamNameLinkText = () => {
    if (renameInProgress) {
      return "(Save)";
    }
    return "(Rename)";
  };

  const handleRenameOnClick = (e) => {
    if (renameInProgress) {
      renameTeamName();
      setRenameInProgress(false);
    } else {
      setRenameInProgress(true);
    }
    e.stopPropagation();
  };

  const renameTeamName = () => {
    const db = getFirestore();
    const teamRef = doc(db, "teams", teamId);

    updateDoc(teamRef, {
      name: name,
    }).catch((err) => {
      console.log(err);
      message.error("Only owner can change the team name");
      setName(originalTeamName);
    });
  };

  useEffect(() => {
    if (renameInProgress) {
      inputRef.current.focus({
        cursor: "end",
      });
    }
  }, [renameInProgress]);

  const renderCardBody = () => {
    return (
      <div style={{ marginTop: "1%" }}>
        <Descriptions title={null} bordered column={2}>
          <Descriptions.Item
            label={
              <>
                <span>
                  {"Team Name "}
                  <Button
                    type="link"
                    style={{ padding: 0 }}
                    onClick={handleRenameOnClick}
                  >
                    {renderTeamNameLinkText()}
                  </Button>
                </span>
              </>
            }
          >
            <Input
              value={name}
              bordered={false}
              disabled={!renameInProgress}
              ref={inputRef}
              onChange={(e) => setName(e.target.value)}
              onPressEnter={handleRenameOnClick}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Created on">
            {creationTime}
          </Descriptions.Item>

          {!subscriptionStatus || isEmpty(subscriptionStatus) ? null : (
            <>
              <Descriptions.Item label="Current Period">{`${subscriptionCurrentPeriodStart} ~ ${subscriptionCurrentPeriodEnd}`}</Descriptions.Item>
              <Descriptions.Item label="Subscription Status">
                {beautifySubscriptionStatus(subscriptionStatus)}
              </Descriptions.Item>
            </>
          )}
        </Descriptions>
      </div>
    );
  };

  const renderLoader = () => {
    return (
      <div>
        <SpinnerColumn customLoadingMessage="Loading Team Info" />
      </div>
    );
  };

  useEffect(() => {
    stableFetchTeamInfo();

    // Cleanup
    return () => {
      mountedRef.current = false;
    };
  }, [stableFetchTeamInfo, teamId]);

  return (
    <div>
      <div>
        <Row>
          <Col span={12}>
            <span>Team Details</span>
          </Col>
          {subscriptionStatus === "active" ? (
            <Col align="right" span={12}>
              <Button
                type="primary"
                onClick={() => {
                  redirectToUpdateSubscription({
                    mode: "team",
                    planType: "enterprise",
                    teamId: teamId,
                  });
                  //Analytics
                  submitEventUtil(
                    TRACKING.CATEGORIES.TEAMS,
                    TRACKING.ACTIONS.CLICKED,
                    `Change Plan button clicked redirected to update subscription`
                  );
                }}
                icon={<CalendarOutlined />}
              >
                Change Plan
              </Button>
            </Col>
          ) : null}
          {subscriptionStatus === "canceled" ||
          subscriptionStatus === "incomplete_expired" ? (
            <Col align="right" span={12}>
              <Button
                type="primary"
                onClick={() => {
                  redirectToUpdateSubscription({
                    mode: "team",
                    planType: "enterprise",
                    teamId: teamId,
                    isRenewal: true,
                  });

                  //Analytics
                  submitEventUtil(
                    TRACKING.CATEGORIES.TEAMS,
                    TRACKING.ACTIONS.CLICKED,
                    `Renew Subscription button clicked redirected to update subscription`
                  );
                }}
                icon={<SyncOutlined />}
              >
                Renew Subscription
              </Button>
            </Col>
          ) : null}
        </Row>
      </div>
      {isTeamInfoLoading ? renderLoader() : renderCardBody()}
    </div>
  );
};

export default TeamInfo;
