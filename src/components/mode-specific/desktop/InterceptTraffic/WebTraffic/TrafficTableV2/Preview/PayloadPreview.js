import { Collapse } from "antd";

const RequestPayloadPreview = ({ query_params, body }) => {
  try {
    query_params = JSON.parse(query_params);
  } catch {
    // This is just a check, server will always send json string
    query_params = { raw_query_params: query_params };
  }

  if (query_params || body) {
    return (
      <Collapse
        accordion
        bordered={false}
        defaultActiveKey={["1"]}
        expandIconPosition="left"
      >
        {query_params ? (
          <Collapse.Panel key="1" header="Query String Parameters">
            {Object.keys(query_params).map((key, index) => {
              return (
                <p style={{ paddingLeft: 12 }} key={index}>
                  <span>
                    <strong>{key}</strong>
                  </span>{" "}
                  : {query_params[key]}
                </p>
              );
            })}
          </Collapse.Panel>
        ) : null}
        {body ? (
          <Collapse.Panel header="Request Payload" key="2">
            <p style={{ paddingLeft: 12 }}>{body}</p>
          </Collapse.Panel>
        ) : null}
      </Collapse>
    );
  }

  return <h3>No payload passed</h3>;
};

export default RequestPayloadPreview;
