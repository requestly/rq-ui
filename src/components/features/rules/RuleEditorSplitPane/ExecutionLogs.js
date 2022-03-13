import React, { useState, useEffect, useContext, useCallback } from "react";
import { Row, Skeleton, Button, Col, Typography } from "antd";
import ProTable from "@ant-design/pro-table";
import { SyncOutlined } from "@ant-design/icons";
import { StorageService } from "../../../../init";
import { store } from "../../../../store";
import {
  getAppMode,
  getUserAuthDetails,
} from "../../../../utils/GlobalStoreUtils";
import { getModeData } from "../RuleBuilder/actions";
import { generateObjectId } from "../../../../utils/FormattingHelper";
import { CONSTANTS } from "git@github.com:requestly/requestly.git";
import { getExecutionLogsId } from "../../../../utils/rules/misc";
import { submitEventUtil } from "utils/AnalyticsUtils";
import { trackExecutionLogs } from "utils/analytics/rules/execution_logs";
import { getCurrentlySelectedRuleData } from "utils/GlobalStoreUtils";
import { getFeatureLimits } from "../../../../utils/FeatureManager";
import APP_CONSTANTS from "../../../../config/constants";
import { epochToLocaleDate, epochToLocaleTime } from "utils/DateTimeUtils";

const { Text } = Typography;

const requestTypeMap = {
  main_frame: "html",
  sub_frame: "iframe",
};

const columns = [
  {
    title: "Time",
    dataIndex: "timestamp",
    defaultSortOrder: "descend",
    align: "center",
    width: "15%",
    renderText: (timestamp) => {
      if (isNaN(timestamp)) return "-";
      return (
        epochToLocaleDate(Number(timestamp)) +
        " " +
        epochToLocaleTime(Number(timestamp))
      );
    },
    sorter: (a, b) => a.timestamp - b.timestamp,
  },
  {
    title: "Request Url",
    dataIndex: "url",
    width: "60%",
    ellipsis: true,
  },
  {
    title: "Request Method",
    dataIndex: "requestMethod",
    width: "12.5%",
    align: "center",
  },
  {
    title: "Request Type",
    dataIndex: "requestType",
    width: "12.5%",
    align: "center",
    renderText: (requestType) => {
      return requestTypeMap[requestType] || requestType;
    },
  },
];

const ExecutionLogs = () => {
  const { RULE_TO_EDIT_ID } = getModeData(window.location, null);
  const executionLogsId = getExecutionLogsId(RULE_TO_EDIT_ID);
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const user = getUserAuthDetails(state);
  const appMode = getAppMode(state);

  // fetch Plan Name from user
  const planName = user.details?.planDetails?.planName;
  const executionLogLimit = getFeatureLimits(
    APP_CONSTANTS.FEATURES.EXECUTION_LOGS,
    user,
    planName
  );
  //Component State
  const [executionLogs, setExecutionLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const ruleData = getCurrentlySelectedRuleData(state);

  const fetchExecutionLogs = () => {
    setIsLoading(true);
    StorageService(appMode)
      .getRecord(executionLogsId)
      .then((fetchedExecutionLogs) => {
        if (fetchedExecutionLogs) {
          setExecutionLogs(
            fetchedExecutionLogs
              .sort((log1, log2) => log2.timestamp - log1.timestamp)
              .slice(0, executionLogLimit)
          );
        }
        setIsLoading(false);
      });
  };

  // memoizing to prevent unnecessary renders
  const stableFetchLogs = useCallback(fetchExecutionLogs, [
    appMode,
    executionLogsId,
    executionLogLimit,
  ]);

  useEffect(() => {
    stableFetchLogs();
  }, [stableFetchLogs]);

  const sendAnalytics = () => {
    submitEventUtil(
      CONSTANTS.GA_EVENTS.CATEGORIES.RULES,
      CONSTANTS.GA_EVENTS.ACTIONS.EXECUTION_LOGS,
      ruleData.ruleType
    );
    trackExecutionLogs(ruleData.ruleType);
  };

  const handleRefreshBtnOnClick = () => {
    sendAnalytics();
    stableFetchLogs();
  };

  return (
    <>
      <Skeleton loading={isLoading}>
        <Row
          align="middle"
          justify="space-between"
          style={{ paddingBottom: "6px" }}
        >
          <Col style={{ textAlign: "center" }} span={22}>
            <Text type="secondary">{`Only ${executionLogLimit} most recent execution logs are shown.`}</Text>
          </Col>
          <Col span={2} xxl={{ pull: 0 }} lg={{ pull: 1 }} sm={{ pull: 2 }}>
            <Button
              onClick={handleRefreshBtnOnClick}
              type="default"
              icon={<SyncOutlined />}
            >
              Refresh
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ProTable
              dataSource={executionLogs}
              columns={columns}
              pagination={false}
              rowKey={() => generateObjectId()}
              sticky={true}
              locale={{
                emptyText: "Start using the rule to see execution logs",
              }}
              showSorterTooltip={false}
              search={false}
              options={false}
              scroll={{ y: "40vh" }}
              size="small"
            />
          </Col>
        </Row>
      </Skeleton>
    </>
  );
};

export default ExecutionLogs;
