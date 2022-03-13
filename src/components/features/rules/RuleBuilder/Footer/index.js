import React from "react";
import { Row } from "antd";
import APP_CONSTANTS from "../../../../../../src/config/constants";
import { getModeData } from "../actions";
//Sub components
const Footer = ({ location, clickHandler }) => {
  const { MODE } = getModeData(location);
  return (
    <>
      {MODE === APP_CONSTANTS.RULE_EDITOR_CONFIG.MODES.EDIT ? (
        <Row justify="center">
          <a
            href="https://app.requestly.io/"
            onClick={(e) => {
              e.preventDefault();
              clickHandler();
              return false;
            }}
          >
            Share this rule with your Teammates
          </a>
        </Row>
      ) : null}
    </>
  );
};

export default Footer;
