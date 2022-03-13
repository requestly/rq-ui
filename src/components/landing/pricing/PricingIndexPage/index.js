import React, { useEffect, useContext } from "react";
import { Card, Row } from "reactstrap";
import { store } from "store";
import { getUserAuthDetails, getAppTheme } from "utils/GlobalStoreUtils";
import { getEmailType } from "../../../../utils/FormattingHelper";
// import {
//   defaultCurrency,
//   getDefaultCurrencyBasedOnLocation,
// } from "../../../../utils/PricingUtils";
// import plans from "../../../../config/pricing/plans/plans.json";
//SUB COMPONENTS
import PricingTable from "../PricingTable";
import CompanyLogo from "../CompanyLogo";
import PricingFAQs from "../FAQs";
// import ChinaPaymentCard from "../ChinaPaymentCard";
// ICONS
import { FaStripe } from "react-icons/fa";
import ProCard from "@ant-design/pro-card";
import { getFunctions, httpsCallable } from "firebase/functions";
// import APP_CONSTANTS from "../../../../config/constants";
// // import RepresentLitePlan from "../RepresentLitePlan";
import CustomerStory from "../CustomerStory/index";
import ChromeStoreStats from "../ChromeStoreStats/index";
import { useMediaQuery } from "react-responsive";
import { customerStoryData } from "utils/PricingPageTestimonials";

// const litePlanPrice = plans.find(
//   (plan) => plan.id === APP_CONSTANTS.PRICING.PLAN_NAMES.LITE
// ).monthly.price;

// const DEFAULT_COUNTRY = "US";

// const litePlanVisibleCountry = [
//   "IN",
//   "CN",
//   "BR",
//   "GB",
//   "FR",
//   "DE",
//   "RU",
//   "JP",
//   "VN",
//   "PL",
//   "ES",
// ];

const PricingIndexPage = () => {
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const user = getUserAuthDetails(state);
  const appTheme = getAppTheme(state);
  //Component State
  // const [currency, setCurrency] = useState(defaultCurrency);
  // const [country, setCountry] = useState(DEFAULT_COUNTRY);
  // const [isLitePlanVisible, setIsLitePlanVisible] = useState(false);

  // useEffect(() => {
  //   fetch("https://api.country.is/")
  //     .then((res) => {
  //       if (res.status === 200) {
  //         res.json().then((location) => {
  //           setCountry(location.country);
  //           if (location.country === "IN") {
  //             const selectedCurrency = getDefaultCurrencyBasedOnLocation(
  //               location.country
  //             );
  //             setCurrency(selectedCurrency);
  //           } else {
  //             setCurrency(defaultCurrency);
  //           }
  //         });
  //       }
  //     })
  //     .catch((err) => {
  //       setCurrency(defaultCurrency);
  //     });
  // }, []);

  useEffect(() => {
    const functions = getFunctions();
    const pricingPage = httpsCallable(functions, "pricingPageViews");
    if (user.loggedIn) {
      fetch("https://api.country.is/").then((res) => {
        if (res.status === 200) {
          res.json().then((location) => {
            pricingPage({
              email: user.details.profile.email,
              emailType: getEmailType(user.details.profile.email),
              country: location.country,
            });
          });
        }
      });
    }
  }, [user]);

  // useEffect(() => {
  //   if (litePlanVisibleCountry.includes(country)) {
  //     setIsLitePlanVisible(true);
  //   }
  // }, [country]);

  const xl = useMediaQuery({ minWidth: 1224 });
  const md = useMediaQuery({ minWidth: 768 });

  return (
    <React.Fragment>
      <ProCard className="primary-card github-like-border">
        <Row>
          <div className="col text-center">
            <Card className="shadow">
              <PricingTable />
              <div style={{ textAlign: "center" }}>
                {/* <h4
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    color: "grey",
                  }}
                >
                  Have a coupon code? You can apply on checkout.
                </h4> */}
                <h4
                  style={{
                    color: "grey",
                  }}
                >
                  All paid plans come with a 15-day money back guarantee. Prices
                  inclusive of tax. Secure payment by &nbsp;
                  <FaStripe
                    className="pricing-icon"
                    size="2rem"
                    style={{ transform: "translate(0%, 35%)" }}
                  />
                </h4>
                <br />
                {/* <ChinaPaymentCard /> */}
                {/* <div style={{ display: "flex", justifyContent: "center" }}>
                  {isLitePlanVisible ? (
                    
                  ) : null}
                </div> */}
                <br />
                <ChromeStoreStats />
                <h2>Trusted by developer teams from 500+ organizations</h2>
                <CompanyLogo appTheme={appTheme.toUpperCase()} />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: xl
                      ? "repeat(3, 29%)"
                      : md
                      ? "repeat(2, 1fr)"
                      : "1fr",
                    justifyContent: "center",
                    gap: "1rem",
                  }}
                >
                  {customerStoryData.map((data) => (
                    <CustomerStory {...data} key={data.companyName} />
                  ))}
                </div>
              </div>
              <br />
              <br />
              <PricingFAQs />
            </Card>
          </div>
        </Row>
      </ProCard>
    </React.Fragment>
  );
};
export default PricingIndexPage;
