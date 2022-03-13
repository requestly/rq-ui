import { Typography, Row, Col, Space } from "antd";
import { useNavigate } from "react-router-dom";
import {
  redirectToGDPRPage,
  redirectToPrivacyPolicy,
} from "utils/RedirectionUtils";
import APP_CONSTANTS from "config/constants";
import { Footer } from "antd/lib/layout/layout";
import { FaYCombinator } from "react-icons/fa";
import { useContext } from "react";
import { store } from "store";
import { getAppTheme } from "utils/GlobalStoreUtils";

const { Text } = Typography;
const { THEMES } = APP_CONSTANTS;

const MenuFooter = () => {
  // Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const appTheme = getAppTheme(state);

  const renderFooterLinks = () => {
    return (
      <Space size={"large"}>
        <Text
          className="cursor-pointer"
          onClick={() =>
            window.open(APP_CONSTANTS.LINKS.CONTACT_US_PAGE, "_blank")
          }
        >
          Support
        </Text>
        <Text
          className="cursor-pointer"
          onClick={() => redirectToPrivacyPolicy(navigate, { newTab: true })}
        >
          Privacy Policy
        </Text>

        <Text
          className="cursor-pointer"
          onClick={() => redirectToGDPRPage(navigate, { newTab: true })}
        >
          GDPR
        </Text>
        <Text
          className="cursor-pointer"
          onClick={() =>
            window.open(APP_CONSTANTS.LINKS.CONTACT_US_PAGE, "_blank")
          }
        >
          Contact Us
        </Text>
      </Space>
    );
  };

  const renderYCBranding = () => {
    return (
      <Text>
        Backed by{" "}
        <span
          style={{ color: "orange", cursor: "pointer" }}
          onClick={() =>
            window.open(
              "https://twitter.com/ycombinator/status/1468968505596776469",
              "_blank"
            )
          }
        >
          <FaYCombinator className="fix-icon-is-up" /> Combinator
        </span>
      </Text>
    );
  };

  const navigate = useNavigate();
  return (
    <>
      <Footer
        style={{ padding: "18px 32px" }}
        className="hp-bg-color-black-10 hp-bg-color-dark-100 dark-bg-footer"
      >
        <Row align="middle" justify="space-between">
          <Col md={12} span={24}>
            <p className="hp-badge-text hp-mb-0 hp-text-color-dark-30 dark-bg-footer">
              © 2014 - 2022{" "}
              <a
                className="font-weight-bold ml-1 dark-bg-footer"
                href="https://requestly.io"
                rel="noopener noreferrer"
                target="_blank"
              >
                RQ Labs, Inc.
              </a>
            </p>
          </Col>

          <Col
            md={12}
            span={24}
            className="hp-mt-sm-8 hp-text-sm-center hp-text-right dark-bg-footer"
          >
            {appTheme === THEMES.LIGHT
              ? renderFooterLinks()
              : renderYCBranding()}
          </Col>
        </Row>
      </Footer>
    </>
  );
};

export default MenuFooter;
