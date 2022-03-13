import React from "react";
import ProTable from "@ant-design/pro-table";
import { Avatar } from "antd";
import GroupByNone from "./GroupByNone";
//CONSTANTS APPNAME
import APPNAMES from "./GROUPBYAPP_CONSTANTS";

const columns = [
  {
    title: "App Name",
    dataIndex: "appName",
    key: "appName",
    render: (text) => {
      text = text.trim();
      const avatarDomain = APPNAMES[text.split(" ")[0].toLowerCase()];
      const avatarUrl = `https://www.google.com/s2/favicons?domain=${avatarDomain}`;
      return (
        <>
          <Avatar size="small" src={avatarUrl} />
          <span> {text}</span>
        </>
      );
    },
  },
];

const NestedTable = ({ appName, appLogs, handleRowClick }) => {
  return (
    <GroupByNone
      requestsLog={appLogs[appName]}
      handleRowClick={handleRowClick}
    />
  );
};

const GroupByApp = ({ appList, appLogs, handleRowClick }) => {
  return (
    <ProTable
      columns={columns}
      dataSource={appList}
      rowKey={(record) => record.appName}
      pagination={false}
      scroll={{ y: 600 }}
      expandable={{
        expandedRowRender: (record) => {
          return (
            <NestedTable
              appName={record.appName}
              appLogs={appLogs}
              handleRowClick={handleRowClick}
            />
          );
        },
        expandRowByClick: true,
      }}
      locale={{ emptyText: "No Traffic Intercepted" }}
      options={false}
      search={false}
      style={{ cursor: "pointer" }}
    />
  );
};

export default GroupByApp;
