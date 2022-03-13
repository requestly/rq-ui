import APP_CONSTANTS from "config/constants";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import {
  AddUser,
  Bag2,
  Category,
  Delete,
  Discovery,
  Document,
  Filter,
  PaperUpload,
  Swap,
} from "react-iconly";
import { store } from "store";
import {
  getAppMode,
  getAppTheme,
  getUserAuthDetails,
} from "utils/GlobalStoreUtils";
import { Menu } from "antd";
import { useLocation, Link } from "react-router-dom";
const { SubMenu } = Menu;

const { PATHS } = APP_CONSTANTS;

const givenRoutes = [
  {
    header: "RULES",
    key: "header-rules",
  },
  {
    path: PATHS.RULES.MY_RULES.ABSOLUTE,
    name: "HTTP Rules",
    icon: <Filter set="curved" className="remix-icon" />,
    key: "my-http-rules",
  },
  {
    path: PATHS.RULES.TEMPLATES.ABSOLUTE,
    name: "Templates",
    icon: <Bag2 set="curved" className="remix-icon" />,
    key: "template-rules",
  },
  {
    path: PATHS.TRASH.ABSOLUTE,
    name: "Trash",
    icon: <Delete set="curved" className="remix-icon" />,
    key: "rules-trash",
  },
  {
    header: "MOCKS",
    key: "mocks",
  },
  {
    path: PATHS.MOCK_SERVER.MY_MOCKS.ABSOLUTE,
    name: "Mock APIs",
    icon: <Document set="curved" className="remix-icon" />,
    key: "my-mocks",
  },
  {
    path: PATHS.FILES.MY_FILES.ABSOLUTE,
    name: "File Server",
    icon: <PaperUpload set="curved" className="remix-icon" />,
    key: "my-mock-files",
  },
  {
    header: "SHARING",
    key: "sharing",
  },
  {
    path: PATHS.SHARED_LISTS.MY_LISTS.ABSOLUTE,
    name: "Shared Lists",
    icon: <AddUser set="curved" className="remix-icon" />,
    key: "shared-lists",
  },
  {
    name: "Remote Rules",
    path: PATHS.SETTINGS.REMOTE_RULES.ABSOLUTE,
    icon: <Discovery set="curved" className="remix-icon" />,
    key: "remote-rules",
  },
];

// TODO: @sahil865gupta Remove this after testing or integrate firebase remote config
const TEST_USER_IDS = [
  "tTMwqdoip2RerS4foIln99h5KjI2",
  "9cxfwgyBXKQxj9lU14GiTO5KTNY2",
  "TW8rHZL2R9dSBxR2gAOBPB3QHfL2",
];

