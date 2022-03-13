import { useEffect, useState, useContext, useCallback } from "react";
import { Button, Col, Row, Select } from "antd";

import { where, collection, getFirestore, getDocs } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { query } from "firebase/database";

import firebaseApp from "../../../firebase";
import { store } from "../../../store";
import * as GlobalStoreUtils from "../../../utils/GlobalStoreUtils";
import { toast } from "../../../utils/Toast";

const { Option } = Select;
const db = getFirestore(firebaseApp);

const SdkSelector = ({ setSelectedSdkId }) => {
  const globalState = useContext(store);
  const { state } = globalState;
  const user = GlobalStoreUtils.getUserAuthDetails(state);

  const [userSdkIds, setUserSdkIds] = useState([]);
  const [creatingSdkKey, setCreatingSdkKey] = useState(false);

  const handleSdkIdSelect = (value) => {
    console.log(value);
    setSelectedSdkId(value);
  };

  const getUserSdks = useCallback(() => {
    const sdksRef = collection(db, "sdks");
    console.log(user);
    getDocs(
      query(
        sdksRef,
        ...[where("accessIds", "array-contains", user?.details?.profile?.uid)]
      )
    ).then((snapshot) => {
      console.log(snapshot.docs);
      if (snapshot && snapshot.docs) {
        setUserSdkIds(snapshot.docs.map((doc) => doc.id));
      }
    });
  }, [user]);

  useEffect(() => {
    getUserSdks();
  }, [getUserSdks]);

  const renderUserSdkSelector = () => {
    return (
      <Select
        placeholder="Select sdkId"
        onChange={handleSdkIdSelect}
        style={{ width: "100%" }}
      >
        {userSdkIds.map((sdkId) => {
          return (
            <Option key={sdkId} value={sdkId}>
              {sdkId}
            </Option>
          );
        })}
      </Select>
    );
  };

  const createNewSdkId = () => {
    setCreatingSdkKey(true);

    const functions = getFunctions();
    const createNewSdkId = httpsCallable(functions, "createNewSdkId");
    createNewSdkId({})
      .then((response) => {
        setCreatingSdkKey(false);
        toast.success("New SDK Key generated");
        getUserSdks();
      })
      .catch((err) => {
        setCreatingSdkKey(false);
        toast.success("Failure while generating new SDK Key");
        console.log(err);
      });
  };

  return (
    <>
      <Row gutter={[8]} align="middle" style={{ paddingLeft: "24px" }}>
        <Col xs={20} sm={20} md={12} lg={12}>
          {renderUserSdkSelector()}
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={createNewSdkId}
            loading={creatingSdkKey}
            size="small"
          >
            {creatingSdkKey ? "Creating New Key" : "Create New Key"}
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default SdkSelector;
