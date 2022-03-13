import { Col, Statistic } from "antd";
import moment from "moment";
import { Document, Upload } from "react-iconly";
import { Link, useLocation } from "react-router-dom";
import { isPricingPage } from "utils/PathUtils";
import YC_DARK from "assets/img/brand/YC_backed_dark.png";
import YC_LIGHT from "assets/img/brand/YC_backed_light.svg";
import {
  getAppMode,
  getAppTheme,
  getUserAuthDetails,
} from "utils/GlobalStoreUtils";
import APP_CONSTANTS from "config/constants";
import { useContext } from "react";
import { store } from "store";
import DesktopAppProxyInfo from "components/sections/Navbars/NavbarRightContent/DesktopAppProxyInfo";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import { getUserOS } from "utils/Misc";
import TextLoop from "react-text-loop";
import { DiAndroid } from "react-icons/di";
import {
  FaDocker,
  FaExternalLinkAlt,
  FaNodeJs,
  FaSafari,
} from "react-icons/fa";
import { SiIntellijidea, SiPostman } from "react-icons/si";
import { isTrialPlan } from "../../../utils/PremiumUtils";
import { FiTwitter } from "react-icons/fi";

const { THEMES } = APP_CONSTANTS;

const { Countdown } = Statistic;

export default function HeaderText() {
  const location = useLocation();
  // GLOBAL STATE
  const globalState = useContext(store);
  const { state } = globalState;
  const appTheme = getAppTheme(state);
  const appMode = getAppMode(state);
  const user = getUserAuthDetails(state);

  const renderTrialCountdown = () => {
    const isTodayPlanEndDay = () => {
      const userPlanEndDate = moment(
        user?.details?.planDetails?.subscription?.endDate
      );
      const currentDate = moment();
      return userPlanEndDate.isSame(currentDate, "day");
    };

    return (
      <Col xl={14} lg={12} className="hp-header-left-text hp-d-flex-center">
        <span className="hp-header-left-text-item hp-input-label hp-text-color-black-100 hp-text-color-dark-0 hp-ml-16 hp-mb-0 hp-mr-4">
          {"🚀 Your free trial will end in "}{" "}
        </span>
        <Countdown
          value={moment(user?.details?.planDetails?.subscription?.endDate).add(
            1,
            "days"
          )}
          format={isTodayPlanEndDay() ? "H [hours] m[m] s[s]." : "D [days]."}
          valueStyle={{ fontSize: "0.9rem", fontWeight: "bold" }}
        />
        &nbsp;
        <Link
          to={APP_CONSTANTS.PATHS.PRICING.ABSOLUTE}
          className="hp-ml-8 hp-text-color-black-60"
        >
          <span className="hp-font-weight-300 hp-text-color-danger-3">
            Upgrade Now
          </span>
        </Link>
      </Col>
    );
  };

  const renderDesktopPromoBanner = () => {
    const userOS = getUserOS() || "Desktop";

    return (
      <Col xl={14} lg={12} className="hp-header-left-text hp-d-flex-center">
        <Document
          set="curved"
          size="large"
          className="remix-icon hp-update-icon hp-text-color-primary-1 hp-text-color-dark-0 hp-p-4 hp-bg-color-primary-4 hp-bg-color-dark-70"
        />
        <span className="hp-header-left-text-item hp-input-label hp-text-color-black-100 hp-text-color-dark-0 hp-ml-16 hp-mb-0">
          Use Requestly with{" "}
          <TextLoop interval={2500}>
            <span>
              Safari <FaSafari className="fix-icon-is-up" />
            </span>
            <span>
              Android Emulator <DiAndroid className="fix-icon-is-up" />
            </span>
            <span>
              IntelliJ <SiIntellijidea className="fix-icon-is-up" />
            </span>
            <span>
              Postman <SiPostman className="fix-icon-is-up" />
            </span>
            <span>
              NodeJS <FaNodeJs className="fix-icon-is-up" />
            </span>
            <span>
              Docker <FaDocker className="fix-icon-is-up" />
            </span>
          </TextLoop>{" "}
          &nbsp;
          <span className="hp-font-weight-300 hp-text-color-danger-3">
            Switch to new Requestly for {userOS}.
          </span>
          <a
            href="https://bit.ly/3JScYu9"
            className="hp-ml-8 hp-text-color-black-60"
            target="_blank"
            rel="noreferrer"
          >
            <Upload set="curved" className="remix-icon hp-text-color-dark-5" />
          </a>
        </span>
      </Col>
    );
  };
  const renderTwitterPromo = () => {
    return (
      <Col xl={14} lg={12} className="hp-header-left-text hp-d-flex-center">
        <FiTwitter />
        <span className="hp-header-left-text-item hp-input-label hp-text-color-black-100 hp-text-color-dark-0 hp-ml-16 hp-mb-0">
          We regularly share Developer tips and tricks. &nbsp;
          <span className="hp-font-weight-300 hp-text-color-danger-3">
            Do checkout Requestly on Twitter
          </span>
          <a
            href="https://bit.ly/rq-twitter"
            className="hp-ml-8 hp-text-color-black-60"
            target="_blank"
            rel="noreferrer"
          >
            <FaExternalLinkAlt />
          </a>
        </span>
      </Col>
    );
  };

  const renderYCLogo = () => {
    return (
      <Col xl={16} lg={14} className="hp-header-left-text hp-d-flex-center">
        <Link to="/">
          <img
            src={appTheme === THEMES.LIGHT ? YC_LIGHT : YC_DARK}
            style={{
              boxSizing: "border-box",
              display: "inline-block",
              maxHeight: "4em",
              verticalAlign: "middle",
            }}
            alt="logo"
          />
        </Link>
      </Col>
    );
  };
  const renderProxyInfo = () => {
    return (
      <>
        <Col xl={14} lg={12} className="hp-header-left-text hp-d-flex-center">
          <Link to="/">
            <DesktopAppProxyInfo />
          </Link>
        </Col>
      </>
    );
  };

  if (isPricingPage(location.pathname)) {
    return renderYCLogo();
  }

  if (appMode === GLOBAL_CONSTANTS.APP_MODES.DESKTOP) {
    return renderProxyInfo();
  }

  if (
    user?.details?.isPremium &&
    isTrialPlan(user?.details?.planDetails?.type)
  ) {
    return renderTrialCountdown();
  }

  const SHOW_TWITTER_BANNER = true;
  if (SHOW_TWITTER_BANNER) return renderTwitterPromo();

  return renderDesktopPromoBanner();
}