const MenuItem = (props) => {
  const { onClose } = props;
  // Location
  const location = useLocation();
  const { pathname } = location;

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };
  const useHasChanged = (val) => {
    const prevVal = usePrevious(val);
    return prevVal !== val;
  };

  // Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const appMode = getAppMode(state);
  const appTheme = getAppTheme(state);
  const user = getUserAuthDetails(state);

  // Component State
  const [myRoutes, setMyRoutes] = useState(givenRoutes);
  const [isInitialUIDCheckDone, setIsInitialUIDCheckDone] = useState(false);

  const splitLocation = pathname.split("/");
  const hasUIDChanged = useHasChanged(user?.details?.profile?.uid);

  // Menu
  const splitLocationUrl =
    splitLocation[splitLocation.length - 2] +
    "/" +
    splitLocation[splitLocation.length - 1];

  // Set desktop app routes
  useEffect(() => {
    // For Desktop App - Show Sources menu in Navbar only in  Desktop App
    if (appMode && appMode === GLOBAL_CONSTANTS.APP_MODES.DESKTOP) {
      const allRoutes = [...myRoutes];
      // Check if doesn't exist already!
      if (allRoutes.some((route) => route.key === "my-apps")) return;
      allRoutes.unshift({
        path: PATHS.DESKTOP.MY_APPS.ABSOLUTE,
        key: "my-apps",
        name: "Connected Apps",
        icon: <Category set="curved" className="remix-icon" />,
      });
      allRoutes.unshift({
        path: PATHS.DESKTOP.INTERCEPT_TRAFFIC.ABSOLUTE,
        key: "network-traffic",
        name: "Network Traffic",
        icon: <Swap set="curved" className="remix-icon" />,
      });
      setMyRoutes(allRoutes);
    }
  }, [appMode, myRoutes]);

  // Set Android Interceptor Routes
  useEffect(() => {
    if (!hasUIDChanged && isInitialUIDCheckDone) return;
    setIsInitialUIDCheckDone(true);
    // Android Interceptor. Testing Users
    const userId = user?.details?.profile?.uid;
    if (!userId) return;

    let allRoutes = [...myRoutes];

    if (TEST_USER_IDS.includes(userId)) {
      // if (true) {
      // SHOW the Android Route
      if (allRoutes.some((route) => route.key === "android-interceptor"))
        return; // Ignore if already exists
      allRoutes.unshift({
        path: PATHS.ANDROID_INTERCEPTOR.ABSOLUTE,
        name: "Android Interceptor",
        icon: <Swap set="curved" className="remix-icon" />,
        key: "android-interceptor",
      });
    } else {
      // HIDE the Android Route
      if (allRoutes.some((route) => route.key === "android-interceptor")) {
        allRoutes = allRoutes.filter(
          (route) => route.key !== "android-interceptor"
        );
      } else {
        // Ignore if already hidden
        return;
      }
    }

    setMyRoutes(allRoutes);
  }, [
    hasUIDChanged,
    isInitialUIDCheckDone,
    myRoutes,
    user?.details?.profile?.uid,
  ]);

  const menuItem = myRoutes.map((item) => {
    if (item.header) {
      return (
        <Menu.ItemGroup key={item.key} title={item.header}></Menu.ItemGroup>
      );
    }

    if (item.children) {
      return (
        <SubMenu key={item.key} icon={item.icon} title={item.name}>
          {item.children.map((child) => {
            if (!child.children) {
              const childrenNavLink = child.path.split("/");

              return (
                // Level 2
                <Menu.Item
                  key={child.key}
                  icon={child.icon}
                  className={
                    splitLocationUrl ===
                    childrenNavLink[childrenNavLink.length - 2] +
                      "/" +
                      childrenNavLink[childrenNavLink.length - 1]
                      ? "ant-menu-item-selected"
                      : "ant-menu-item-selected-in-active"
                  }
                  onClick={onClose}
                >
                  <Link to={child.path}>{child.name}</Link>
                </Menu.Item>
              );
            } else {
              return (
                // Level 3
                <SubMenu key={child.key} title={child.name}>
                  {child.children.map((childItem) => {
                    const childrenItemLink = childItem.path.split("/");

                    return (
                      <Menu.Item
                        key={childItem.key}
                        className={
                          splitLocationUrl ===
                          childrenItemLink[childrenItemLink.length - 2] +
                            "/" +
                            childrenItemLink[childrenItemLink.length - 1]
                            ? "ant-menu-item-selected"
                            : "ant-menu-item-selected-in-active"
                        }
                        onClick={onClose}
                      >
                        <Link to={childItem.path}>{childItem.name}</Link>
                      </Menu.Item>
                    );
                  })}
                </SubMenu>
              );
            }
          })}
        </SubMenu>
      );
    } else {
      const itemNavLink = item.path.split("/");

      return (
        // Level 1
        <Menu.Item
          key={item.key}
          icon={item.icon}
          onClick={onClose}
          className={
            splitLocation[splitLocation.length - 2] +
              "/" +
              splitLocation[splitLocation.length - 1] ===
            itemNavLink[itemNavLink.length - 2] +
              "/" +
              itemNavLink[itemNavLink.length - 1]
              ? "ant-menu-item-selected"
              : "ant-menu-item-selected-in-active"
          }
        >
          <Link to={item.path}>{item.name}</Link>
        </Menu.Item>
      );
    }
  });

  return (
    <Menu
      mode="inline"
      defaultOpenKeys={[
        splitLocation.length === 5
          ? splitLocation[splitLocation.length - 3]
          : null,
        splitLocation[splitLocation.length - 2],
      ]}
      theme={appTheme}
      style={{ paddingBottom: "2.4rem" }}
    >
      {menuItem}
    </Menu>
  );
};

export default MenuItem;
