import React, { useState, useEffect, useCallback } from "react";
// Styles
import "./css/draggable.css";
import RequestlogPane from "./RequestlogPane";
import ActionHeader from "./ActionHeader";
import {
  groupByApp,
  groupByDomain,
} from "../../../../../../utils/TrafficTableUtils";
import GroupByDomain from "./Tables/GroupByDomain";
import GroupByApp from "./Tables/GroupByApp";
import GroupByNone from "./Tables/GroupByNone";
import { submitEventUtil } from "../../../../../../utils/AnalyticsUtils";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import SSLProxyingModal from "components/mode-specific/desktop/SSLProxyingModal";

const CurrentTrafficTable = ({
  logs,
  emptyCtaText,
  emptyCtaAction,
  emptyDesc,
}) => {
  // Component State

  // {id: log, ...}
  const [networkLogsMap, setNetworkLogsMap] = useState({});
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedRequestData, setSelectedRequestData] = useState({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const [groupByParameter, setGroupByParameter] = useState("none");
  const [isSSLProxyingModalVisible, setIsSSLProxyingModalVisible] = useState(
    false
  );

  const upsertLogs = (logs) => {
    let _networkLogsMap = { ...networkLogsMap };
    logs?.forEach((log) => {
      if (log) {
        _networkLogsMap[log.id] = log;
      }
    });

    setNetworkLogsMap(_networkLogsMap);
  };

  useEffect(() => {
    upsertLogs(logs);
  }, [logs]);

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

  const upsertNetworkLogMap = useCallback(
    (log) => {
      let _networkLogsMap = { ...networkLogsMap };
      _networkLogsMap[log.id] = log;
      setNetworkLogsMap(_networkLogsMap);
    },
    [networkLogsMap]
  );

  const clearLogs = () => {
    setNetworkLogsMap({});
  };

  useEffect(() => {
    window?.RQ?.DESKTOP.SERVICES.IPC.registerEvent(
      "log-network-request",
      (payload) => {
        // TODO: @sahil865gupta Fix this multiple time registering
        upsertNetworkLogMap(payload);
      }
    );

    return () => {
      if (window.RQ && window.RQ.DESKTOP) {
        // TODO: @sahil865gupta Fix this multiple time unregistering
        window.RQ.DESKTOP.SERVICES.IPC.unregisterEvent("log-network-request");
      }
    };
  }, [upsertNetworkLogMap]);

  useEffect(() => {
    if (window.RQ && window.RQ.DESKTOP) {
      window.RQ.DESKTOP.SERVICES.IPC.invokeEventInBG(
        "enable-request-logger"
      ).then(() => {});
    }

    return () => {
      if (window.RQ && window.RQ.DESKTOP) {
        // Disable sending logs from bg window
        window.RQ.DESKTOP.SERVICES.IPC.invokeEventInBG(
          "disable-request-logger"
        ).then(() => {});
      }
    };
  }, []);

  const getRequestLogs = (desc = true) => {
    const logs = Object.values(networkLogsMap).sort(
      (log1, log2) => log2.timestamp - log1.timestamp
    );

    if (searchKeyword) {
      const reg = new RegExp(searchKeyword, "i");
      const filteredLogs = logs.filter((log) => {
        return log.url.match(reg);
      });

      return filteredLogs;
    }
    return logs;
  };

  const getDomainLogs = () => {
    const logs = getRequestLogs();
    const { domainArray: domainList, domainLogs } = groupByDomain(logs);
    return { domainLogs, domainList };
  };

  const getAppLogs = () => {
    const logs = getRequestLogs();
    const { appArray: appList, appLogs } = groupByApp(logs);
    return { appLogs, appList };
  };

  const upsertRequestAction = (log_id, action) => {
    let _networkLogsMap = { ...networkLogsMap };
    if (_networkLogsMap[log_id].actions) {
      _networkLogsMap[log_id].actions.push(action);
    }
    setNetworkLogsMap(_networkLogsMap);
  };

  return (
    <React.Fragment>
      <ActionHeader
        handleOnSearchChange={handleOnSearchChange}
        handleOnGroupParameterChange={handleOnGroupParameterChange}
        groupByParameter={groupByParameter}
        clearLogs={clearLogs}
        setIsSSLProxyingModalVisible={setIsSSLProxyingModalVisible}
      />

      {groupByParameter === "domain" ? (
        <GroupByDomain handleRowClick={handleRowClick} {...getDomainLogs()} />
      ) : groupByParameter === "app" ? (
        <GroupByApp handleRowClick={handleRowClick} {...getAppLogs()} />
      ) : (
        <GroupByNone
          requestsLog={getRequestLogs()}
          handleRowClick={handleRowClick}
          emptyCtaText={emptyCtaText}
          emptyCtaAction={emptyCtaAction}
          emptyDesc={emptyDesc}
        />
      )}

      {isPreviewOpen ? (
        <RequestlogPane
          handleClosePane={handleClosePane}
          selectedRequestData={selectedRequestData}
          visibility={isPreviewOpen}
          upsertRequestAction={upsertRequestAction}
        />
      ) : null}
      <SSLProxyingModal
        isVisible={isSSLProxyingModalVisible}
        setIsVisible={setIsSSLProxyingModalVisible}
      />
    </React.Fragment>
  );
};

export default CurrentTrafficTable;
