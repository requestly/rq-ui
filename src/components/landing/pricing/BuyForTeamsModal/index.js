import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Modal,
  Row,
  Col,
  Slider,
  InputNumber,
  Form,
  Radio,
  message,
  Space,
} from "antd";
import { store } from "store";
import { getUserAuthDetails, getUserCountry } from "utils/GlobalStoreUtils";
import { getFunctions, httpsCallable } from "firebase/functions";
import { isEmpty } from "lodash";
import { isEmailValid } from "utils/FormattingHelper";
import * as plans from "../../../../config/pricing/plans/plans.json";
import {
  getCurrencySymbol,
  getDaysFromDurationTitle,
  getDefaultCurrencyBasedOnLocation,
} from "../../../../utils/PricingUtils";
import { redirectToCheckout } from "../../../../utils/RedirectionUtils";
import {
  trackCheckoutInitiatedEvent,
  trackCheckoutModalShownEvent,
} from "../../../../utils/analytics/business/checkout";
import APP_CONSTANTS from "../../../../config/constants";
import { getTeamPlanNameFromId } from "../../../../utils/PremiumUtils";

const pricingPlans = plans.default;

const BuyForTeamsModal = ({
  isVisible,
  toggleModal,
  onChoosePlan,
  planName = APP_CONSTANTS.PRICING.PLAN_NAMES.PROFESSIONAL,
  duration = "annual",
  currency = "USD",
}) => {
  const { teamId } = useParams();
  // Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const user = getUserAuthDetails(state);
  const userCountry = getUserCountry(state);
  // Component State
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [usersCount, setUsersCount] = useState(5);
  const [selectedPlan, setSelectedPlan] = useState(planName);
  const [selectedPlanDuration, setSelectedPlanDuration] = useState(duration);
  const [userEmail] = useState(user?.details?.profile?.email || "");
  const [userCurrency, setUserCurrency] = useState(currency);

  const selectedPlanData = pricingPlans.find(
    (plan) => plan.id === selectedPlan.toLowerCase()
  );
  const selectedPlanPrice =
    selectedPlanData[selectedPlanDuration]["price"][userCurrency];

  useEffect(() => {
    setUserCurrency(getDefaultCurrencyBasedOnLocation(userCountry));
  }, [userCountry]);

  useEffect(() => {
    trackCheckoutModalShownEvent();
  }, []);

  const handleCheckout = () => {
    if (onChoosePlan) {
      onChoosePlan(
        APP_CONSTANTS.PRICING.CHECKOUT.MODES.TEAM,
        selectedPlan.toLowerCase(),
        usersCount
      );
      return;
    }
    redirectToCheckout({
      mode: APP_CONSTANTS.PRICING.CHECKOUT.MODES.TEAM,
      planType: getTeamPlanNameFromId(selectedPlan),
      days: getDaysFromDurationTitle(selectedPlanDuration),
      quantity: usersCount,
      teamId: teamId,
    });
  };

  const handleOk = async () => {
    if (isEmpty(userEmail) || !isEmailValid(userEmail)) {
      message.error("Please login");
      return;
    }
    setConfirmLoading(true);
    trackCheckoutInitiatedEvent(selectedPlanDuration, selectedPlan, usersCount);

    const functions = getFunctions();
    const enterprisePlanEnquiry = httpsCallable(
      functions,
      "enterprisePlanEnquiry"
    );

    await enterprisePlanEnquiry({
      userEmail,
      planName: selectedPlan,
      usersCount,
      duration: selectedPlanDuration,
    });

    handleCheckout();
  };

  const handleCancel = () => {
    toggleModal(false);
  };

  return (
    <Modal
      title="Requestly for Developer Teams"
      visible={isVisible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      destroyOnClose={true}
      okText={"Checkout"}
      cancelText="Cancel"
      width={600}
    >
      <Row>
        <Col span={24}>
          <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {/* <Form.Item label="Company Name">
              <Input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                prefix={<GlobalOutlined />}
                placeholder="Ex: Amazon"
              />
            </Form.Item> */}
            {teamId ? (
              <>
                <Form.Item label="Plan Name">
                  <Radio.Group
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                  >
                    <Space>
                      <Radio.Button
                        value={APP_CONSTANTS.PRICING.PLAN_NAMES.BASIC}
                      >
                        Basic
                      </Radio.Button>
                      <Radio.Button
                        value={APP_CONSTANTS.PRICING.PLAN_NAMES.PROFESSIONAL}
                      >
                        Professional
                      </Radio.Button>
                    </Space>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="Bill Duration">
                  <Radio.Group
                    value={selectedPlanDuration}
                    onChange={(e) => setSelectedPlanDuration(e.target.value)}
                  >
                    <Space>
                      <Radio.Button value="monthly">Monthly</Radio.Button>
                      <Radio.Button value="annual">Annual</Radio.Button>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </>
            ) : null}
            <Form.Item label="No. of users">
              <Row align="middle">
                <Col span={20}>
                  <Slider
                    min={2}
                    max={30}
                    onChange={(newCount) => setUsersCount(newCount)}
                    value={usersCount}
                  />
                </Col>
                <Col span={3} offset={1}>
                  <InputNumber
                    min={2}
                    max={30}
                    // style={{ margin: "0 16px" }}
                    value={usersCount}
                    onChange={setUsersCount}
                  />
                </Col>
              </Row>
            </Form.Item>
            {/* <Form.Item label="Your email">
              <Input
                type="email"
                value={userEmail}
                prefix={<MailOutlined />}
                placeholder="Please Login"
                disabled
              />
            </Form.Item> */}
            <Form.Item label="Total">
              <span className="ant-form-text">
                {" "}
                {`${getCurrencySymbol(null, userCurrency)}${
                  +selectedPlanPrice * usersCount
                } for ${usersCount} users`}
              </span>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};

export default BuyForTeamsModal;
