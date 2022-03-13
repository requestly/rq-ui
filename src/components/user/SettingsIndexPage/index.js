import InstallExtensionCTA from "../../misc/InstallExtensionCTA";
import React, { useState, useContext, useEffect } from "react";
// import { CardBody, CardTitle, Jumbotron } from "reactstrap";
// import { Row, Card, Col } from "antd";
// import { toast } from "utils/Toast.js";
// Sub Components
import ErrorCard from "../../misc/ErrorCard";
//Icons
// import { FaCheckCircle } from "react-icons/fa";
// import { MdSync, MdSyncDisabled } from "react-icons/md";
//Actions
import * as ExtensionActions from "../../../actions/ExtensionActions";
//Constants
// import APP_CONSTANTS from "../../../config/constants";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
// Store
import { store } from "../../../store";
// UTILS
import { getAppMode } from "../../../utils/GlobalStoreUtils";
// import ProCard from "@ant-design/pro-card";

const SettingsIndexPage = () => {
  //Component State
  const [storageType, setStorageType] = useState("");
  // const [numItems, setNumItems] = useState(0);
  // const [bytesUsed, setBytesUsed] = useState(0);
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const appMode = getAppMode(state);

  const fetchData = () => {
    ExtensionActions.getStorageInfo().then((response) => {
      setStorageType(response.storageType);
      // setNumItems(response.numItems);
      // setBytesUsed(response.bytesUsed);
    });
  };

  // const renderStorageTypeSetting = () => {
  //   return (
  //     <React.Fragment>
  //       <Jumbotron style={{ background: "transparent" }}>
  //         <Row
  //           style={{
  //             paddingBottom: "1rem",
  //             alignItems: "center",
  //           }}
  //         >
  //           <Col span={2} align="center">
  //             Select Storage
  //           </Col>
  //           <Col span={11}>
  //             <Card
  //               className="card-stats mb-4 mb-lg-0"
  //               style={{
  //                 border:
  //                   storageType === "sync"
  //                     ? "1px solid " + APP_CONSTANTS.THEME_COLORS.PRIMARY_COLOR
  //                     : "",
  //                 cursor: "not-allowed",
  //                 backgroundColor: "#dddddd99",
  //                 opacity: 0.6,
  //               }}
  //               onClick={() => {
  //                 toast.info("We've disabled sync storage for the moment!");
  //               }}
  //             >
  //               <CardBody>
  //                 <Row>
  //                   <div className="col">
  //                     <CardTitle className="text-uppercase text-muted ">
  //                       <strong>Sync Storage</strong>
  //                       {storageType === "sync" ? (
  //                         <FaCheckCircle
  //                           style={{
  //                             color: APP_CONSTANTS.THEME_COLORS.PRIMARY_COLOR,
  //                             marginLeft: "2%",
  //                           }}
  //                         />
  //                       ) : null}
  //                     </CardTitle>
  //                     <span>
  //                       Sync data between multiple devices when user is logged
  //                       in browser profile.
  //                     </span>
  //                   </div>
  //                   <Col className="col-auto" align="right">
  //                     <MdSync size="2rem" />
  //                   </Col>
  //                 </Row>
  //                 <p className="mt-3  text-muted text-sm">
  //                   <span className="text-nowrap">
  //                     Prefer when you have less than 75 rules.
  //                   </span>
  //                 </p>
  //               </CardBody>
  //             </Card>
  //           </Col>
  //           <Col span={11}>
  //             <Card
  //               className="card-stats mb-4 mb-lg-0 cursor-pointer"
  //               style={{
  //                 border:
  //                   storageType === "local"
  //                     ? "1px solid " + APP_CONSTANTS.THEME_COLORS.PRIMARY_COLOR
  //                     : "",
  //               }}
  //               onClick={() => changeStorageType("local")}
  //             >
  //               <CardBody>
  //                 <Row span={24}>
  //                   <Col>
  //                     <CardTitle className="text-uppercase text-muted ">
  //                       Local Storage{" "}
  //                       {storageType === "local" ? (
  //                         <FaCheckCircle
  //                           style={{
  //                             color: APP_CONSTANTS.THEME_COLORS.PRIMARY_COLOR,
  //                           }}
  //                         />
  //                       ) : null}
  //                     </CardTitle>
  //                     <span className="margin-top-one">
  //                       Store data locally to current browser. It has more
  //                       capacity than Sync Storage.
  //                     </span>
  //                   </Col>
  //                   <Col className="col-auto" align="right">
  //                     <MdSyncDisabled size="2rem" />
  //                   </Col>
  //                 </Row>
  //                 <p className="mt-3  text-muted text-sm">
  //                   <span className="text-nowrap">
  //                     Prefer when you have more than 75 rules.
  //                   </span>
  //                 </p>
  //               </CardBody>
  //             </Card>
  //           </Col>
  //         </Row>
  //       </Jumbotron>
  //     </React.Fragment>
  //   );
  // };

  // const changeStorageType = (newStorageType) => {
  //   if (newStorageType === storageType) return;
  //   if (newStorageType === "sync" && (numItems > 80 || bytesUsed > 80000)) {
  //     alert(
  //       "Unable to change storage type. Too much data to be stored in Sync Storage."
  //     );
  //     return;
  //   }

  //   ExtensionActions.setStorageType(newStorageType).then((response) => {
  //     fetchData();
  //     toast.info("StorageType changed successfully!");
  //   });
  // };

  useEffect(() => {
    if (appMode === GLOBAL_CONSTANTS.APP_MODES.EXTENSION) {
      fetchData();
    }
  }, [appMode]);

  if (appMode === GLOBAL_CONSTANTS.APP_MODES.DESKTOP) {
    return (
      <ErrorCard customErrorMessage="All Requestly rules get saved to your system as of now. We'll soon introduce a feature to move them to cloud and sync across devices." />
    );
  }

  if (!storageType) {
    return (
      <InstallExtensionCTA
        heading={"Requestly Extension Settings"}
        content={"Please install Requestly Browser Extension first."}
      />
    );
  }

  return (
    <React.Fragment>
      {/* <ProCard
        className="primary-card github-like-border"
        title="Change where your browser stores the Rules"
      >
        <Row>
          <Col span={24}>{renderStorageTypeSetting()}</Col>
        </Row>
      </ProCard> */}
      <ErrorCard customErrorMessage="All Requestly rules get saved to your system as of now. We'll soon introduce a feature to move them to cloud and sync across devices." />
    </React.Fragment>
  );
};
export default SettingsIndexPage;
