import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import ProTable from "@ant-design/pro-table";

import AppliedRules from "./columns/AppliedRules";
import { redirectToApps } from "utils/RedirectionUtils";

const columns = [
  {
    title: "Time",
    dataIndex: "timestamp",
    defaultSortOrder: "descend",
    align: "center",
    width: 100,
    responsive: ["xs", "sm"],
    renderText: (timestamp) => {
      return new Date(timestamp * 1000).toLocaleTimeString(undefined, {
        hour12: false,
      });
    },
  },
  {
    title: "URL",
    dataIndex: "url",
    width: 540,
    ellipsis: true,
    responsive: ["xs", "sm"],
  },
  {
    title: "Method",
    dataIndex: ["request", "method"], // corresponds to request.method
    sorter: (a, b) => a.request.method.length - b.request.method.length,
    align: "center",
    sortDirections: ["ascend", "descend"],
    responsive: ["xl"],
  },
  {
    title: "Content-Type",
    dataIndex: ["response", "contentType"],
    align: "center",
    responsive: ["xl"],
    ellipsis: true,
  },
  {
    title: "Rules Applied",
    dataIndex: ["actions"],
    align: "center",
    responsive: ["xl"],
    render: (actions) => {
      if (!actions || actions === "-" || actions.length === 0) {
        return "-";
      }
      return <AppliedRules actions={actions} />;
    },
  },
];

const GroupByNone = ({
  requestsLog,
  handleRowClick,
  emptyCtaText,
  emptyCtaAction,
  emptyDesc,
}) => {
  const navigate = useNavigate();

  const renderNoTrafficCTA = () => {
    if (emptyCtaAction && emptyCtaText) {
      return (
        <>
          <Button
            type="primary"
            shape="round"
            href={emptyCtaAction}
            target="_blank"
            style={{ margin: 8 }}
            size="small"
          >
            {emptyCtaText}
          </Button>
          <p>{emptyDesc}</p>
        </>
      );
    }

    return (
      <>
        <Button
          type="primary"
          shape="round"
          onClick={() => redirectToApps(navigate)}
          style={{ margin: 8 }}
        >
          Connect App
        </Button>
        <p>Connect an App to start intercepting traffic</p>
      </>
    );
  };

  return (
    <ProTable
      columns={columns}
      dataSource={requestsLog}
      rowKey={(record) => record.id}
      showSorterTooltip={false}
      sticky={true}
      size={"small"}
      pagination={false}
      scroll={{ y: 600 }}
      onRow={(record) => {
        const { actions } = record;
        return {
          onClick: () => handleRowClick(record),
          style: actions.length !== 0 ? { background: "#13c2c280" } : {},
        };
      }}
      locale={{ emptyText: renderNoTrafficCTA() }}
      search={false}
      options={false}
      style={{ cursor: "pointer" }}
      className="overflow-y-auto"
    />
  );
};

export default GroupByNone;
