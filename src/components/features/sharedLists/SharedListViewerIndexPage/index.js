import React, { useContext, useEffect, useState, useCallback } from "react";
import { Col, Spin, Row } from "antd";
import { CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import isEmpty from "is-empty";
//SUB COMPONENTS
import SharedListViewerTableContainer from "../SharedListViewerTableContainer";
// storageService
import { StorageService } from "../../../../init";
// Store
import { store } from "../../../../store";
// Reducer Action Objects
import { getUpdateRulesAndGroupsActionObject } from "../../../../store/action-objects";
//ACTIONS
import { getSharedListIdFromURL, fetchSharedListData } from "./actions";
//UTILS
import { submitEventUtil } from "../../../../utils/AnalyticsUtils";
import {
  getAppMode,
  getIsRefreshRulesPending,
} from "../../../../utils/GlobalStoreUtils";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";

const SharedListViewerIndexPage = () => {
  //Global State
  const globalState = useContext(store);
  const { state, dispatch } = globalState;
  const isRulesListRefreshPending = getIsRefreshRulesPending(state);
  const appMode = getAppMode(state);

  //Component State
  const [rulesFromSharedList, setRulesFromSharedList] = useState([]);
  const [groupsFromSharedList, setGroupsFromSharedList] = useState([]);
  const [sharedListPresent, setSharedListPresent] = useState(true);
  const [isDataLoading, setDataLoading] = useState(true);

  const stableDispatch = useCallback(dispatch, [dispatch]);

  const sharedListId = getSharedListIdFromURL(window.location.pathname);

  useEffect(() => {
    const groupsPromise = StorageService(appMode).getRecords(
      GLOBAL_CONSTANTS.OBJECT_TYPES.GROUP
    );
    const rulesPromise = StorageService(appMode).getRecords(
      GLOBAL_CONSTANTS.OBJECT_TYPES.RULE
    );

    Promise.all([groupsPromise, rulesPromise]).then((data) => {
      const groups = data[0];
      const rules = data[1];

      stableDispatch(getUpdateRulesAndGroupsActionObject(rules, groups));
    });
  }, [stableDispatch, isRulesListRefreshPending, appMode]);

  const updateCollection = () => {
    fetchSharedListData(sharedListId).then((incomingData) => {
      if (incomingData !== null) {
        setRulesFromSharedList(incomingData.rules || []);
        setGroupsFromSharedList(incomingData.groups || []);
        setDataLoading(false);
      } else {
        setSharedListPresent(false);
        setDataLoading(false);
      }
    });
  };

  const stableUpdateCollection = useCallback(updateCollection, [sharedListId]);

  //ANALYTICS
  submitEventUtil(
    GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.SHARED_LIST,
    GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.VIEWED,
    "SharedList Index Page Viewed"
  );

  useEffect(() => {
    stableUpdateCollection();
  }, [stableUpdateCollection]);

  const loaderIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <React.Fragment>
      {isDataLoading ? (
        <Row type="flex" align="middle" justify="center">
          <Col>
            <Spin indicator={loaderIcon} />
          </Col>
        </Row>
      ) : sharedListPresent && !isEmpty(rulesFromSharedList) ? (
        <SharedListViewerTableContainer
          rules={rulesFromSharedList}
          groups={groupsFromSharedList}
        />
      ) : (
        <Row type="flex" align="middle" justify="center">
          <Col style={{ marginTop: "15%" }}>
            <h1>
              <CloseCircleOutlined
                style={{ color: "red", marginLeft: "100px" }}
              />
            </h1>
            <h2>Shared List does not exist</h2>
            <p>Either the list is deleted or not created </p>
            <p>
              <a href="/">Go To Rules</a>
            </p>
          </Col>
        </Row>
      )}
    </React.Fragment>
  );
};
export default SharedListViewerIndexPage;
