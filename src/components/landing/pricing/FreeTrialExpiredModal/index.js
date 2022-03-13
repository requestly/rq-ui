import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Modal, Row } from "antd";
import ProCard from "@ant-design/pro-card";
import Jumbotron from "../../../bootstrap-legacy/jumbotron";
import { redirectToPricingPlans } from "../../../../utils/RedirectionUtils";
import { getToggleActiveModalActionObject } from "../../../../store/action-objects";
import { store } from "../../../../store";
import {
  trackTrialModeExpiredModalShown,
  trackUpgradeButtonClickedOnTrialExpiredModal,
} from "../../../../utils/analytics/business/trial-mode";

const FreeTrialExpiredModal = ({ isOpen, closable = false }) => {
  const navigate = useNavigate();

  const globalState = useContext(store);
  const { dispatch } = globalState;

  useEffect(() => {
    trackTrialModeExpiredModalShown();
  }, []);

  return (
    <Modal
      visible={isOpen}
      footer={null}
      closable={closable}
      onCancel={null}
      onClose={null}
    >
      <>
        <ProCard className="primary-card github-like-border">
          <Row style={{ textAlign: "center" }} align="center">
            <Col span={24}>
              <Jumbotron className="text-center">
                <h1 className="display-3">Your free trial is over.</h1>
                <p className="lead">
                  <span style={{ cursor: "auto", fontWeight: "bold" }}>
                    Please upgrade
                  </span>{" "}
                  to continue using Requestly.
                  <br />
                  Our Prices start as low as $5/month.
                </p>
                <Button
                  type="primary"
                  onClick={() => {
                    trackUpgradeButtonClickedOnTrialExpiredModal();
                    redirectToPricingPlans(navigate);
                    dispatch(
                      getToggleActiveModalActionObject(
                        "freeTrialExpiredModal",
                        false
                      )
                    );
                  }}
                >
                  Upgrade Now
                </Button>
              </Jumbotron>
            </Col>
          </Row>
        </ProCard>
      </>
    </Modal>
  );
};

export default FreeTrialExpiredModal;
