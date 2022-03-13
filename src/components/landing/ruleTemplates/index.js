import React, { useState, useContext } from "react";
import { Table, Tag, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { redirectToSharedListViewer } from "../../../utils/RedirectionUtils";
import { store } from "../../../store/index";
import { getAppMode, getUserAuthDetails } from "utils/GlobalStoreUtils";
import { getAllRules } from "../../../utils/GlobalStoreUtils";
import RulePreviewModal from "./RulePreviewModal";
import LimitReachedModal from "../../user/LimitReachedModal";
import { getNumberOfRulesImportAllowed } from "../../../utils/ImportUtils";
import { trackTemplateClicked } from "utils/analytics/rules/template";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import { isExtensionInstalled } from "actions/ExtensionActions";
import APP_CONSTANTS from "../../../config/constants";
import InstallExtensionCTA from "components/misc/InstallExtensionCTA";
import ProCard from "@ant-design/pro-card";
import {
  FaQuestion,
  FaBan,
  FaRandom,
  FaTablet,
  FaHeading,
  FaCode,
  FaCodeBranch,
  FaExchangeAlt,
  FaRegClock,
} from "react-icons/fa";
const { templates } = require("./templates.json");
const TemplatesIndexPage = () => {
  const navigate = useNavigate();
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const userDetails = getUserAuthDetails(state);
  const appMode = getAppMode(state);

  const filteredRuleTemplates = templates.filter((template) => {
    return template.data.targetAppMode.includes(appMode);
  });
  const userPlanName =
    userDetails.details?.planDetails?.planName ||
    APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE;

  const [
    isSharedListRuleViewerModalActive,
    setIsSharedListRuleViewModalActive,
  ] = useState(false);
  const [ruleToViewInModal, setRuleToViewInModal] = useState(false);
  const [isLimitReachedModalActive, setIsLimitReachedModalActive] = useState(
    false
  );

  const toggleSharedListRuleViewerModal = () => {
    setIsSharedListRuleViewModalActive(!isSharedListRuleViewerModalActive);
  };
  const toggleLimitReachedModal = () => {
    setIsLimitReachedModalActive((prev) => !prev);
  };

  const openRuleViewerInModal = (rule) => {
    trackTemplateClicked(
      rule.ruleDefinition.name,
      rule.ruleDefinition.ruleType
    );
    const allRules = getAllRules(state);
    const currentNumberOfRules = allRules.length;
    const importRulesAllowed = getNumberOfRulesImportAllowed(
      userPlanName,
      userDetails,
      currentNumberOfRules
    );
    if (importRulesAllowed === 0) {
      setIsLimitReachedModalActive(true);
    } else {
      setRuleToViewInModal(rule);
      setIsSharedListRuleViewModalActive(true);
    }
  };
  const viewSharedList = (data) => {
    trackTemplateClicked(data.sharedListName, "Shared_List");
    redirectToSharedListViewer(
      navigate,
      data.shareId,
      data.sharedListName,
      true
    );
  };
  const icons = {
    Redirect: () => <FaRandom className="fix-icon-is-up" />,
    QueryParam: () => <FaQuestion className="fix-icon-is-up" />,
    Cancel: () => <FaBan className="fix-icon-is-up" />,
    Replace: () => <FaExchangeAlt className="fix-icon-is-up" />,
    Script: () => <FaCode className="fix-icon-is-up" />,
    Response: () => <FaCodeBranch className="fix-icon-is-up" />,
    Delay: () => <FaRegClock className="fix-icon-is-up" />,
    Headers: () => <FaHeading className="fix-icon-is-up" />,
    Useragent: () => <FaTablet className="fix-icon-is-up" />,
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "25%",
      key: "name",
      render: (text, record) => (
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            record.isSharedList
              ? viewSharedList(record.data)
              : openRuleViewerInModal(record.data);
            return false;
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      width: "40%",
      key: "description",
    },
    {
      title: "Rule",
      key: "tags",
      dataIndex: "tags",
      width: "20%",
      render: (tags) => (
        <>
          {tags.map((tag) => {
            return (
              <Tag key={tag}>
                {" "}
                {icons[tag]()}&nbsp; {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <Space size="middle">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                record.isSharedList
                  ? viewSharedList(record.data)
                  : openRuleViewerInModal(record.data);
                return false;
              }}
            >
              Use this
            </a>
          </Space>
        );
      },
    },
  ];
  if (
    appMode === GLOBAL_CONSTANTS.APP_MODES.EXTENSION &&
    !isExtensionInstalled()
  ) {
    return <InstallExtensionCTA />;
  }

  return (
    <React.Fragment>
      <ProCard className="primary-card github-like-border" title={null}>
        <h2>Templates</h2>
        {isSharedListRuleViewerModalActive ? (
          <RulePreviewModal
            isOpen={isSharedListRuleViewerModalActive}
            toggle={toggleSharedListRuleViewerModal}
            rule={ruleToViewInModal}
          />
        ) : null}
        {isLimitReachedModalActive ? (
          <LimitReachedModal
            isOpen={isLimitReachedModalActive}
            toggle={toggleLimitReachedModal}
            featureName={APP_CONSTANTS.FEATURES.IMPORT}
            userPlanName={userPlanName}
          />
        ) : null}
        <Table
          columns={columns}
          dataSource={filteredRuleTemplates}
          pagination={false}
        />
      </ProCard>
    </React.Fragment>
  );
};

export default TemplatesIndexPage;
