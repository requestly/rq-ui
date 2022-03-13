import React, { useContext, useState } from "react";
import { PopoverBody, PopoverHeader, Popover } from "reactstrap";
import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// ICONS
import { FaNetworkWired } from "react-icons/fa";
// STORE
import { store } from "../../../../../../store";
// UTILS
import { getAppMode } from "../../../../../../utils/GlobalStoreUtils";
import {
  redirectToAppMode,
  // redirectToDekstopHomepage,
} from "../../../../../../utils/RedirectionUtils";
import { getShortAppModeName } from "../../../../../../utils/FormattingHelper";
// DATA
import { AppModesConfig } from "./data";

const AppModeSelector = () => {
  const navigate = useNavigate();
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const appMode = getAppMode(state);
  // Component State
  const [popoverOpen, setPopoverOpen] = useState(false);

  const toggle = () => setPopoverOpen(!popoverOpen);

  return (
    <React.Fragment>
      <span
        id="UncontrolledPopover"
        style={{ color: "white" }}
        className="bright-on-hover cursor-pointer ml-0 ml-sm-2"
      >
        <FaNetworkWired className="fix-icon-is-down" />
        <span className="ml-2 mr-4 text-sm font-weight-bold">
          {getShortAppModeName(appMode)}
        </span>
      </span>

      <Popover
        target="UncontrolledPopover"
        trigger="legacy"
        placement="left-start"
        hideArrow={true}
        isOpen={popoverOpen}
        toggle={toggle}
      >
        <PopoverHeader className=" bg-default white-color no-bottom-border text-align-center">
          Use Requestly with
        </PopoverHeader>
        <PopoverBody className=" bg-default">
          <div className="row shortcuts px-4 ">
            {Object.keys(AppModesConfig).map((appMode) => {
              return (
                <span
                  className="col shortcut-item cursor-pointer"
                  key={appMode}
                  onClick={() => {
                    setPopoverOpen(false);
                    redirectToAppMode(navigate);
                  }}
                >
                  <span
                    className={`shortcut-media avatar rounded-circle bg-gradient-${AppModesConfig[appMode].iconBackgroundColor}`}
                  >
                    {React.createElement(AppModesConfig[appMode].Icon)}
                  </span>
                  <small className="white-color bright-on-hover">
                    {AppModesConfig[appMode].shortName}
                  </small>
                </span>
              );
            })}
          </div>
        </PopoverBody>
      </Popover>
    </React.Fragment>
  );
};

export default AppModeSelector;
