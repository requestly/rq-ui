import React from "react";

import { Navigate } from "react-router-dom";
// import { useNavigate } from 'react-router-dom';
// import { Row, Col, Container, Card, CardBody, Jumbotron } from "reactstrap";
// import { isEmpty } from "lodash";
// import { toast } from "utils/Toast.js";
// // Components
// import MiniPricingTable from "../../user/AccountIndexPage/ManageAccount/ManageTeams/TeamViewer/BillingDetails/ActivateSubscription/MiniPricingTable";
// import SpinnerColumn from "../..//misc/SpinnerColumn";
// // Store
// import { store } from "../../../store";
// // UTILS
// import { getUserAuthDetails } from "../../../utils/GlobalStoreUtils";
// import DataStoreUtils from "../../../utils/DataStoreUtils";
// import * as RedirectionUtils from "../../../utils/RedirectionUtils";
// import {
//   getPlanInfoFromRQPriceId,
//   getDurationUnitFromDays,
//   getDefaultCurrencyBasedOnLocation,
//   getCurrencySymbol,
// } from "../../../utils/PricingUtils";
// // CONSTANTS
// import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import APP_CONSTANTS from "../../../config/constants";
// // FIREBASE
// import firebase from "../../../firebase";
// // ICONS
// import { FaSpinner } from "react-icons/fa";
// //STATIC
// import goodbyeGIF from "../../../assets/img/illustrations/goodbye.gif";

// const UpdateSubscription = () => {
//   const navigate = useNavigate();
//   const mountedRef = useRef(true);
//   const urlParams = new URLSearchParams(window.location.search);
//   const mode = urlParams.get("m"); // mode -> Defines what type of subscription we`re processing i.e. for the invididual or a team. Accepted values: "individual", "team"
//   const teamId = urlParams.get("t");
//   const planType = urlParams.get("p");
//   const isRenewal = urlParams.get("r");
//   //GLOBAL STATE
//   const globalState = useContext(store);
//   const { state } = globalState;
//   const user = getUserAuthDetails(state);
//   // Component State
//   const [isProcessingCancellation, setIsProcessingCancellation] = useState(
//     false
//   );
//   const [showCancellationInfo, setShowCancellationInfo] = useState(false);
//   const [userName, setUserName] = useState("");
//   const [currentSubscriptionEndDate, setCurrentSubscriptionEndDate] = useState(
//     false
//   );
//   const [currentPlanInfo, setCurrentPlanInfo] = useState(false);
//   const [currency, setCurrency] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [
//     isUpdateSubscriptionAllowed,
//     setIsUpdateSubscriptionAllowed,
//   ] = useState(false);
//   const [reasonForNotAllowed, setReasonForNotAllowed] = useState(
//     "not-team-owner"
//   );
//   const [isCancelAlreadyPending, setIsCancelAlreadyPending] = useState(false);

//   if (
//     !planType ||
//     !(mode === "individual" || mode === "team") ||
//     (mode === "team" ? typeof teamId !== "string" : false)
//   ) {
//     toast.warn("URL seems expired");
//     RedirectionUtils.redirectTo404(navigate);
//   }

//   const fetchTeamInfo = () => {
//     const getTeamInfo = firebase.functions().httpsCallable("getTeamInfo");

//     getTeamInfo({ teamId: teamId })
//       .then((res) => {
//         if (!mountedRef.current) return null;
//         const response = res.data;
//         if (!response.success) throw new Error(response.message);
//         const teamInfo = response.data;
//         if (teamInfo.subscriptionStatus === "active") {
//           const incomingPlanInfo = getPlanInfoFromRQPriceId(teamInfo.plan);
//           if (incomingPlanInfo) setCurrentPlanInfo(incomingPlanInfo);

//           setCurrentSubscriptionEndDate(
//             new Date(
//               teamInfo.subscriptionCurrentPeriodEnd * 1000
//             ).toDateString()
//           );
//         }
//         if (teamInfo.cancel_at_period_end)
//           setIsCancelAlreadyPending(teamInfo.cancel_at_period_end);
//         const { owner: ownerId } = teamInfo;
//         if (ownerId && user && user.details && user.details.profile) {
//           setIsUpdateSubscriptionAllowed(user.details.profile.uid === ownerId);
//           setIsLoading(false);
//         } else {
//           setIsUpdateSubscriptionAllowed(false);
//           setIsLoading(false);
//         }
//       })
//       .catch((err) => {
//         if (!mountedRef.current) return null;
//         if (err) {
//           setIsUpdateSubscriptionAllowed(false);
//           setIsLoading(false);
//         }
//       });
//   };

//   const stableFetchTeamInfo = useCallback(fetchTeamInfo, [teamId, mode, user]);

