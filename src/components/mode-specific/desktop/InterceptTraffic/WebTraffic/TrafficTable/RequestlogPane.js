import React from "react";
import { Badge, Space, Divider, Drawer } from "antd";
import { Navigation } from "@devtools-ds/navigation";
import { Table } from "@devtools-ds/table";
import { CloseOutlined } from "@ant-design/icons";

const Header = (props) => {
  return (
    <Space style={{ backgroundColor: "whitesmoke", width: "100%" }}>
      <div style={{ display: "flex", marginLeft: "4px" }}>
        <CloseOutlined
          onClick={props.handleClosePane}
          style={{ alignSelf: "center", margin: "0" }}
        />
      </div>

      <Badge count={props.method} style={{ backgroundColor: "grey" }} />
      <Badge
        overflowCount={699}
        count={props.statusCode}
        style={{ backgroundColor: "#87d068" }}
      />
      <span style={{ fontSize: "0.9rem", wordBreak: "break-all" }}>
        {props.url}
      </span>
    </Space>
  );
};

const LogPane = (props) => {
  const requestData = Object.entries(props.data).filter(
    (key) => key[0] !== "headers"
  );
  const headers = props.data.headers;
  return (
    <Navigation>
      <Navigation.Controls>
        <Navigation.TabList>
          <Navigation.Tab id={props.title}>
            <span
              style={{
                backgroundColor: "whitesmoke",
                fontWeight: "bold",
                color: "black",
                fontSize: "0.9rem",
              }}
            >
              {props.title + " Details"}{" "}
            </span>
          </Navigation.Tab>
          <Navigation.Tab id="Headers">Headers</Navigation.Tab>
        </Navigation.TabList>
      </Navigation.Controls>
      <Navigation.Panels>
        <Navigation.Panel>
          <div style={{ maxHeight: "600px" }}>
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.HeadCell>Property</Table.HeadCell>
                  <Table.HeadCell>Value</Table.HeadCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {requestData.map(([key, value], i) => {
                  return (
                    <Table.Row key={i} id={i}>
                      <Table.Cell style={{ textTransform: "capitalize" }}>
                        {key}
                      </Table.Cell>
                      <Table.Cell>{value}</Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </div>
        </Navigation.Panel>
        <Navigation.Panel>
          <div style={{ maxHeight: "600px" }}>
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.HeadCell>Key</Table.HeadCell>
                  <Table.HeadCell>Value</Table.HeadCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {Object.entries(headers).map(([key, value], i) => {
                  return (
                    <Table.Row key={i} id={i}>
                      <Table.Cell>{key}</Table.Cell>
                      <Table.Cell>{value}</Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </div>
        </Navigation.Panel>
      </Navigation.Panels>
    </Navigation>
  );
};

const RequestlogPane = ({
  selectedRequestData,
  handleClosePane,
  visibility,
}) => {
  return (
    <>
      <Drawer
        title={
          <Header
            url={selectedRequestData.url}
            method={selectedRequestData.request.method}
            statusCode={selectedRequestData.response.statusCode}
            handleClosePane={handleClosePane}
          />
        }
        placement={"right"}
        onClose={handleClosePane}
        visible={visibility}
        width={"50%"}
        destroyOnClose={true}
        extra={false}
        closable={false}
      >
        <div className="previewData">
          <div style={{ width: "50%" }}>
            <LogPane data={selectedRequestData.request} title="Request" />
          </div>
          <Divider type="vertical" style={{ height: "auto" }} />
          <div style={{ width: "50%" }}>
            <LogPane data={selectedRequestData.response} title="Response" />
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default RequestlogPane;
