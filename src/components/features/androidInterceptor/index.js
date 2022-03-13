import { Alert } from "antd";

const { useState } = require("react");
const { default: Logger } = require("./Logger");
const { default: SdkSelector } = require("./SdkSelector");

const AndroidInterceptorIndexView = () => {
  const [sdkId, setSdkId] = useState(null);

  return (
    <div style={{ padding: "16px" }}>
      <Alert
        style={{
          marginLeft: "24px",
          marginBottom: "8px",
          marginRight: "24px",
          padding: "4px 8px 4px 8px",
        }}
        message={
          <>
            <a
              target="_blank"
              href="https://docs.requestly.io/interceptor/android-interceptor"
            >
              Click Here{" "}
            </a>{" "}
            to learn more about how Android Interceptor Works.
          </>
        }
        type="info"
        showIcon
        closable
      />
      <SdkSelector setSelectedSdkId={setSdkId} />
      <br />
      {sdkId ? <Logger sdkId={sdkId} /> : null}
    </div>
  );
};

export default AndroidInterceptorIndexView;
