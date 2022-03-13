import React, { useContext } from "react";
import { Link } from "react-router-dom";
import RQ_LOGO_DEFAULT_BLUE from "assets/img/brand/rq-full-logo-default-blue.svg";
import RQ_LOGO_LIGHT_BLUE from "assets/img/brand/rq-full-logo-light-blue.svg";
import { store } from "store";
import { getAppTheme } from "utils/GlobalStoreUtils";
import APP_CONSTANTS from "config/constants";

const { THEMES } = APP_CONSTANTS;

const MenuLogo = (props) => {
  //GLOBAL STATE
  const globalState = useContext(store);
  const { state } = globalState;
  const appTheme = getAppTheme(state);

  return (
    <>
      <Link
        to="/"
        className="hp-header-logo hp-d-flex hp-align-items-end"
        onClick={props.onClose}
      >
        <img
          className="hp-logo"
          src={
            appTheme === THEMES.LIGHT
              ? RQ_LOGO_DEFAULT_BLUE
              : RQ_LOGO_LIGHT_BLUE
          }
          alt="logo"
          style={{ height: "60px" }}
        />
      </Link>
    </>
  );
};

export default MenuLogo;