//   const fetchIndividualUserSubscriptionDetails = () => {
//     const fetchIndividualUserSubscriptionDetailsFF = firebase
//       .functions()
//       .httpsCallable("fetchIndividualUserSubscriptionDetails");

//     fetchIndividualUserSubscriptionDetailsFF()
//       .then((res) => {
//         if (!mountedRef.current) return null;
//         if (res.data.success === false) {
//           toast.error(res.data.message);
//           RedirectionUtils.redirectTo404(navigate);
//         }
//         const userSubscriptionDetails = res.data.data;
//         if (userSubscriptionDetails.status === "active") {
//           const incomingPlanInfo = getPlanInfoFromRQPriceId(
//             userSubscriptionDetails.rqPlanId
//           );
//           if (incomingPlanInfo) setCurrentPlanInfo(incomingPlanInfo);
//           if (userSubscriptionDetails.cancel_at_period_end)
//             setIsCancelAlreadyPending(
//               userSubscriptionDetails.cancel_at_period_end
//             );
//           setCurrentSubscriptionEndDate(
//             new Date(userSubscriptionDetails.endDate * 1000).toDateString()
//           );
//           setIsUpdateSubscriptionAllowed(true);
//           setIsLoading(false);
//         } else if (isRenewal) {
//           setIsUpdateSubscriptionAllowed(true);
//           setIsLoading(false);
//         } else {
//           setIsUpdateSubscriptionAllowed(false);
//           setReasonForNotAllowed("no-plan-active");
//           setIsLoading(false);
//         }
//       })
//       .catch((err) => {
//         if (!mountedRef.current) return null;
//         setIsUpdateSubscriptionAllowed(false);
//         setIsLoading(false);
//       });
//   };

//   const stableFetchIndividualSubscriptionData = useCallback(
//     fetchIndividualUserSubscriptionDetails,
//     [mode, user]
//   );

//   const fetchCurrency = () => {
//     fetch("https://api.country.is/")
//       .then((res) => {
//         if (!mountedRef.current) return null;
//         if (res.status === 200) {
//           res.json().then((location) => {
//             if (location.country) {
//               const newCurrency = getDefaultCurrencyBasedOnLocation(
//                 location.country
//               );
//               if (newCurrency) setCurrency(newCurrency);
//             }
//           });
//         }
//       })
//       .catch((err) => {
//         if (!mountedRef.current) return null;
//       });
//   };

//   const stableFetchCurrency = useCallback(fetchCurrency, []);

//   const doCancelSubscription = () => {
//     setIsProcessingCancellation(true);
//     const firebaseFunctionToCall =
//       mode === "individual"
//         ? "cancelIndividualSubscriptionOnPlanEndDate"
//         : "cancelTeamSubscriptionOnPlanEndDate";

//     const cancelSubscription = firebase
//       .functions()
//       .httpsCallable(firebaseFunctionToCall);

//     cancelSubscription({
//       teamId: teamId ? teamId : null,
//     })
//       .then((res) => {
//         if (!mountedRef.current) return null;
//         const response = res.data;
//         if (response.success) {
//           RedirectionUtils.redirectToAccountDetails(navigate, true);
//         } else {
//           setIsProcessingCancellation(false);
//           toast.error(response.message);
//         }
//       })
//       .catch((err) => {
//         if (!mountedRef.current) return null;
//         setIsProcessingCancellation(false);
//         toast.error(err.message);
//       });
//   };

//   const renderCancellationBox = () => {
//     if (isCancelAlreadyPending)
//       return (
//         <React.Fragment>
//           <p>
//             Your subsciption is already set to be cancelled on{" "}
//             {currentSubscriptionEndDate}.
//           </p>
//         </React.Fragment>
//       );

//     return (
//       <React.Fragment>
//         <h3>We don't want you to go.</h3>
//         <br />
//         <img src={goodbyeGIF} width="200px" alt="We will miss you!" />
//         <br />
//         <br />
//         <p>
//           {isEmpty(userName) ? "We" : `${userName.split(" ")[0]}, we`} are sad
//           that Requestly did not meet your expectations. Please write to us at{" "}
//           <a href={`mailto:${GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL}`}>
//             {GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL}
//           </a>{" "}
//           and we'll do all we can to make sure that you have a positive
//           experience moving forward or continue below if you still want to
//           cancel the subscription.
//         </p>
//         <br />
//         <p>
//           {currentPlanInfo.days && currency ? (
//             <React.Fragment>
//               Your current subscription is {getCurrencySymbol(null, currency)}
//               {currentPlanInfo.price[currency]} per{" "}
//               {getDurationUnitFromDays(currentPlanInfo.days)}
//             </React.Fragment>
//           ) : null}
//           {". "}
//           {currentSubscriptionEndDate ? (
//             <React.Fragment>
//               Cancellation will stop the subscription on{" "}
//               {currentSubscriptionEndDate} (end of the current billing period)
//             </React.Fragment>
//           ) : null}{" "}
//           and no renewal payment will be charged.
//         </p>
//         <p className="text-danger">
//           Are you sure you want to cancel your subscription?
//         </p>
//         <button
//           className="btn btn-danger mr-3"
//           disabled={isProcessingCancellation}
//           onClick={() => doCancelSubscription()}
//         >
//           {isProcessingCancellation ? (
//             <React.Fragment>
//               <FaSpinner className="icon-spin" /> Please wait
//             </React.Fragment>
//           ) : (
//             <React.Fragment>
//               Yes, I want to cancel the subscription
//             </React.Fragment>
//           )}
//         </button>
//         <button className="btn btn-seconday mr-3" disabled={false}>
//           No
//         </button>
//       </React.Fragment>
//     );
//   };

