import React, { useContext, useState } from "react";
import { Layout, Button, Row, Col } from "antd";
import { RiMenuFill } from "react-icons/ri";

import HeaderUser from "./HeaderUser";
import HeaderNotifications from "./HeaderNotifications";
import HeaderText from "./HeaderText";
import DarkModeToggle from "./DarkModeToggle";
import RulesBackupToggle from "components/sections/Navbars/NavbarRightContent/RulesBackup";
import LINKS from "config/constants/sub/links";
import RulesSyncToggle from "../../../components/sections/Navbars/NavbarRightContent/RulesSyncToggle";
import { store } from "../../../store";
import { getUserAuthDetails } from "../../../utils/GlobalStoreUtils";
import APP_CONSTANTS from "../../../config/constants";

const { Header } = Layout;

const MenuHeader = (props) => {
  const { setVisible, setCollapsed } = props;

  const globalState = useContext(store);
  const { state } = globalState;
  const user = getUserAuthDetails(state);

  const [searchHeader, setSearchHeader] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  // Search Active
  setTimeout(() => setSearchActive(searchHeader), 100);

  // Mobile Sidebar
  const showDrawer = () => {
    setCollapsed(false);
    setVisible(true);
    setSearchHeader(false);
  };

  // Children
  const headerChildren = () => {
    return (
      <Row
        className="hp-w-100 hp-position-relative"
        align="middle"
        justify="space-between"
      >
        <Col className="hp-mobile-sidebar-button hp-mr-24">
          <Button
            className="hp-mobile-sidebar-button"
            type="text"
            onClick={showDrawer}
            icon={
              <RiMenuFill
                size={24}
                className="remix-icon hp-text-color-black-80 hp-text-color-dark-30"
              />
            }
          />
        </Col>

        <Col
          flex="1"
          style={{ display: !searchHeader ? "none" : "block" }}
          className={`hp-pr-md-0 hp-pr-16 hp-header-search ${
            searchActive && "hp-header-search-active"
          }`}
        ></Col>

        {!searchHeader && <HeaderText />}

        <Col>
          <Row align="middle">
            <Col className="hp-d-flex-center hp-mr-sm-12 hp-mr-12">
              <a
                className="light-link"
                href={LINKS.REQUESTLY_GITHUB_ISSUES}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </Col>
            <Col className="hp-d-flex-center hp-mr-sm-12 hp-mr-12">
              <a
                className="light-link"
                href={LINKS.REQUESTLY_DOCS}
                target="_blank"
                rel="noreferrer"
              >
                Docs
              </a>
            </Col>

            <DarkModeToggle />
            <RulesBackupToggle />
            {APP_CONSTANTS.APLHA_TEST_EMAILS.includes(
              user?.details?.profile?.email
            ) ||
            APP_CONSTANTS.APLHA_TEST_EMAIL_DOMAINS.includes(
              user?.details?.profile?.email?.split("@")[1]
            ) ? (
              <RulesSyncToggle />
            ) : null}
            <HeaderNotifications />
            <HeaderUser />
          </Row>
        </Col>
      </Row>
    );
  };

  return (
    <Header>
      <Row justify="center" className="hp-w-100">
        <Col span={24}>{headerChildren()}</Col>
      </Row>
    </Header>
  );
};

export default MenuHeader;
