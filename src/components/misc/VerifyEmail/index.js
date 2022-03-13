import React, { useState, useEffect, useContext } from "react";
// import { Redirect } from "react-router-dom";
import { Col, Row, Container, Card, Button, CardBody } from "reactstrap";
// SUB COMPONENT
import LoginRequiredCTA from "../../authentication/LoginRequiredCTA";
import RedirectWithTimer from "../../misc/RedirectWithTimer";
//STORE
import { store } from "../../../store";
//UTILS
import { getUserAuthDetails } from "../../../utils/GlobalStoreUtils";
import {
  setEmailVerified,
  checkVerificationCode,
  resendVerificationEmailHandler,
} from "../../../utils/AuthUtils";
import { getQueryParamsAsMap } from "../../../utils/URLUtils";
import { submitEventUtil } from "utils/AnalyticsUtils";
// CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import APP_CONSTANTS from "../../../config/constants";
import Jumbotron from "components/bootstrap-legacy/jumbotron";
const TRACKING = GLOBAL_CONSTANTS.GA_EVENTS;
const { PATHS } = APP_CONSTANTS;

const VerifyEmail = () => {
  //Component State
  const [continueUrl, setContinueUrl] = useState(null);
  const [verified, setVerified] = useState(false);
  const [checkedActionCode, setCheckedActionCode] = useState(false);
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const user = getUserAuthDetails(state);

  useEffect(() => {
    const params = getQueryParamsAsMap();
    if (params[`oobCode`] && !checkedActionCode && user.loggedIn) {
      setCheckedActionCode(true);
      setContinueUrl(params["continueUrl"]);
      checkVerificationCode(params["oobCode"])
        .then((resp) => {
          setVerified(true);
          setEmailVerified(user.details.profile.uid, true);
          // ANALYTICS
          // Event label = event category _ event action
          submitEventUtil(
            TRACKING.CATEGORIES.USER,
            TRACKING.ACTIONS.EMAIL_VERIFICATION_SUCCESSFUL,
            `${TRACKING.CATEGORIES.USER}_${TRACKING.ACTIONS.EMAIL_VERIFICATION_SUCCESSFUL}`
          );
        })
        .catch((err) => {
          console.log(err);
          setVerified(false);

          // ANALYTICS
          // Event label = event category _ event action
          submitEventUtil(
            TRACKING.CATEGORIES.USER,
            TRACKING.ACTIONS.EMAIL_VERIFICATION_FAILED,
            `${TRACKING.CATEGORIES.USER}_${TRACKING.ACTIONS.EMAIL_VERIFICATION_FAILED}`
          );
        });
    }
  }, [user.loggedIn, user.details, checkedActionCode, verified]);

  return (
    <React.Fragment>
      {user.loggedIn ? (
        <Container className=" mt--7 sm-margin-top-negative-3" fluid>
          <Row>
            <Col>
              <Card className="shadow">
                <CardBody>
                  <Jumbotron
                    style={{ background: "transparent" }}
                    className="text-center"
                  >
                    {verified && continueUrl ? (
                      <div>
                        <h5 className="title is-6">
                          Your Email has been Verified.
                        </h5>
                        {/* <RedirectHomeAfterDelay delay={3} /> */}
                        <RedirectWithTimer
                          delay={3}
                          path={PATHS.RULES.RELATIVE}
                          message="Redirecting you to home"
                        />
                      </div>
                    ) : (
                      <div>
                        <h5 className="title is-6">
                          Oops! Looks like the email verification link is
                          invalid or expired.
                        </h5>
                        <Button
                          className="btn-icon btn-3"
                          color="primary"
                          type="button"
                          onClick={resendVerificationEmailHandler}
                        >
                          Resend Verification email
                        </Button>
                      </div>
                    )}
                  </Jumbotron>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      ) : (
        <LoginRequiredCTA />
      )}
    </React.Fragment>
  );
};
export default VerifyEmail;
