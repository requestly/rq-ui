import React from "react";
import ProTable from "@ant-design/pro-table";
import { Avatar } from "antd";
import GroupByNone from "./GroupByNone";

const columns = [
  {
    title: "Domain Name",
    dataIndex: "domain",
    key: "domain",
    render: (text) => {
      return (
        <>
          <Avatar
            size="small"
            src={`https://www.google.com/s2/favicons?domain=${text}`}
          />
          <span> {text}</span>
        </>
      );
    },
  },
];

const NestedTable = ({ domain, domainLogs, handleRowClick }) => {
  return (
    <GroupByNone
      requestsLog={domainLogs[domain]}
      handleRowClick={handleRowClick}
    />
  );
};

const GroupByDomain = ({ domainList, domainLogs, handleRowClick }) => {
  return (
    <ProTable
      columns={columns}
      dataSource={domainList}
      rowKey={(record) => record.domain}
      pagination={false}
      scroll={{ y: 600 }}
      expandable={{
        expandedRowRender: (record) => {
          return (
            <NestedTable
              domain={record.domain}
              domainLogs={domainLogs}
              handleRowClick={handleRowClick}
            />
          );
        },
        expandRowByClick: true,
      }}
      locale={{ emptyText: "No Traffic Intercepted" }}
      search={false}
      options={false}
      style={{ cursor: "pointer" }}
    />
  );
};

export default GroupByDomain;
