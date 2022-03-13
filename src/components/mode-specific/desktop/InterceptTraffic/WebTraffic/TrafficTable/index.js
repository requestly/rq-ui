import React, { useState, useEffect } from "react";
// Styles
import "./css/draggable.css";
import RequestlogPane from "./RequestlogPane";
import SearchFail from "./SearchFail";
import ActionHeader from "./ActionHeader";
import {
  groupByApp,
  groupByDomain,
} from "../../../../../../utils/TrafficTableUtils";
import GroupByDomain from "./Tables/GroupByDomain";
import GroupByApp from "./Tables/GroupByApp";
import GroupByNone from "./Tables/GroupByNone";
import { submitEventUtil } from "../../../../../../../src/utils/AnalyticsUtils";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
const CurrentTrafficTable = () => {
  // Component State
  const [requestsLog, setRequestsLog] = useState([]);
  const [filteredLog, setFilteredLog] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedRequestData, setSelectedRequestData] = useState({});
  const [isSearchEmpty, setIsSearchEmpty] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [groupByParameter, setGroupByParameter] = useState("none");
  const [domainList, setDomainList] = useState([]);
  const [domainLogs, setDomainLogs] = useState({});
  const [appList, setAppList] = useState([]);
  const [appLogs, setAppLogs] = useState({});

  const handleRowClick = (row) => {
    setSelectedRequestData(row);
    setIsPreviewOpen(true);
    submitEventUtil(
      GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.DESKTOP_APP,
      GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.TRAFFIC_TABLE_MODIFIED,
      "Traffic Table Modified"
    );
  };

  const handleOnGroupParameterChange = (e) => {
    setGroupByParameter(e.target.value);
    submitEventUtil(
      GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.DESKTOP_APP,
      GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.TRAFFIC_TABLE_MODIFIED,
      "Traffic Table Modified"
    );
  };

  const handleClosePane = () => {
    setIsPreviewOpen(false);
  };

  const handleOnSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchKeyword(searchValue);
    const reg = new RegExp(searchValue, "i");

    const filteredUrl = requestsLog.filter((log) => {
      return log.url.match(reg);
    });

    if (filteredUrl.length === 0) {
      setIsSearchEmpty(true);
    } else {
      setIsSearchEmpty(false);
      setFilteredLog(filteredUrl);
    }
    submitEventUtil(
      GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.DESKTOP_APP,
      GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.TRAFFIC_TABLE_MODIFIED,
      "Traffic Table Modified"
    );
  };

  let previewData = [];

  // Show Details of a Request in the Preview pane
  if (selectedRequestData.timestamp) {
    previewData = [
      {
        property: "Time",
        value: selectedRequestData.timestamp,
      },
      {
        property: "Method",
        value: selectedRequestData.request.method,
      },
      {
        property: "Status Code",
        value: selectedRequestData.response.statusCode,
      },
      {
        property: "Path",
        value: selectedRequestData.request.path,
      },
      {
        property: "Host",
        value: selectedRequestData.request.host,
      },
      {
        property: "Port",
        value: selectedRequestData.request.port,
      },
      {
        property: "REQUEST HEADERS",
        value: "",
      },
    ];
    for (const [key, value] of Object.entries(
      selectedRequestData.request.headers
    )) {
      const header = {
        property: key,
        value,
      };
      previewData.push(header);
    }
    previewData.push({
      property: "RESPONSE HEADERS",
      value: "",
    });
    for (const [key, value] of Object.entries(
      selectedRequestData.response.headers
    )) {
      const header = {
        property: key,
        value,
      };
      previewData.push(header);
    }
  }

  useEffect(() => {
    if (window.RQ && window.RQ.DESKTOP) {
      // Fetch any previously existing logs
      window.RQ.DESKTOP.SERVICES.IPC.invokeEventInMain(
        "get-current-network-logs"
      ).then((prevLogs) => setRequestsLog(prevLogs));
      // Enable sending logs from bg window
      window.RQ.DESKTOP.SERVICES.IPC.invokeEventInBG(
        "enable-request-logger"
      ).then(() => {
        // Attach listener for accepting logs from the bg window in our react app
        window.RQ.DESKTOP.SERVICES.IPC.registerEvent(
          "log-network-request",
          (payload) => {
            setRequestsLog(payload);
          }
        );
      });
    }

    return () => {
      if (window.RQ && window.RQ.DESKTOP) {
        // Disable sending logs from bg window
        window.RQ.DESKTOP.SERVICES.IPC.invokeEventInBG(
          "disable-request-logger"
        ).then(() => {
          // Remove listener for accepting logs from the bg window in our react app
          window.RQ.DESKTOP.SERVICES.IPC.unregisterEvent("log-network-request");
        });
      }
    };
  }, []);

  useEffect(() => {
    if (groupByParameter === "domain") {
      const { domainArray, domainLogs } = groupByDomain(
        searchKeyword ? filteredLog : requestsLog
      );
      setDomainList(domainArray);
      setDomainLogs(domainLogs);
    } else if (groupByParameter === "app") {
      const { appArray, appLogs } = groupByApp(
        searchKeyword ? filteredLog : requestsLog
      );
      setAppList(appArray);
      setAppLogs(appLogs);
    }
    submitEventUtil(
      GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.DESKTOP_APP,
      GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.TRAFFIC_TABLE_VIEWED,
      "Traffic Table Viewed"
    );
  }, [requestsLog, searchKeyword, filteredLog, groupByParameter]);

  return (
    <React.Fragment>
      <ActionHeader
        handleOnSearchChange={handleOnSearchChange}
        handleOnGroupParameterChange={handleOnGroupParameterChange}
        groupByParameter={groupByParameter}
      />

      {isSearchEmpty ? (
        <SearchFail />
      ) : groupByParameter === "domain" ? (
        <GroupByDomain
          domainArray={domainList}
          domainLogs={domainLogs}
          handleRowClick={handleRowClick}
        />
      ) : groupByParameter === "app" ? (
        <GroupByApp
          appArray={appList}
          appLogs={appLogs}
          handleRowClick={handleRowClick}
        />
      ) : (
        <GroupByNone
          requestsLog={searchKeyword ? filteredLog : requestsLog}
          handleRowClick={handleRowClick}
        />
      )}

      {isPreviewOpen ? (
        <RequestlogPane
          handleClosePane={handleClosePane}
          selectedRequestData={selectedRequestData}
          visibility={isPreviewOpen}
        />
      ) : null}
    </React.Fragment>
  );
};

export default CurrentTrafficTable;
