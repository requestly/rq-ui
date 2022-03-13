import React, { useRef, useEffect, useContext } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
//FOR ROUTER
import routes from "../../routes";
//SUB COMPONENTS
import SpinnerModal from "components/misc/SpinnerModal";
import AuthModal from "components/authentication/AuthModal";
//CONSTANTS
import APP_CONSTANTS from "config/constants";
//STORE
import { store } from "../../store";
import { getToggleActiveModalActionObject } from "store/action-objects";
//UTILS
import {
  getActiveModals,
  getIfTrialModeEnabled,
  getUserAuthDetails,
} from "utils/GlobalStoreUtils";
import { pageVisitEvent } from "utils/AnalyticsUtils";
import { getRouteFromCurrentPath } from "utils/URLUtils";
import ExtensionModal from "components/user/ExtensionModal/index.js";
import { isTrialPlanExpired } from "../../utils/PremiumUtils";
import FreeTrialExpiredModal from "../../components/landing/pricing/FreeTrialExpiredModal";
import SyncConsentModal from "../../components/user/SyncConsentModal";

const { PATHS } = APP_CONSTANTS;

const DashboardContent = () => {
  const location = useLocation();
  //Global Routes
  const globalState = useContext(store);
  const { state, dispatch } = globalState;
  const activeModals = getActiveModals(state);
  const user = getUserAuthDetails(state);
  const isTrialModeEnabled = getIfTrialModeEnabled(state);

  const toggleSpinnerModal = () => {
    dispatch(getToggleActiveModalActionObject("loadingModal"));
  };
  const toggleAuthModal = () => {
    dispatch(getToggleActiveModalActionObject("authModal"));
  };
  const toggleExtensionModal = () => {
    dispatch(getToggleActiveModalActionObject("extensionModal"));
  };
  const toggleSyncConsentModal = () => {
    dispatch(getToggleActiveModalActionObject("syncConsentModal"));
  };

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const prevProps = usePrevious({ location });

  useEffect(() => {
    if (prevProps && prevProps.location !== location) {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      document.getElementById("dashboardMainContent").scrollTop = 0;
    }

    // ANALYTICS
    if (!prevProps || prevProps.location !== location) {
      pageVisitEvent(getRouteFromCurrentPath(location.pathname));
    }
  }, [location, prevProps]);

  useEffect(() => {
    if (
      !user.loggedIn &&
      isTrialModeEnabled &&
      !location.pathname.includes("pricing")
    ) {
      dispatch(
        getToggleActiveModalActionObject("authModal", true, {
          closable: false,
          authMode: APP_CONSTANTS.AUTH.ACTION_LABELS.SIGN_UP,
        })
      );
    }
  }, [dispatch, isTrialModeEnabled, location, user.loggedIn]);

  useEffect(() => {
    if (
      user.loggedIn &&
      isTrialModeEnabled &&
      !location.pathname.includes("pricing") &&
      isTrialPlanExpired(user?.details?.planDetails)
    ) {
      dispatch(
        getToggleActiveModalActionObject("freeTrialExpiredModal", true, {
          closable: false,
        })
      );
    }
  }, [
    dispatch,
    isTrialModeEnabled,
    location,
    user?.details?.planDetails,
    user.loggedIn,
  ]);

  const getRoutes = (routes) => {
    return routes.map((route, key) => {
      const propsFromRoute = route.props || {};
      return (
        <Route
          path={"/".concat(route.path).replace(/\/\//g, "/")}
          key={key}
          element={
            <route.component location={window.location} {...propsFromRoute} />
          }
        />
      );
    });
  };

  return (
    <>
      <div id="dashboardMainContent">
        <Routes>
          {getRoutes(routes)}
          <Route
            path={PATHS.ROOT}
            element={<Navigate to={PATHS.RULES.ABSOLUTE} />}
          />
          <Route
            path={PATHS.INDEX_HTML}
            element={<Navigate to={PATHS.RULES.ABSOLUTE} />}
          />
          <Route
            path={PATHS.FEEDBACK.ABSOLUTE}
            element={<Navigate to={PATHS.FEEDBACK.ABSOLUTE} />}
          />
          {/* <Route
            path={PATHS.RULES.ABSOLUTE}
            element={
              <Navigate
                to={<ProtectedRoute component={<RulesIndexView />} />}
              />
            }
          /> */}

          {/** SUPPORT LEGACY URLS */}
          <Route
            path={PATHS.LEGACY.FILES_LIBRARY.ABSOLUTE + "/:id"}
            element={<Navigate to={PATHS.FILES.VIEWER.ABSOLUTE + "/:id"} />}
          />
          <Route
            path={PATHS.LEGACY.PRICING.ABSOLUTE}
            element={<Navigate to={PATHS.PRICING.ABSOLUTE} />}
          />
          <Route
            path={PATHS.LEGACY.LICENSE.MANAGE.ABSOLUTE}
            element={<Navigate to={PATHS.LICENSE.MANAGE.ABSOLUTE} />}
          />
          <Route
            path={PATHS.LEGACY.LICENSE.ABSOLUTE}
            element={<Navigate to={PATHS.LICENSE.ABSOLUTE} />}
          />
          <Route
            path={PATHS.LEGACY.SETTINGS.REMOTE_RULES.ABSOLUTE}
            element={<Navigate to={PATHS.SETTINGS.REMOTE_RULES.ABSOLUTE} />}
          />
          <Route
            path={PATHS.LEGACY.SETTINGS.ABSOLUTE}
            element={<Navigate to={PATHS.SETTINGS.ABSOLUTE} />}
          />
          <Route
            path={PATHS.LEGACY.UNLOCK_PREMIUM.ABSOLUTE}
            element={<Navigate to={PATHS.UNLOCK_PREMIUM.ABSOLUTE} />}
          />
          <Route
            path={PATHS.LEGACY.GOODBYE.ABSOLUTE}
            element={<Navigate to={PATHS.GOODBYE.ABSOLUTE} />}
          />
          <Route
            path={PATHS.EXTENSION_INSTALLED.RELATIVE}
            element={<Navigate to={PATHS.EXTENSION_INSTALLED.ABSOLUTE} />}
          />
          <Route
            path={PATHS.ANY}
            element={<Navigate to={PATHS.PAGE404.ABSOLUTE} />}
          />
        </Routes>
      </div>

      {/* MODALS */}
      {activeModals.loadingModal.isActive ? (
        <SpinnerModal
          isOpen={activeModals.loadingModal.isActive}
          toggle={() => toggleSpinnerModal()}
        />
      ) : null}
      {activeModals.authModal.isActive ? (
        <AuthModal
          isOpen={activeModals.authModal.isActive}
          toggle={() => toggleAuthModal()}
          {...activeModals.authModal.props}
        />
      ) : null}
      {activeModals.extensionModal.isActive ? (
        <ExtensionModal
          isOpen={activeModals.extensionModal.isActive}
          toggle={() => toggleExtensionModal()}
          {...activeModals.extensionModal.props}
        />
      ) : null}
      {activeModals.freeTrialExpiredModal.isActive ? (
        <FreeTrialExpiredModal
          isOpen={activeModals.freeTrialExpiredModal.isActive}
          {...activeModals.freeTrialExpiredModal.props}
        />
      ) : null}
      {activeModals.syncConsentModal.isActive ? (
        <SyncConsentModal
          isOpen={activeModals.syncConsentModal.isActive}
          toggle={toggleSyncConsentModal}
          {...activeModals.syncConsentModal.props}
        />
      ) : null}
    </>
  );
};

export default DashboardContent;
