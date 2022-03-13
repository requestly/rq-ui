import React from "react";
import ProTable from "@ant-design/pro-table";

const columns = [
  {
    title: "Time",
    dataIndex: "timestamp",
    defaultSortOrder: "descend",
    align: "center",
    width: 100,
    responsive: ["xs", "sm"],
  },
  {
    title: "URL",
    dataIndex: "url",
    width: 620,
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
    responsive: ["xxl"],
  },
];

const GroupByNone = ({ requestsLog, handleRowClick }) => {
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
        return {
          onClick: () => handleRowClick(record),
        };
      }}
      locale={{ emptyText: "No Traffic Intercepted" }}
      search={false}
      options={false}
      style={{ cursor: "pointer" }}
    />
  );
};

export default GroupByNone;
