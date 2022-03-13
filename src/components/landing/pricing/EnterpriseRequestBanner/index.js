import React, { useState, useEffect } from "react";
import { Row, Col, Alert } from "antd";
import { toast } from "utils/Toast.js";
//Firebase
import { getFunctions, httpsCallable } from "firebase/functions";
// UTILS
import { submitEventUtil } from "../../../../utils/AnalyticsUtils";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import { LoadingOutlined } from "@ant-design/icons";
const TRACKING = GLOBAL_CONSTANTS.GA_EVENTS;

export default function EnterpriseRequestBanner({ user }) {
  const [enterpriseContactDetails, setEnterpriseContactDetails] = useState({});
  const [enterpriseRequestedState, setEnterpriseRequestedState] = useState(0); // 1 is clicked, 2 is sent

  // FIREBASE FUNCTIONS
  const functions = getFunctions();
  const getEnterpriseAdminDetails = httpsCallable(
    functions,
    "getEnterpriseAdminDetails"
  );
  const requestEnterprisePlanFromAdmin = httpsCallable(
    functions,
    "requestEnterprisePlanFromAdmin"
  );

  function requestPremiumToAdmin() {
    setEnterpriseRequestedState(1);
    const enterpriseAdmin = enterpriseContactDetails.data.enterpriseData.admin;
    const domain = enterpriseAdmin.email.split("@")[1];
    requestEnterprisePlanFromAdmin({
      userEmail: user.details.profile.email,
      adminEmail: enterpriseAdmin.email,
      adminName: enterpriseAdmin.name,
    })
      .then(() => {
        submitEventUtil(
          TRACKING.CATEGORIES.PRICING,
          TRACKING.ACTIONS.REQUEST_ADMIN,
          `${domain} enterprise requested`
        );
        setEnterpriseRequestedState(2);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Unable to send email");
        toast.info(`Contact directly at: ${enterpriseAdmin.email}`);
      });
  }

  useEffect(() => {
    if (user.details.isLoggedIn) {
      if (Object.keys(enterpriseContactDetails).length === 0) {
        getEnterpriseAdminDetails({
          email: user.details.profile.email,
        }).then((response) => {
          setEnterpriseContactDetails(response);
        });
      }
    }
  });

  return (
    <React.Fragment>
      {enterpriseContactDetails &&
      enterpriseContactDetails.data &&
      enterpriseContactDetails.data.success ? (
        enterpriseRequestedState === 1 ? (
          <>
            <br />
            <Row>
              <Col span={24} align="center">
                <LoadingOutlined />
              </Col>
            </Row>
            <br />
          </>
        ) : (
          <>
            <br />
            <Row>
              <Col className="" sm="12" span={14} offset={5} align="center">
                {enterpriseRequestedState === 2 ? (
                  <Alert
                    type="success"
                    showIcon
                    color="primary"
                    message={
                      <>
                        {
                          enterpriseContactDetails.data.enterpriseData.admin
                            .name
                        }{" "}
                        has been notified. Please get in touch with them for
                        further details.
                      </>
                    }
                  ></Alert>
                ) : (
                  <Alert
                    type="info"
                    showIcon
                    message={
                      <>
                        Your organization is already on Requestly Enterprise
                        Plan managed by{" "}
                        {
                          enterpriseContactDetails.data.enterpriseData.admin
                            .name
                        }
                        .{" "}
                        <span
                          onClick={requestPremiumToAdmin}
                          className="text-light"
                          style={{
                            cursor: "pointer",
                            fontWeight: "bolder",
                          }}
                        >
                          Click here
                        </span>{" "}
                        to request Premium subscription for you.
                      </>
                    }
                  ></Alert>
                )}
              </Col>
            </Row>
            <br />
          </>
        )
      ) : null}
    </React.Fragment>
  );
}
