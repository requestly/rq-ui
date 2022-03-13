import { Col, Switch } from "antd";
import APP_CONSTANTS from "config/constants";
import React, { useContext } from "react";
import { store } from "store";
import { getUpdateAppThemeActionObject } from "store/action-objects";
import { submitEventUtil } from "utils/AnalyticsUtils";
import { getAppTheme } from "utils/GlobalStoreUtils";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";

const { THEMES } = APP_CONSTANTS;

const DarkModeToggle = () => {
  //GLOBAL STATE
  const globalState = useContext(store);
  const { state, dispatch } = globalState;
  const appTheme = getAppTheme(state);

  const toggleDarkMode = () => {
    if (appTheme === THEMES.LIGHT) {
      submitEventUtil(
        GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.EXTENSION,
        GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.DARK_MODE_ENABLED,
        "dark_mode_enabled"
      );
      dispatch(getUpdateAppThemeActionObject(THEMES.DARK));
    } else {
      submitEventUtil(
        GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.EXTENSION,
        GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.DARK_MODE_DISABLED,
        "dark_mode_disabled"
      );
      dispatch(getUpdateAppThemeActionObject(THEMES.LIGHT));
    }
  };

  return (
    <Col className="hp-d-flex-center hp-mr-sm-12 hp-mr-12">
      <Switch
        checkedChildren="🌙"
        unCheckedChildren="🌞"
        checked={appTheme === THEMES.LIGHT ? false : true}
        onClick={toggleDarkMode}
      />
    </Col>
  );
};

export default DarkModeToggle;
