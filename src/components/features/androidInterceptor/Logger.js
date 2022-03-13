import { Col, Row, Select, Typography } from "antd";
import firebaseApp from "../../../firebase";
import {
  getFirestore,
  query,
  doc,
  collectionGroup,
  where,
  orderBy,
  limit,
  onSnapshot,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState, useContext, useCallback } from "react";
import TrafficTableV2 from "../../../components/mode-specific/desktop/InterceptTraffic/WebTraffic/TrafficTableV2";
import { convertLogDocIntoRqLog } from "./utils";

import { store } from "../../../store";
import * as GlobalStoreUtils from "../../../utils/GlobalStoreUtils";

const { Text } = Typography;

const db = getFirestore(firebaseApp);
const { Option } = Select;

let unsubscribe = null;

const Logger = ({ sdkId }) => {
  const globalState = useContext(store);
  const { state } = globalState;
  const user = GlobalStoreUtils.getUserAuthDetails(state);

  const [rqLogs, setRqLogs] = useState([]);

  const [devices, setDevices] = useState([]);
  const [enabledDeviceId, setEnabledDeviceId] = useState(null);

  // const userId = "1";

  const handleSelectedDevicesChange = (value) => {
    // Set Enabled Devices in Firestore.
    setEnabledDeviceId(value);
    let deviceIds = [];
    if (value) {
      deviceIds.push(value);
    }
    updateEnabledDevicesInFirestore(deviceIds);
  };

  const updateEnabledDevicesInFirestore = useCallback(
    (devices_ids = []) => {
      setDoc(
        doc(db, `sdks/${sdkId}`),
        { enabled_device_ids: { [user?.details?.profile?.uid]: devices_ids } },
        { merge: true }
      );
    },
    [sdkId, user?.details?.profile?.uid]
  );

  const cleanDeviceLogs = () => {
    if (enabledDeviceId && sdkId) {
      // console.log("Cleaning Device Logs");
      // console.log(`sdks/${sdkId}/devices/${enabledDeviceId}`);
      // deleteDoc(
      //   getDoc(doc(db, `sdks/${sdkId}/devices/${enabledDeviceId}`))
      // );
    }
  };
  const stableCleanDeviceLogs = useCallback(cleanDeviceLogs, [
    enabledDeviceId,
    sdkId,
  ]);

  const unsubscribeListeners = useCallback(() => {
    // Unsubscribe previous listener
    if (unsubscribe) {
      unsubscribe();
      console.log("Unsubscribe previous listener");
    }

    stableCleanDeviceLogs();
  }, [stableCleanDeviceLogs]);

  const cleanupListeningDevices = () => {
    // Clean listening devices in firestore
    updateEnabledDevicesInFirestore([]);
    unsubscribeListeners();
  };

  const stableCleanupListeningDevices = useCallback(cleanupListeningDevices, [
    unsubscribeListeners,
    updateEnabledDevicesInFirestore,
  ]);

  useEffect(() => {
    unsubscribeListeners();

    // Attach listener with updated devices
    if (enabledDeviceId) {
      console.log("Listening to ", enabledDeviceId);
      unsubscribe = onSnapshot(
        query(
          collectionGroup(db, "logs"),
          ...[
            where("sdk_id", "==", sdkId),
            where("device_id", "in", [enabledDeviceId]),
            orderBy("created_ts", "desc"),
            limit(10),
          ]
        ),
        async (snapshot) => {
          if (snapshot) {
            // console.log(snapshot.docs);
            // snapshot.docs.map(doc => console.log(doc.data()));
            const rq_logs = snapshot.docs.map((doc) => {
              return convertLogDocIntoRqLog(doc);
            });
            console.log(rq_logs);
            setRqLogs(rq_logs);
          }
        }
      );
    }
  }, [enabledDeviceId, sdkId, unsubscribeListeners]);

  // Fetch all available devices
  useEffect(() => {
    getDoc(doc(db, "sdks", sdkId)).then((snapshot) => {
      if (snapshot) {
        const sdkData = snapshot.data();
        setDevices(sdkData?.devices || []);
      }
    });

    return () => {
      stableCleanupListeningDevices();
    };
  }, [sdkId]);

  const renderTrafficTable = () => {
    return (
      <TrafficTableV2
        logs={rqLogs}
        emptyCtaText="Connect App"
        emptyCtaAction="https://docs.requestly.io/interceptor/android-interceptor"
        emptyDesc={"No Traffic Intercepted. Learn how to connect an App"}
      />
    );
  };

  const renderDeviceIdsSelector = () => {
    return (
      <Row
        align="middle"
        style={{ paddingLeft: "24px", paddingBottom: "8px" }}
        gutter={[8]}
      >
        <Col>
          <Text>Listening Device Ids: </Text>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Select
            allowClear
            style={{ width: "100%" }}
            placeholder="Select Device Id"
            defaultValue={null}
            onChange={handleSelectedDevicesChange}
            value={enabledDeviceId}
          >
            {devices.map((deviceDetail) => {
              return (
                <Option key={deviceDetail.id}>
                  <>
                    {deviceDetail.id} ({deviceDetail.name || deviceDetail.model}
                    )
                  </>
                </Option>
              );
            })}
          </Select>
        </Col>
      </Row>
    );
  };

  return (
    <>
      {renderDeviceIdsSelector()}
      {renderTrafficTable()}
    </>
  );
};

export default Logger;
