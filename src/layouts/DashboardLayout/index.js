import React, { useContext, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
// Utils
import { isPricingPage } from "utils/PathUtils.js";
import { getAppMode } from "utils/GlobalStoreUtils";
// Global Store
import { store } from "../../store";
// Constants
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import Footer from "../../components/sections/Footer/index";
// Static
import PATHS from "config/constants/sub/paths";
import DashboardContent from "./DashboardContent";
import { Col, Layout, Row } from "antd";
import Sidebar from "./Sidebar";
import MenuHeader from "./MenuHeader";
import { Content } from "antd/lib/layout/layout";

const DashboardLayout = () => {
  const location = useLocation();
  // GLobal State
  const globalState = useContext(store);
  const { state } = globalState;
  const appMode = getAppMode(state);
  // Component State
  const [visible, setVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const AppFooter = () => {
    return appMode &&
      appMode ===
        GLOBAL_CONSTANTS.APP_MODES.DESKTOP ? null : location.pathname.includes(
        PATHS.RULES.MY_RULES.ABSOLUTE
      ) || location.pathname.includes(PATHS.PRICING.ABSOLUTE) ? (
      <Footer />
    ) : null;
  };

  return (
    <>
      <Layout className="hp-app-layout">
        {isPricingPage(location.pathname) ? null : (
          <Sidebar
            visible={visible}
            setVisible={setVisible}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        )}

        <Layout className="hp-bg-color-dark-90">
          <MenuHeader setVisible={setVisible} setCollapsed={setCollapsed} />

          <Content className="hp-content-main">
            <Row justify="center">
              <Col span={24}>
                <React.Fragment>
                  <Routes>
                    <Route
                      path={PATHS.DASHBOARD + PATHS.ANY}
                      element={<DashboardContent />}
                    />
                  </Routes>
                </React.Fragment>
              </Col>
            </Row>
          </Content>

          <AppFooter />
        </Layout>
      </Layout>
    </>
  );
};

export default DashboardLayout;
