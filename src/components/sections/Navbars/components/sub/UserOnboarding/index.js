import React, { useContext, useRef, useState, useEffect } from "react";
import { Button, Tooltip } from "reactstrap";
import { BsCardChecklist } from "react-icons/bs";
import { redirectToOnboardingPage } from "utils/RedirectionUtils";
import { useNavigate } from "react-router-dom";
//STORE
import { store } from "../../../../../../store";
//UTILS
import * as GlobalStoreUtils from "../../../../../../utils/GlobalStoreUtils";
import DataStoreUtils from "../../../../../../utils/DataStoreUtils";
import { getDateAfterAddingSomeDaysInUserSignupDate } from "../../../../../../utils/DateTimeUtils";
import { submitEventUtil } from "../../../../../../utils/AnalyticsUtils";
// CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";

const UserOnboarding = () => {
  const mountedRef = useRef(true);
  const navigate = useNavigate();
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const user = GlobalStoreUtils.getUserAuthDetails(state);
  //Component State
  const [showOnboardingInSidebar, setShowOnboardingInSidebar] = useState(false);
  //showing tooltip on the very first visit to rules page only
  const [showOnboardingTooltip, setShowOnboardingTooltip] = useState(false);

  //To fetch all sign up date from firebase
  useEffect(() => {
    //  Fetch user attributes
    if (user && user.details.profile && user.details) {
      DataStoreUtils.getValue(["customProfile", user.details.profile.uid]).then(
        (attributesRef) => {
          // console.log(attributesRef);
          if (attributesRef) {
            setShowOnboardingInSidebar(
              getDateAfterAddingSomeDaysInUserSignupDate(
                attributesRef.signup.signup_date,
                GLOBAL_CONSTANTS.ONBOARDING_DAYS_TO_EXPIRE
              )
            );
            if (!attributesRef.attributes.hasInitiallyVisited) {
              if (window.location.pathname === "/rules") {
                setShowOnboardingTooltip(true);
                DataStoreUtils.setValue(
                  [
                    "customProfile",
                    user.details.profile.uid,
                    "attributes",
                    "hasInitiallyVisited",
                  ],
                  true
                );
              }
            } else setShowOnboardingTooltip(false);
          }
          if (!mountedRef.current) return null;
          // console.log(attributesRef);
        }
      );
      // Cleanup
      return () => {
        mountedRef.current = false;
      };
    } // eslint-disable-next-line
  }, [user, window.location.pathname]);

  return (
    <>
      {showOnboardingInSidebar ? (
        <>
          <Tooltip
            placement="bottom"
            isOpen={showOnboardingTooltip}
            target="tooltip"
          >
            Click here to get started.
          </Tooltip>
          <Button
            id="tooltip"
            className="btn-icon bg-transparent btn-3 has-no-box-shadow"
            color="primary"
            size="sm"
            type="button"
            onClick={() => {
              //Analytics
              submitEventUtil(
                GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.ONBOARDING,
                GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.CLICKED,
                `clicked on getting started button on dashboard navbar`
              );
              return redirectToOnboardingPage(navigate);
            }}
          >
            <span className="btn-inner--icon">
              <BsCardChecklist className="fix-icon-is-down" />
            </span>

            <span className="ml-2 mr-4 text-sm font-weight-bold">
              Getting Started
            </span>
          </Button>
        </>
      ) : null}
    </>
  );
};

export default UserOnboarding;