//   const renderNewPlanChooser = () => {
//     return (
//       <React.Fragment>
//         <div className="container text-center">
//           <h4>Choose New Plan</h4>
//           <MiniPricingTable
//             isNewSubscription={false}
//             teamId={teamId}
//             mode={mode}
//             isRenewal={isRenewal && isRenewal === "true"}
//           />
//         </div>
//         <Row>
//           <Col className="text-center">
//             {isRenewal && isRenewal === "true" ? null : showCancellationInfo ? (
//               renderCancellationBox()
//             ) : (
//               <button
//                 type="button"
//                 className="btn  btn-outline-primary"
//                 onClick={() => setShowCancellationInfo(true)}
//               >
//                 Cancel Subscription
//               </button>
//             )}
//           </Col>
//         </Row>
//       </React.Fragment>
//     );
//   };

//   const renderLoader = () => {
//     return <SpinnerColumn />;
//   };

//   const renderUpdatePlanNowAllowed = () => {
//     switch (reasonForNotAllowed) {
//       case "no-plan-active":
//         return (
//           <Jumbotron
//             style={{ background: "transparent" }}
//             className="text-center"
//           >
//             <p>
//               You don't seem have an active premium plan. Please activate your
//               current subscription and then try changing the plan.
//             </p>
//             <p>
//               Need help? Contact us at{" "}
//               <a href={"mailto:" + GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL}>
//                 {GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL}
//               </a>
//             </p>
//           </Jumbotron>
//         );

//       default:
//         return (
//           <Jumbotron
//             style={{ background: "transparent" }}
//             className="text-center"
//           >
//             <p>Only the team owner can update the subscriprion plan.</p>
//             <p>
//               Need help? Contact us at{" "}
//               <a href={"mailto:" + GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL}>
//                 {GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL}
//               </a>
//             </p>
//           </Jumbotron>
//         );
//     }
//   };

//   useEffect(() => {
//     //  Fetch user profile
//     DataStoreUtils.getValue(["users", user.details.profile.uid]).then(
//       (userRef) => {
//         if (!mountedRef.current) return null;
//         const { profile } = userRef;
//         if (profile) {
//           //  Name
//           profile["displayName"] && setUserName(profile["displayName"]);
//         }
//       }
//     );

//     // Cleanup
//     return () => {
//       mountedRef.current = false;
//     };
//   }, [user]);

//   useEffect(
//     () => {
//       // Fetch currency
//       stableFetchCurrency();
//       if (mode === "team") {
//         // Fetch current subscriprion end date and owner info
//         stableFetchTeamInfo();
//       } else if (mode === "individual") {
//         // Fetch current subscription
//         stableFetchIndividualSubscriptionData();
//       }
//     },
//     [
//       stableFetchTeamInfo,
//       stableFetchIndividualSubscriptionData,
//       stableFetchCurrency,
//       mode,
//     ],
//     [user]
//   );

//   return (
//     <React.Fragment>
//       {/* Page content */}
//       <Container className=" mt--7 sm-margin-top-negative-3" fluid>
//         {/* Table */}
//         <Row>
//           <div className="col">
//             <Card className="shadow">
//               <CardBody>
//                 <Row>
//                   <Col>
//                     <h2 style={{ textAlign: "center" }}>
//                       Change Subscription Plan
//                     </h2>
//                     <br />
//                     {isLoading
//                       ? renderLoader()
//                       : isUpdateSubscriptionAllowed
//                       ? renderNewPlanChooser()
//                       : renderUpdatePlanNowAllowed()}
//                   </Col>
//                 </Row>
//               </CardBody>
//             </Card>
//           </div>
//         </Row>
//       </Container>
//     </React.Fragment>
//   );
// };

// export default UpdateSubscription;

const UpdateSubscription = () => (
  <Navigate
    to={APP_CONSTANTS.PATHS.ACCOUNT.UPDATE_SUBSCRIPTION_CONTACT_US.ABSOLUTE}
  />
);

export default UpdateSubscription;
