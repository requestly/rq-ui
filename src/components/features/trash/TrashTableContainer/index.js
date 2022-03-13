import React, { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Tooltip, Space, Tag, Button } from "antd";
//STORE
import { store } from "../../../../store";
//UTILS
import * as GlobalStoreUtils from "../../../../utils/GlobalStoreUtils";
import { toast } from "utils/Toast";
import { getFeatureLimits } from "utils/FeatureManager";
import { redirectToPricingPlans } from "utils/RedirectionUtils";
import { submitEventUtil, trackRQLastActivity } from "utils/AnalyticsUtils";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import APP_CONSTANTS from "../../../../config/constants";
import * as ACTION_OBJECTS from "store/action-objects";
import ProCard from "@ant-design/pro-card";
import ProTable from "@ant-design/pro-table";
import {
  DeleteOutlined,
  ImportOutlined,
  LockOutlined,
} from "@ant-design/icons";
import moment from "moment";
import ReactHoverObserver from "react-hover-observer";
import Text from "antd/lib/typography/Text";
import SharedListViewerModal from "components/features/rules/SharedListRuleViewerModal";
import {
  deleteRecordsFromTrash,
  importRecordsToLocalStorage,
} from "utils/trash/TrashUtils";
import { getSetSelectedRulesActionObject } from "store/action-objects";
import { getPrettyPlanName } from "../../../../utils/FormattingHelper";
import LimitReachedModal from "../../../user/LimitReachedModal";
import {
  checkIfCompleteImportAllowed,
  getNumberOfRulesImportAllowed,
} from "../../../../utils/ImportUtils";

const { Link } = Typography;

