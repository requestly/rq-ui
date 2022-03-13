import { Row, Col, Image, List } from "antd";
import { useContext } from "react";

import { store } from "../../../../../../../store";
import { getDesktopSpecificDetails } from "../../../../../../../utils/GlobalStoreUtils";
import { ANDROID_DEVICES } from "./constants";
import oneplus_wifi_settings_gif from "assets/img/screenshots/android/oneplus/wifi_settings.gif";

const WifiInstructions = ({ device_id }) => {
  const globalState = useContext(store);
  const { state } = globalState;
  const desktopSpecificDetails = getDesktopSpecificDetails(state);
  const { proxyPort, proxyIp } = desktopSpecificDetails;

  const renderGif = () => {
    if (device_id === ANDROID_DEVICES.ONEPLUS) {
      return <Image src={oneplus_wifi_settings_gif} />;
    }
  };

  return (
    <div>
      <Row>
        <Col span={16}>
          <List itemLayout="horizontal">
            <List.Item>
              <List.Item.Meta
                title="a. Open Wifi Settings"
                description={
                  <>
                    Navigate to:{" "}
                    <code>
                      Settings > Wi-Fi > Select current Wi-Fi > Modify
                    </code>
                  </>
                }
              />
            </List.Item>
            <List.Item>
              <List.Item.Meta
                title="b. Set Proxy Settings"
                description={
                  <>
                    In Advanced Options, Set this config
                    <br />
                    <code>
                      Proxy: <b>Manual</b>
                    </code>
                    <br />
                    <code>
                      Host: <b>{proxyIp}</b>
                    </code>
                    <br />
                    <code>
                      Port: <b>{proxyPort}</b>
                    </code>
                  </>
                }
              />
            </List.Item>
          </List>
        </Col>
        <Col span={2}></Col>
        <Col span={5}>{renderGif()}</Col>
      </Row>
    </div>
  );
};

export default WifiInstructions;
