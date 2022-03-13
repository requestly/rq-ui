import React, { createElement, useEffect } from "react";
import { Layout, Button, Row, Col } from "antd";
import MenuLogo from "./MenuLogo";
import { RiMenuFoldLine, RiMenuUnfoldLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import RQ_SQUARE_ICON from "assets/img/brand/rq_logo.svg";
import MenuItem from "./MenuItem";
import MenuFooter from "./MenuFooter";
import MenuMobile from "./MenuMobile";

const { Sider } = Layout;

const Sidebar = (props) => {
  const { visible, setVisible, collapsed, setCollapsed } = props;
  // Collapsed

  // Mobile Sidebar
  const onClose = () => {
    setVisible(false);
  };

  // Menu
  function toggle() {
    localStorage.setItem("sidebar-collapsed", !collapsed);
    setCollapsed(!collapsed);
  }

  const trigger = createElement(collapsed ? RiMenuUnfoldLine : RiMenuFoldLine, {
    className: "trigger",
    onClick: toggle,
  });

  useEffect(() => {
    if (localStorage.getItem("sidebar-collapsed") === "true") {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [setCollapsed]);

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={256}
      className="hp-sidebar hp-bg-color-black-0 hp-bg-color-dark-100 github-like-right-border"
    >
      <Row
        className="hp-mr-12 hp-ml-24 hp-mt-24"
        align="bottom"
        justify="space-between"
      >
        <Col>{collapsed === false ? <MenuLogo onClose={onClose} /> : ""}</Col>

        <Col className="hp-pr-0">
          <Button
            icon={trigger}
            type="text"
            className="hp-float-right hp-text-color-dark-0"
          ></Button>
        </Col>

        {collapsed !== false && (
          <Col className="hp-mt-8">
            <Link to="/" onClick={onClose}>
              <img className="hp-logo" src={RQ_SQUARE_ICON} alt="logo" />
            </Link>
          </Col>
        )}
      </Row>

      <MenuItem onClose={onClose} />

      <MenuFooter onClose={onClose} collapsed={collapsed} />

      <MenuMobile onClose={onClose} visible={visible} />
    </Sider>
  );
};

export default Sidebar;
