import React, { useContext, useEffect } from "react";
import { store } from "../../../store";
import { getUserAuthDetails } from "../../../utils/GlobalStoreUtils";
import userNodeListener from "./userNodeListener";
import userSubscriptionNodeListener from "./userSubscriptionNodeListener";

const DbListenerInit = () => {
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const user = getUserAuthDetails(state);

  useEffect(() => {
    if (user?.loggedIn) {
      userNodeListener(dispatch);
      userSubscriptionNodeListener(dispatch);
    }
  }, [dispatch, user?.loggedIn]);

  return <></>;
};

export default DbListenerInit;
