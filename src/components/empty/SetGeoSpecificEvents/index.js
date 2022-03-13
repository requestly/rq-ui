import React, { useContext, useEffect, useState } from "react";
import APP_CONSTANTS from "../../../config/constants";
import { store } from "../../../store";
import {
  getUpdateTrialModeEnabled,
  getUpdateUserCountry,
} from "../../../store/action-objects";
import {
  getAppMode,
  getUserAuthDetails,
} from "../../../utils/GlobalStoreUtils";
import { fetchUserCountry } from "../../../utils/Misc";
import { setUserOnTrial } from "../../../utils/PremiumUtils";

const SetGeoSpecificEvents = () => {
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const appMode = getAppMode(state);
  const user = getUserAuthDetails(state);

  const [country, setCountry] = useState("US");

  useEffect(() => {
    fetchUserCountry()
      .then((currentCountry) => {
        setCountry(currentCountry);
        dispatch(getUpdateUserCountry(currentCountry));
      })
      .catch(() => {
        dispatch(getUpdateUserCountry("US"));
      });
  }, [dispatch]);

  useEffect(() => {
    if (APP_CONSTANTS.FREE_TRIAL_COUNTRIES.includes(country)) {
      setUserOnTrial(appMode, country, user?.loggedIn).then((value) => {
        dispatch(getUpdateTrialModeEnabled(value));
      });
    }
  }, [appMode, country, dispatch, user?.loggedIn]);

  return <></>;
};

export default SetGeoSpecificEvents;
