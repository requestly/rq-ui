import React from "react";
import { Drawer } from "antd";
import { RiCloseFill } from "react-icons/ri";
import MenuLogo from "../MenuLogo";
import MenuItem from "../MenuItem";
import MenuFooter from "../MenuFooter";

const MenuMobile = (props) => {
  const { onClose, visible } = props;
  return (
    <Drawer
      title={<MenuLogo onClose={onClose} />}
      className="hp-mobile-sidebar"
      placement="left"
      closable={true}
      onClose={onClose}
      visible={visible}
      closeIcon={
        <RiCloseFill className="remix-icon hp-text-color-black-80" size={24} />
      }
    >
      <MenuItem onClose={onClose} />

      <MenuFooter onClose={onClose} collapsed={false} />
    </Drawer>
  );
};

export default MenuMobile;
