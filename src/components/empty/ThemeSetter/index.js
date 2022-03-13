import APP_CONSTANTS from "config/constants";
import React, { useContext, useEffect, useState } from "react";
import { store } from "store";
import { getUpdateAppThemeActionObject } from "store/action-objects";
import { getAppTheme } from "utils/GlobalStoreUtils";

const { THEMES } = APP_CONSTANTS;

const ThemeSetter = () => {
  // Global State
  const globalState = useContext(store);
  const { state, dispatch } = globalState;
  const appTheme = getAppTheme(state);
  // Component State
  const [isInitialSettingsDone, setIsInitialSettingsDone] = useState(false);

  // This useEffect loads up the initial theme
  useEffect(() => {
    if (!isInitialSettingsDone) {
      setIsInitialSettingsDone(true);
      const newTheme = localStorage.getItem("app-theme") || appTheme; // Initial theme
      if (newTheme) {
        dispatch(getUpdateAppThemeActionObject(newTheme));
      }
    }
  }, [appTheme, dispatch, isInitialSettingsDone]);

  // This useEffect is for handing the in-app theme changes + one time change from above useEffect
  useEffect(() => {
    const newTheme = appTheme;
    // Apply new theme
    if (newTheme === THEMES.LIGHT) {
      document.body.classList.remove(THEMES.DARK);
      document.body.classList.add(THEMES.LIGHT);
    }
    if (newTheme === THEMES.DARK) {
      document.body.classList.remove(THEMES.LIGHT);
      document.body.classList.add(THEMES.DARK);
    }
    localStorage.setItem("app-theme", newTheme);
  }, [appTheme]);

  return <></>;
};

export default ThemeSetter;