const TrashTableContainer = ({ records, updateTrash }) => {
  //Global State
  const globalState = useContext(store);
  const { state, dispatch } = globalState;
  const user = GlobalStoreUtils.getUserAuthDetails(state);
  const allRules = GlobalStoreUtils.getAllRules(state);

  // fetch planName from global state
  const userPlanName =
    user.details?.planDetails?.planName ||
    APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE;

  const trashLimitForUser = getFeatureLimits(
    APP_CONSTANTS.FEATURES.TRASH,
    user,
    userPlanName
  );

  const appMode = GlobalStoreUtils.getAppMode(state);
  const rulesSelection = GlobalStoreUtils.getRulesSelection(state);

  const getSelectedRules = (rulesSelection) => {
    return Object.keys(rulesSelection).filter(
      (ruleId) => rulesSelection[ruleId]
    );
  };

  const selectedRules = getSelectedRules(rulesSelection);

  const unselectAllRules = (dispatch) => {
    //Unselect All Rules
    dispatch(ACTION_OBJECTS.getClearSelectedRulesActionObject());
  };

  const navigate = useNavigate();

  const cleanup = () => {
    //Unselect all rules
    unselectAllRules(dispatch);
  };

  const stableCleanup = useCallback(cleanup, [dispatch]);

  // Component State
  const selectedRowKeys = selectedRules;

  const UNGROUPED_GROUP_ID =
    APP_CONSTANTS.RULES_LIST_TABLE_CONSTANTS.UNGROUPED_GROUP_ID;

  const onSelectChange = (selectedRowKeys) => {
    // Update the global state so that it could be consumed by other components as well

    // selectedRowKeys also contains the group ids, which we don't need, ProTable will handle it internally!
    const selectedRuleIds = selectedRowKeys.filter((objectId) => {
      return !objectId.startsWith("Group_") && objectId !== UNGROUPED_GROUP_ID;
    });

    const newSelectedRulesObject = {};

    selectedRuleIds.forEach((ruleId) => {
      newSelectedRulesObject[ruleId] = true;
    });

    dispatch(getSetSelectedRulesActionObject(newSelectedRulesObject));
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    checkStrictly: false,
    getCheckboxProps: (record) => ({
      disabled: record.disabled,
    }),
  };

  //Component State
  const [ruleToViewInModal, setRuleToViewInModal] = useState(false);
  const [
    isSharedListRuleViewerModalActive,
    setIsSharedListRuleViewModalActive,
  ] = useState(false);
  const [areRulesImporting, setAreRulesImporting] = useState(false);
  const [isLimitReachedModalActive, setIsLimitReachedModalActive] = useState(
    false
  );
  const [currentNumberOfRules, setCurrentNumberOfRules] = useState(0);
  const [numberOfRulesImportAllowed, setNumberOfRulesImportAllowed] = useState(
    0
  );

  const toggleSharedListRuleViewerModal = () => {
    setIsSharedListRuleViewModalActive(!isSharedListRuleViewerModalActive);
  };

  const returnSelectedRules = (rules) => {
    let selectedRules;

    if (rules.length) {
      selectedRules = rules;
    } else {
      selectedRules = records.filter((record) =>
        selectedRowKeys.some((key) => key === record.id)
      );
    }

    return selectedRules;
  };

  const toggleLimitReachedModal = () => {
    setIsLimitReachedModalActive((prev) => !prev);
  };

  const handleImportRecords = (rules) => {
    setAreRulesImporting(true);
    let selectedRules = returnSelectedRules(rules);

    if (
      !checkIfCompleteImportAllowed(
        userPlanName,
        user,
        currentNumberOfRules,
        selectedRules.length
      )
    ) {
      setIsLimitReachedModalActive(true);
      setAreRulesImporting(false);
      setNumberOfRulesImportAllowed(
        getNumberOfRulesImportAllowed(userPlanName, user, currentNumberOfRules)
      );
      return;
    }

    importRecordsToLocalStorage(
      appMode,
      selectedRules,
      user.details.profile.uid
    )
      .then((result) => {
        if (result.success) {
          unselectAllRules(dispatch);
          updateTrash(selectedRules);
          toast.info(
            `Restored the ${selectedRules.length > 1 ? "rules" : "rule"}`
          );
          //ANALYTICS
          submitEventUtil(
            GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.TRASH,
            GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.WORKFLOW_STARTED,
            "rules_recovered_from_trash"
          );
          dispatch(ACTION_OBJECTS.getAddRulesAndGroups(selectedRules, []));
        }
        trackRQLastActivity("rules_recovered_from_trash");

        setAreRulesImporting(false);
      })
      .catch((err) => {
        setAreRulesImporting(false);
      });
  };

  const handleDeleteRecords = (rules) => {
    let selectedRules = returnSelectedRules(rules);

    deleteRecordsFromTrash(user.details.profile.uid, selectedRules).then(
      (result) => {
        if (result.success) {
          unselectAllRules(dispatch);
          updateTrash(selectedRules);
          toast.info(
            `Deleted the ${selectedRules.length > 1 ? "rules" : "rule"}`
          );
        }
      }
    );
  };

  const openRuleViewerInModal = (rule) => {
    setRuleToViewInModal(rule);
    setIsSharedListRuleViewModalActive(true);
  };

  const handleRuleNameOnClick = (e, rule) => {
    e.stopPropagation();
    openRuleViewerInModal(rule);
  };

  useEffect(() => {
    return stableCleanup;
  }, [stableCleanup]);

  useEffect(() => {
    setNumberOfRulesImportAllowed(
      getNumberOfRulesImportAllowed(userPlanName, user, currentNumberOfRules)
    );
  }, [currentNumberOfRules, userPlanName]);

  useEffect(() => {
    setCurrentNumberOfRules(allRules.length);
  }, [allRules]);

  const renderDisabledAction = (isHovering, record) => (
    <Space>
      <Text
        type={isHovering ? "primary" : "secondary"}
        style={{ cursor: "not-allowed" }}
      >
        <Tooltip
          title={`Users on ${getPrettyPlanName(
            userPlanName
          )} plan can recover data from last ${trashLimitForUser} day(s) only. Please upgrade to recover this rule.`}
        >
          <LockOutlined onClick={() => redirectToPricingPlans(navigate)} />
        </Tooltip>
      </Text>
    </Space>
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "ruleName",
      // width: "auto",
      textWrap: "word-break",
      ellipsis: true,
      render: (_, record) => {
        return record.disabled ? (
          <span>{record.name}</span>
        ) : (
          <Link onClick={(ev) => handleRuleNameOnClick(ev, record)}>
            {record.name}
          </Link>
        );
      },
    },
    {
      title: "Rule Type",
      dataIndex: "ruleType",
      width: "auto",
      textWrap: "word-break",
      ellipsis: true,
      render: (_, record) => {
        return (
          <Tag
            icon={React.createElement(
              APP_CONSTANTS.RULE_TYPES_CONFIG[record.ruleType].ICON
            )}
          >
            <span>
              &nbsp; &nbsp;
              {APP_CONSTANTS.RULE_TYPES_CONFIG[record.ruleType].NAME}
            </span>
          </Tag>
        );
      },
    },
    {
      title: "Creation Date",
      dataIndex: "ruleCreationDate",
      width: "auto",
      responsive: ["lg"],
      textWrap: "word-break",
      ellipsis: true,
      render: (_, record) => {
        return (
          <span>{moment(record.creationDate).format("MMM DD, YYYY")}</span>
        );
      },
    },
    {
      title: "Deletion Date",
      dataIndex: "ruledeletedDate",
      width: "auto",
      responsive: ["md"],
      textWrap: "word-break",
      ellipsis: true,
      render: (_, record) => {
        return <span>{moment(record.deletedDate).format("MMM DD, YYYY")}</span>;
      },
    },
    {
      title: "Actions",
      align: "center",
      render: (_, record) => {
        return (
          <ReactHoverObserver>
            {({ isHovering }) =>
              record.disabled ? (
                renderDisabledAction()
              ) : (
                <Space>
                  <Text
                    type={isHovering ? "primary" : "secondary"}
                    style={{ cursor: "pointer" }}
                  >
                    <Tooltip title="Restore Rule">
                      <ImportOutlined
                        onClick={() => handleImportRecords([record])}
                      />
                    </Tooltip>
                  </Text>
                  <Text
                    type={isHovering ? "primary" : "secondary"}
                    style={{ cursor: "pointer" }}
                  >
                    <Tooltip title="Delete Rule">
                      <DeleteOutlined
                        onClick={() => handleDeleteRecords([record])}
                      />
                    </Tooltip>
                  </Text>
                </Space>
              )
            }
          </ReactHoverObserver>
        );
      },
    },
  ];

  return (
    <>
      {isSharedListRuleViewerModalActive ? (
        <SharedListViewerModal
          isOpen={isSharedListRuleViewerModalActive}
          toggle={toggleSharedListRuleViewerModal}
          rule={ruleToViewInModal}
        />
      ) : null}
      <ProCard className="primary-card github-like-border" title={null}>
        <h2>Deleted Rules</h2>
        <h4>
          Rules that you have deleted over the past 30 days are available here.
          Since you're on {getPrettyPlanName(userPlanName)} plan, you can
          recover rules from last {trashLimitForUser} day(s) only.
        </h4>
        <ProTable
          rowKey="id"
          dataSource={records}
          options={false}
          pagination={false}
          search={false}
          dateFormatter={false}
          // headerTitle="Deleted Rules"
          columns={columns}
          rowSelection={rowSelection}
          rowClassName={(record) => record.disabled && "disabled-row"}
          tableAlertRender={(_) => {
            return (
              <span>{`${_.selectedRowKeys.length} ${
                _.selectedRowKeys.length > 1 ? "Rules" : "Rule"
              } selected`}</span>
            );
          }}
          tableAlertOptionRender={() => (
            <Space>
              <Button
                type="primary"
                onClick={handleImportRecords}
                icon={<ImportOutlined />}
                loading={areRulesImporting}
              >
                Restore
              </Button>
              <Button onClick={handleDeleteRecords} icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Space>
          )}
        />
      </ProCard>
      {isLimitReachedModalActive ? (
        <LimitReachedModal
          isOpen={isLimitReachedModalActive}
          toggle={toggleLimitReachedModal}
          featureName={APP_CONSTANTS.FEATURES.IMPORT}
          userPlanName={userPlanName}
          numberOfRulesImportAllowed={numberOfRulesImportAllowed}
          currentNumberOfRules={currentNumberOfRules}
          mode={APP_CONSTANTS.LIMIT_REACHED_MODAL.MODES.IMPORT_LIMIT}
        />
      ) : null}
    </>
  );
};

export default TrashTableContainer;
