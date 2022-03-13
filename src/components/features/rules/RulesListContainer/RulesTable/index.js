import {
  CheckOutlined,
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FolderOpenOutlined,
  PushpinOutlined,
  PushpinFilled,
  ImportOutlined,
  PlusOutlined,
  UngroupOutlined,
  UsergroupAddOutlined,
  GroupOutlined,
} from "@ant-design/icons";
import ProTable from "@ant-design/pro-table";
import { Space, Tooltip, Button, Switch, Input, message } from "antd";
import APP_CONSTANTS from "config/constants";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  getAllGroups,
  getAllRules,
  getAppMode,
  getGroupwiseRulesToPopulate,
  getIsRefreshRulesPending,
  getRulesSearchKeyword,
  getRulesSelection,
  getRulesToPopulate,
  getUserAuthDetails,
} from "utils/GlobalStoreUtils";
import { store } from "../../../../../store";
import { getUpdateHardRefreshPendingStatusActionObject } from "store/action-objects";
import * as FeatureManager from "../../../../../utils/FeatureManager";
import { Typography, Tag } from "antd";
import { redirectToRuleEditor } from "utils/RedirectionUtils";
import { useNavigate } from "react-router-dom";
import { submitEventUtil, trackRQLastActivity } from "utils/AnalyticsUtils";
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import { getSelectedRules, unselectAllRules } from "../../actions";
import {
  getSetSelectedRulesActionObject,
  getToggleActiveModalActionObject,
  getUpdateGroupsActionObject,
  getUpdateGroupwiseRulesToPopulateActionObject,
  getUpdateRefreshPendingStatusActionObject,
  getUpdateRulesToPopulateActionObject,
} from "store/action-objects";
import { compareRuleByModificationDate } from "utils/rules/misc";
import SharedListRuleViewerModal from "../../SharedListRuleViewerModal";
import { isEmpty } from "lodash";
import moment from "moment";
import ReactHoverObserver from "react-hover-observer";
import Text from "antd/lib/typography/Text";
import { StorageService } from "init";
import { toast } from "utils/Toast.js";
import {
  deleteGroup,
  ungroupSelectedRules,
  updateRulesListRefreshPendingStatus,
} from "./actions";
import LimitReachedModal from "components/user/LimitReachedModal";
import { copyRule, deleteRule } from "../../actions/someMoreActions";
import { addRecordToTrash } from "utils/trash/TrashUtils";
import { trackActiveRuleLimitReachedEvent } from "utils/analytics/rules/active_rule_limit";
import DeleteConfirmationModal from "components/user/DeleteConfirmationModal";
import { trackRuleDuplicatedEvent } from "utils/analytics/rules/duplicated";
import { trackRuleMovedToTrashEvent } from "utils/analytics/rules/trash";
import {
  trackRuleActiveStatusEvent,
  trackRuleDeActiveStatusEvent,
} from "utils/analytics/rules/created";
import { fetchSharedLists } from "components/features/sharedLists/SharedListsIndexPage/actions";
import CreateSharedListModal from "components/features/sharedLists/CreateSharedListModal";
import { isFeatureCompatible } from "../../../../../utils/CompatibilityUtils";
import { FEATURES } from "config/constants/compatibility";
//Lodash
const set = require("lodash/set");
const get = require("lodash/get");

const { Link } = Typography;
const Search = Input.Search;

//Constants
const { RULES_LIST_TABLE_CONSTANTS } = APP_CONSTANTS;
const GROUP_DETAILS = RULES_LIST_TABLE_CONSTANTS.GROUP_DETAILS;
const GROUP_RULES = RULES_LIST_TABLE_CONSTANTS.GROUP_RULES;
const UNGROUPED_GROUP_ID = RULES_LIST_TABLE_CONSTANTS.UNGROUPED_GROUP_ID;
const UNGROUPED_GROUP_NAME = RULES_LIST_TABLE_CONSTANTS.UNGROUPED_GROUP_NAME;

const isGroupSwitchDisabled = (record, groupwiseRulesToPopulate) => {
  // UNGROUPED is not really a group
  if (record.groupId === UNGROUPED_GROUP_ID) return false;

  if (!record.groupId) return false;
  if (!groupwiseRulesToPopulate[record.groupId]) return false;
  if (
    groupwiseRulesToPopulate[record.groupId][GROUP_DETAILS]["status"] ===
    GLOBAL_CONSTANTS.RULE_STATUS.INACTIVE
  )
    return true;
  return false;
};

const checkIfRuleIsActive = (rule) => {
  return rule.status === GLOBAL_CONSTANTS.RULE_STATUS.ACTIVE;
};

/**
 * @param rules If not provided, fetch from Global State
 * @param groups If not provided, fetch from Global State
 */
const RulesTable = ({
  isTableLoading = false,
  handleChangeGroupOnClick,
  handleShareRulesOnClick,
  handleExportRulesOnClick,
  handleImportRulesOnClick,
  handleDeleteRulesOnClick,
  handleNewGroupOnClick,
  handleNewRuleOnClick,
  totalRulesCount,
  rules: rulesFromProps,
  groups: groupsFromProps,
  options,
  headerTitle,
  toolBarRender,
}) => {
  const navigate = useNavigate();
  // Component State
  const [
    isSharedListRuleViewerModalActive,
    setIsSharedListRuleViewModalActive,
  ] = useState(false);
  const [ruleToViewInModal, setRuleToViewInModal] = useState(false);
  const [isLimitReachedModalActive, setIsLimitReachedModalActive] = useState(
    false
  );
  const [
    limitReachedModalFeatureName,
    setLimitReachedModalFeatureName,
  ] = useState(false);
  const [userPlanName, setUserPlanName] = useState("Free");
  const [isShareRulesModalActive, setIsShareRulesModalActive] = useState(false);

  const [
    isDeleteConfirmationModalActive,
    setIsDeleteConfirmationModalActive,
  ] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState(null);
  const [size, setSize] = useState(window.innerWidth);
  const [proData, setProData] = useState();
  const [search, setSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isRuleMovingToTrash, setIsRuleMovingToTrash] = useState(false);
  const [isRuleBeingDeleted, setIsRuleBeingDeleted] = useState(false);
  const [sharedListModalRuleIDs, setSharedListModalRuleIDs] = useState([]);

  //Global State
  const globalState = useContext(store);
  const { state, dispatch } = globalState;
  const user = getUserAuthDetails(state);
  const searchByRuleName = getRulesSearchKeyword(state);
  const rules = rulesFromProps ? rulesFromProps : getAllRules(state);
  const groups = groupsFromProps ? groupsFromProps : getAllGroups(state);
  const rulesToPopulate = getRulesToPopulate(state);
  const groupwiseRulesToPopulate = getGroupwiseRulesToPopulate(state);
  const appMode = getAppMode(state);
  const isRulesListRefreshPending = getIsRefreshRulesPending(state);
  const rulesSelection = getRulesSelection(state);
  const selectedRules = getSelectedRules(rulesSelection);

  // fetch planName from global state
  const planName =
    user.details?.planDetails?.planName ||
    APP_CONSTANTS.PRICING.PLAN_NAMES.BRONZE;

  const showGroupPinIcon = isFeatureCompatible(
    FEATURES.EXTENSION_GROUP_PIN_ICON
  );

  // Component State
  const selectedRowKeys = selectedRules;

  const toggleSharedListRuleViewerModal = () => {
    setIsSharedListRuleViewModalActive(!isSharedListRuleViewerModalActive);
  };
  const toggleLimitReachedModal = () => {
    setIsLimitReachedModalActive(isLimitReachedModalActive ? false : true);
  };
  const toggleShareRulesModal = () => {
    setIsShareRulesModalActive(isShareRulesModalActive ? false : true);
  };
  const toggleDeleteConfirmationModal = (rule) => {
    setRuleToDelete(rule);
    setIsDeleteConfirmationModalActive((state) => {
      if (state) {
        setRuleToDelete(null);
        return false;
      }

      return true;
    });
  };

  const openRuleViewerInModal = (rule) => {
    setRuleToViewInModal(rule);
    setIsSharedListRuleViewModalActive(true);
  };

  const setRulesToPopulate = (rules) => {
    dispatch(getUpdateRulesToPopulateActionObject(rules));
  };

  const stableSetRulesToPopulate = useCallback(setRulesToPopulate, [dispatch]);

  const setGroupwiseRulesToPopulate = (incomingGroupwiseRules) => {
    dispatch(
      getUpdateGroupwiseRulesToPopulateActionObject(incomingGroupwiseRules)
    );
  };

  const stableSetGroupwiseRulesToPopulate = useCallback(
    setGroupwiseRulesToPopulate,
    [dispatch]
  );

  const isStatusEnabled = !(options && options.disableStatus);
  const isEditingEnabled = !(options && options.disableEditing);
  const areActionsEnabled = !(options && options.disableActions);
  const isFavouritingAllowed = !(options && options.disableFavourites);
  const isAlertOptionsAllowed = !(options && options.disableAlertActions);

  const filterRulesBySearch = () => {
    if (searchByRuleName.length === 0) {
      stableSetRulesToPopulate(rules);
    } else {
      stableSetRulesToPopulate(
        rules.filter((rule) =>
          rule.name.match(new RegExp(searchByRuleName, "i"))
        )
      );
    }
  };
  const stableFilterRulesBySearch = useCallback(filterRulesBySearch, [
    rules,
    searchByRuleName,
    stableSetRulesToPopulate,
  ]);

  const generateGroupwiseRulesToPopulate = () => {
    const GroupwiseRulesToPopulateWIP = {};
    //Populate it with empty group (ungrouped)
    set(
      GroupwiseRulesToPopulateWIP,
      `${UNGROUPED_GROUP_ID}.${GROUP_DETAILS}`,
      {}
    );
    set(
      GroupwiseRulesToPopulateWIP,
      `${UNGROUPED_GROUP_ID}.${GROUP_RULES}`,
      []
    );
    //Populate it with groups
    groups.forEach((group) => {
      set(GroupwiseRulesToPopulateWIP, `${group.id}.${GROUP_DETAILS}`, group);
      set(GroupwiseRulesToPopulateWIP, `${group.id}.${GROUP_RULES}`, []);
    });
    //Populate each group with respective rules
    //Sort rules by modificationDate or creationData before populating
    rulesToPopulate.sort(compareRuleByModificationDate).forEach((rule) => {
      get(
        GroupwiseRulesToPopulateWIP,
        `${rule.groupId}.${GROUP_RULES}`,
        []
      ).push(rule);
    });
    stableSetGroupwiseRulesToPopulate(GroupwiseRulesToPopulateWIP);
  };

  const stableGenerateGroupwiseRulesToPopulate = useCallback(
    generateGroupwiseRulesToPopulate,
    [groups, rulesToPopulate, stableSetGroupwiseRulesToPopulate]
  );

  const getGroupRulesCount = (groupId) => {
    return get(groupwiseRulesToPopulate, `${groupId}.${GROUP_RULES}`, [])
      .length;
  };

  const toggleIncomingGroupStatus = (groupData) => {
    const isGroupCurrentlyActive =
      groupData.status === GLOBAL_CONSTANTS.RULE_STATUS.ACTIVE;
    const updatedStatus = isGroupCurrentlyActive
      ? GLOBAL_CONSTANTS.RULE_STATUS.INACTIVE
      : GLOBAL_CONSTANTS.RULE_STATUS.ACTIVE;

    let createdBy;
    const currentOwner = user?.details?.profile?.uid || null;
    const lastModifiedBy = user?.details?.profile?.uid || null;

    if (typeof groupData.createdBy === "undefined") {
      createdBy = user?.details?.profile?.uid || null;
    } else {
      createdBy = groupData.createdBy;
    }

    const newGroup = {
      ...groupData,
      createdBy,
      currentOwner,
      lastModifiedBy,
      status: updatedStatus,
    };

    StorageService(appMode)
      .saveRuleOrGroup(newGroup)
      .then(async () => {
        dispatch(
          getUpdateRefreshPendingStatusActionObject(
            "rules",
            !isRulesListRefreshPending
          )
        );
      })
      .then(() => {
        updatedStatus === GLOBAL_CONSTANTS.RULE_STATUS.ACTIVE
          ? toast.success(`Group is now ${updatedStatus.toLowerCase()}`)
          : toast.success(`Group is now ${updatedStatus.toLowerCase()}`);
      });
  };

  const handleGroupStatusOnClick = (event, groupData) => {
    event.stopPropagation();
    event.preventDefault();
    toggleIncomingGroupStatus(groupData);
    // //Analytics

    if (groupData.status === "Inactive") {
      submitEventUtil("group_activated");
    } else {
      submitEventUtil("group_deactivated");
    }
  };

  const ungroupSelectedRulesOnClickHandler = (event) => {
    event.stopPropagation();
    ungroupSelectedRules(appMode, selectedRules, user)
      .then(() => {
        //Unselect all rules
        unselectAllRules(dispatch);
        //Refresh List
        updateRulesListRefreshPendingStatus(
          dispatch,
          isRulesListRefreshPending
        );
      })
      .then(() => {
        toast.info("Rules Ungrouped");
        //Analytics
        submitEventUtil(
          GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULES,
          GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.UNGROUPED,
          "rules_ungrouped"
        );
      })
      .catch(() =>
        toast.warn("Please select rules first", { hideProgressBar: true })
      );
  };

  const deleteGroupOnClickHandler = (event, groupData) => {
    event.stopPropagation();

    deleteGroup(appMode, groupData.id, groupwiseRulesToPopulate)
      .then(async () => {
        updateRulesListRefreshPendingStatus(
          dispatch,
          isRulesListRefreshPending
        );
        toast.info("Group deleted");
        //Analytics
        submitEventUtil(
          GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.GROUP,
          GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.DELETED,
          "group_deleted"
        );
      })
      .catch((err) => toast.warn(err, { hideProgressBar: true }));
  };

  const renameGroupOnClickHandler = (event, groupData) => {
    event.stopPropagation();
    const groupId = groupData.id;
    dispatch(
      getToggleActiveModalActionObject("renameGroupModal", true, {
        groupId: { groupId },
      })
    );
  };

  const changeFavouriteStatus = (newValue, rule) => {
    let createdBy;
    const currentOwner = user?.details?.profile?.uid || null;
    const lastModifiedBy = user?.details?.profile?.uid || null;

    if (typeof rule.createdBy === "undefined") {
      createdBy = user?.details?.profile?.uid || null;
    } else {
      createdBy = rule.createdBy;
    }

    StorageService(appMode)
      .saveRuleOrGroup({
        ...rule,
        createdBy,
        currentOwner,
        lastModifiedBy,
        isFavourite: newValue,
      })
      .then(async () => {
        dispatch(
          getUpdateRefreshPendingStatusActionObject(
            "rules",
            !isRulesListRefreshPending
          )
        );
        //Analytics
        submitEventUtil(
          GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULE,
          "FAVOURITE",
          "rule_favorite_toggled"
        );
        setSearch(false);
        setSearchValue("");
      });
  };

  const toggleFavourite = (rule) => {
    //Check limit only when favouriting the rule
    if (rule.isFavourite) {
      changeFavouriteStatus(false, rule);
    } else {
      const currentNumberOfFavouriteRules = rules.filter(
        (rule) => rule.isFavourite
      ).length;

      const ifFavouriteRulesLimitReached = FeatureManager.checkIfLimitReached(
        currentNumberOfFavouriteRules,
        APP_CONSTANTS.FEATURES.FAV_RULES,
        user,
        planName
      );

      if (ifFavouriteRulesLimitReached) {
        //Update state to reflect changes in modal
        setLimitReachedModalFeatureName(APP_CONSTANTS.FEATURES.FAV_RULES);
        setUserPlanName(planName);
        //Activate modal to notify user to upgrade
        setIsLimitReachedModalActive(true);
      } else {
        //Continue allowing favouritizing rule
        changeFavouriteStatus(true, rule);
      }
    }
  };

  const favouriteIconOnClickHandler = (event, rule) => {
    event.stopPropagation();
    if (isEditingEnabled) {
      toggleFavourite(rule);
    }
  };

  const pinGroupIconOnClickHandler = (event, record) => {
    event.stopPropagation();
    // Toggle Group's isFavorite
    if (isEditingEnabled) {
      toggleFavourite(record);
    }
    // // toggle children's isFavorite
    // record.children.map((rule) => {
    //   if (isEditingEnabled) {
    //     toggleFavourite(rule);
    //   }
    // });
  };

  const handleRuleNameOnClick = (e, rule) => {
    e.stopPropagation();
    if (isEditingEnabled) {
      redirectToRuleEditor(navigate, rule.id);
    } else if (openRuleViewerInModal) {
      openRuleViewerInModal(rule);
    }
  };

  const changeRuleStatus = (newStatus, rule) => {
    let createdBy;
    const currentOwner = user?.details?.profile?.uid || null;
    const lastModifiedBy = user?.details?.profile?.uid || null;

    if (typeof rule.createdBy === "undefined") {
      createdBy = user?.details?.profile?.uid || null;
    } else {
      createdBy = rule.createdBy;
    }

    StorageService(appMode)
      .saveRuleOrGroup({
        ...rule,
        createdBy,
        currentOwner,
        lastModifiedBy,
        status: newStatus,
      })
      .then(async () => {
        //Push Notify
        newStatus === GLOBAL_CONSTANTS.RULE_STATUS.ACTIVE
          ? toast.success(`Rule is now ${newStatus.toLowerCase()}`)
          : toast.success(`Rule is now ${newStatus.toLowerCase()}`);
        //Refresh List
        dispatch(
          getUpdateRefreshPendingStatusActionObject(
            "rules",
            !isRulesListRefreshPending
          )
        );
        //Analytics
        if (newStatus.toLowerCase() === "active") {
          trackRQLastActivity("rule_activated");
          trackRuleActiveStatusEvent(rule.ruleType);
        } else {
          trackRQLastActivity("rule_deactivated");
          trackRuleDeActiveStatusEvent(rule.ruleType);
        }

        setSearch(false);
        setSearchValue("");
      });
  };

  const toggleRuleStatus = (event, rule) => {
    event.preventDefault();
    event.stopPropagation();
    //Check limit only when activating the rule
    if (checkIfRuleIsActive(rule)) {
      changeRuleStatus(GLOBAL_CONSTANTS.RULE_STATUS.INACTIVE, rule);
    } else {
      const currentNumberOfActiveRules = rules.filter(
        (rule) => rule.status === GLOBAL_CONSTANTS.RULE_STATUS.ACTIVE
      ).length;

      const ifPlanActiveRulesLimitReached = FeatureManager.checkIfLimitReached(
        currentNumberOfActiveRules,
        APP_CONSTANTS.FEATURES.ACTIVE_RULES,
        user,
        planName
      );

      if (ifPlanActiveRulesLimitReached) {
        //Update state to reflect changes in modal
        setLimitReachedModalFeatureName(APP_CONSTANTS.FEATURES.ACTIVE_RULES);
        setUserPlanName(planName);
        //Activate modal to notify user to upgrade
        setIsLimitReachedModalActive(true);

        let uid = user?.details?.profile?.uid || null;
        trackActiveRuleLimitReachedEvent(uid, currentNumberOfActiveRules);
      } else {
        //Continue allowing activating rule
        changeRuleStatus(GLOBAL_CONSTANTS.RULE_STATUS.ACTIVE, rule);
      }
    }
  };

  const verifyAndContinueSharingRules = (rule) => {
    //Activate loading modal
    dispatch(getToggleActiveModalActionObject("loadingModal", true));

    fetchSharedLists(user.details.profile.uid).then((result) => {
      let currentSharedListsCount = 0;
      if (result) {
        currentSharedListsCount = Object.keys(result).length;
      }

      const ifPlanSharedListsLimitReached = FeatureManager.checkIfLimitReached(
        currentSharedListsCount,
        APP_CONSTANTS.FEATURES.SHARED_LISTS,
        planName
      );

      if (ifPlanSharedListsLimitReached) {
        //Update state to reflect changes in modal
        setUserPlanName(planName);
        setLimitReachedModalFeatureName(APP_CONSTANTS.FEATURES.SHARED_LISTS);
        //Activate modal to notify user to upgrade
        setIsLimitReachedModalActive(true);
      } else {
        //Continue creating new shared list
        setSharedListModalRuleIDs([rule.id]);
        setIsShareRulesModalActive(true);
        //Analytics
        submitEventUtil(
          GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULE,
          "rules",
          GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.SHARED
        );
        trackRQLastActivity("sharedList_created");
      }
      //Deactivate loading modal
      dispatch(getToggleActiveModalActionObject("loadingModal", false));
    });
  };

  const promptUserToLogin = () => {
    const signInSuccessCallback = (uid) => {
      moveRecordToTrashAndContinue(uid, ruleToDelete);
    };

    dispatch(
      getToggleActiveModalActionObject("authModal", true, {
        redirectURL: window.location.href,
        src: APP_CONSTANTS.FEATURES.RULES,
        callback: signInSuccessCallback,
      })
    );
  };

  const shareIconOnClickHandler = (event, rule) => {
    event.stopPropagation();
    user.loggedIn ? verifyAndContinueSharingRules(rule) : promptUserToLogin();
  };

  const copyIconOnClickHandler = async (event, rule) => {
    event.stopPropagation();

    //Analytics
    submitEventUtil(
      GLOBAL_CONSTANTS.GA_EVENTS.CATEGORIES.RULE,
      rule.ruleType + " rule",
      GLOBAL_CONSTANTS.GA_EVENTS.ACTIONS.COPIED
    );
    trackRQLastActivity("rule_duplicated");
    trackRuleDuplicatedEvent(rules.ruleType);
    const records = await StorageService(appMode).getAllRecords();
    const currentDate = new Date().getTime();
    let lastDate = null;
    try {
      lastDate =
        window.localStorage.getItem("authModalShownLastOn") ||
        records.user_info.installationDate;
    } catch (error) {
      promptUserToLogin();
      window.localStorage.setItem("authModalShownLastOn", currentDate);
    }

    const lastShownBefore = (currentDate - lastDate) / (1000 * 60 * 60 * 24);

    if (!user.loggedIn && (rules.length >= 2 || lastShownBefore >= 15)) {
      window.localStorage.setItem("authModalShownLastOn", currentDate);
      return promptUserToLogin();
    }

    // Verifying if rules limit reached
    const ifPlanRulesLimitReached = FeatureManager.checkIfLimitReached(
      rules.length,
      APP_CONSTANTS.FEATURES.RULES,
      user,
      planName
    );
    if (ifPlanRulesLimitReached) {
      //Update state to reflect changes in modal
      setUserPlanName(planName);
      setLimitReachedModalFeatureName(APP_CONSTANTS.FEATURES.RULES);
      //Activate modal to notify user to upgrade
      setIsLimitReachedModalActive(true);
    } else {
      // Continue copying rule
      copyRule(appMode, dispatch, rule, navigate);
    }
  };

  const deleteRecordFromStorage = (isLoggedIn, rule) => {
    setIsRuleBeingDeleted(true);

    deleteRule(appMode, dispatch, rule.id, isRulesListRefreshPending)
      .then(async () => {
        if (isLoggedIn) {
          toast.info(
            `The rule has been moved to trash. You can recover the rule later on from trash.`
          );
        } else {
          toast.info(`The rule has been deleted.`);
        }
      })
      .then(() => {
        dispatch(getUpdateHardRefreshPendingStatusActionObject("rules"));
        setIsRuleBeingDeleted(false);
        toggleDeleteConfirmationModal();
        unselectAllRules(dispatch);
      });
  };

  const moveRecordToTrashAndContinue = async (uid, rule) => {
    let userId;

    if (uid) {
      userId = uid;
    } else {
      userId = user?.details?.profile?.uid;
    }

    const recordToRemove = await StorageService(appMode).getRecord(rule.id);
    const recordInTrash = {
      ...recordToRemove,
      deletedDate: new Date().getTime(),
    };

    if (userId) {
      setIsRuleMovingToTrash(true);
      addRecordToTrash(userId, recordInTrash).then((result) => {
        if (result.success) {
          deleteRecordFromStorage(userId, rule);
          dispatch(getUpdateHardRefreshPendingStatusActionObject("rules"));
          setIsRuleMovingToTrash(false);
          toggleDeleteConfirmationModal();
          trackRuleMovedToTrashEvent("1", rule.ruleType);
        } else {
          toast.info(`Could not delete rule, please try again later.`);
        }
        setIsRuleMovingToTrash(false);
        toggleDeleteConfirmationModal();
      });
    } else {
      setIsRuleBeingDeleted(true);
      deleteRecordFromStorage(rule);
      dispatch(getUpdateHardRefreshPendingStatusActionObject("rules"));
      setIsRuleBeingDeleted(false);
      toggleDeleteConfirmationModal();
    }
  };

  const deleteIconOnClickHandler = async (event, rule) => {
    event.stopPropagation();

    toggleDeleteConfirmationModal(rule);
  };

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

  const handleSearch = (searchText) => {
    let flag = 0;
    let searchData = [];
    if (searchText !== "") {
      for (let j = 0; j < proData.length; j++) {
        for (let i = 0; i < proData[j].children.length; i++) {
          if (
            proData[j].children[i].name
              .toLowerCase()
              .includes(searchText.toLowerCase())
          ) {
            let searchObj = {
              creationDate: proData[j].creationDate,
              description: proData[j].description,
              id: proData[j].id,
              name: proData[j].name,
              objectType: proData[j].objectType,
              status: proData[j].status,
              children: [proData[j].children[i]],
              expanded: true,
            };
            searchData.push(searchObj);
            setProData(searchData);
            flag = 1;
            setSearch(true);
            break;
          }
        }
      }
      if (flag === 0) {
        message.error("No Rule found with given name");
      }
    }
  };

  const handleDataChange = (e) => {
    setProData(proTableData);
    setSearch(false);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    checkStrictly: false,
  };
  const columns = [
    {
      title: "Rule Details",
      dataIndex: "name",
      onCell: (record) => {
        if (record.objectType === "group") {
          return {
            colSpan: 2,
          };
        }
      },
      render: (_, record) => {
        if (record.objectType === "group") {
          return (
            <span>
              <strong>{_}</strong>{" "}
              <i>({getGroupRulesCount(record.id)} Rules)</i>
            </span>
          );
        } else {
          const name = _.length > 40 ? _.substring(0, 40) + "..." : _;
          const description =
            record.description.length > 40
              ? record.description.substring(0, 40) + "..."
              : record.description;

          return (
            <div
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                wordWrap: "break-word",
                wordBreak: "break-word",
                textOverflow: "ellipsis",
              }}
            >
              <Link onClick={(e) => handleRuleNameOnClick(e, record)}>
                {name}
              </Link>
              <br />
              <Text
                type="secondary"
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  wordWrap: "break-word",
                  wordBreak: "break-word",
                  textOverflow: "ellipsis",
                }}
              >
                {description}
              </Text>
            </div>
          );
        }
      },
    },
    {
      title: "Type",
      dataIndex: "ruleType",
      align: "center",
      onCell: (record) => {
        if (record.objectType && record.objectType === "group") {
          return {
            colSpan: 0,
          };
        }
      },
      render: (_, record) => {
        if (record.objectType && record.objectType !== "group") {
          return (
            <Tag
              icon={React.createElement(
                APP_CONSTANTS.RULE_TYPES_CONFIG[record.ruleType].ICON
              )}
            >
              {window.innerWidth < 1150 ? null : (
                <span>
                  &nbsp; &nbsp;
                  {APP_CONSTANTS.RULE_TYPES_CONFIG[record.ruleType].NAME}
                </span>
              )}
            </Tag>
          );
        }
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "right",
      render: (_, record) => {
        if (record.objectType && record.objectType === "group") {
          if (isStatusEnabled && record.id !== UNGROUPED_GROUP_ID) {
            if (isEditingEnabled) {
              return (
                <Switch
                  size="small"
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  checked={checkIfRuleIsActive(record)}
                  onClick={(_, event) =>
                    handleGroupStatusOnClick(event, record)
                  }
                />
              );
            }
            return <Text>{checkIfRuleIsActive(record) ? "On" : "Off"}</Text>;
          }
          return null;
        }

        // It is a Rule!
        if (!isStatusEnabled) return null;

        if (isEditingEnabled) {
          return (
            <Switch
              size="small"
              // We Rule's group is OFF, this switch must be disabled
              disabled={isGroupSwitchDisabled(record, groupwiseRulesToPopulate)}
              checked={checkIfRuleIsActive(record)}
              onClick={(_, event) => toggleRuleStatus(event, record)}
            />
          );
        }
        return <Text>{checkIfRuleIsActive(record) ? "On" : "Off"}</Text>;
      },
    },

    {
      title: "Last Modified",
      align: "center",
      // width: "20%",
      responsive: ["lg"],
      dataIndex: "modificationDate",
      valueType: "date",
      // sorter: (a, b) => a.lastModified - b.lastModified,
      render: (_, record) => {
        if (record.objectType && record.objectType === "group") {
          return null;
        }
        const dateToDisplay = record.modificationDate
          ? record.modificationDate
          : record.creationDate;
        return moment(dateToDisplay).format("MMM DD, YYYY");
      },
    },
    {
      title: "Actions",
      // width: "100%",
      align: "center",
      render: (_, record) => {
        if (record.objectType && record.objectType === "group") {
          if (areActionsEnabled && record.id !== UNGROUPED_GROUP_ID) {
            return (
              <ReactHoverObserver>
                {({ isHovering }) => (
                  <Space>
                    {isFavouritingAllowed && showGroupPinIcon && (
                      <Text
                        type={isHovering ? "primary" : "secondary"}
                        style={{ cursor: "pointer" }}
                      >
                        <Tooltip title="Pin Group">
                          <Tag
                            onClick={(e) =>
                              pinGroupIconOnClickHandler(e, record)
                            }
                          >
                            {!!record.isFavourite ? (
                              <PushpinFilled
                                style={{
                                  cursor: "pointer",
                                }}
                                className="fix-primary2-color"
                              />
                            ) : (
                              <PushpinOutlined
                                style={{
                                  cursor: "pointer",
                                }}
                              />
                            )}
                          </Tag>
                        </Tooltip>
                      </Text>
                    )}
                    <Text
                      type={isHovering ? "primary" : "secondary"}
                      style={{ cursor: "pointer" }}
                    >
                      <Tooltip title="Ungroup Selected Rules">
                        <Tag
                          onClick={(e) => ungroupSelectedRulesOnClickHandler(e)}
                        >
                          <UngroupOutlined
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        </Tag>
                      </Tooltip>
                    </Text>
                    <Text
                      type={isHovering ? "primary" : "secondary"}
                      style={{ cursor: "pointer" }}
                    >
                      <Tooltip title="Rename Group">
                        <Tag
                          onClick={(e) => renameGroupOnClickHandler(e, record)}
                        >
                          <EditOutlined
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        </Tag>
                      </Tooltip>
                    </Text>
                    <Text
                      type={isHovering ? "primary" : "secondary"}
                      style={{ cursor: "pointer" }}
                    >
                      <Tooltip title="Delete Group">
                        <Tag
                          onClick={(e) => deleteGroupOnClickHandler(e, record)}
                        >
                          <DeleteOutlined
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        </Tag>
                      </Tooltip>
                    </Text>
                  </Space>
                )}
              </ReactHoverObserver>
            );
          }
          return null;
        }
        // This is a Rule

        if (areActionsEnabled) {
          return (
            <ReactHoverObserver>
              {({ isHovering }) => (
                <Space>
                  {isFavouritingAllowed && (
                    <Text
                      type={isHovering ? "primary" : "secondary"}
                      style={{ cursor: "pointer" }}
                    >
                      <Tooltip title="Pin Rule">
                        <Tag
                          onClick={(e) =>
                            favouriteIconOnClickHandler(e, record)
                          }
                        >
                          {!!record.isFavourite ? (
                            <PushpinFilled
                              style={{
                                padding: "5px 0px",
                                fontSize: "12px",
                                cursor: "pointer",
                              }}
                              className="fix-primary2-color"
                            />
                          ) : (
                            <PushpinOutlined
                              style={{
                                padding: "5px 0px",
                                fontSize: "12px",
                                cursor: "pointer",
                              }}
                            />
                          )}
                        </Tag>
                      </Tooltip>
                    </Text>
                  )}
                  <Text
                    type={isHovering ? "primary" : "secondary"}
                    style={{ cursor: "pointer" }}
                  >
                    <Tooltip title="Share with your Teammates">
                      <Tag onClick={(e) => shareIconOnClickHandler(e, record)}>
                        <UsergroupAddOutlined />
                      </Tag>
                    </Tooltip>
                  </Text>
                  <Text
                    type={isHovering ? "primary" : "secondary"}
                    style={{ cursor: "pointer" }}
                  >
                    <Tooltip title="Duplicate Rule">
                      <Tag onClick={(e) => copyIconOnClickHandler(e, record)}>
                        <CopyOutlined
                          style={{
                            padding: "5px 0px",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                        />
                      </Tag>
                    </Tooltip>
                  </Text>
                  <Text
                    type={isHovering ? "primary" : "secondary"}
                    style={{ cursor: "pointer" }}
                  >
                    <Tooltip title="Delete Rule">
                      <Tag onClick={(e) => deleteIconOnClickHandler(e, record)}>
                        <DeleteOutlined
                          style={{
                            padding: "5px 0px",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                        />
                      </Tag>
                    </Tooltip>
                  </Text>
                </Space>
              )}
            </ReactHoverObserver>
          );
        }
        return (
          <ReactHoverObserver>
            {({ isHovering }) => (
              <Space>
                <Text
                  type={isHovering ? "primary" : "secondary"}
                  style={{ cursor: "pointer" }}
                >
                  <Tooltip title="Edit Rule">
                    <EyeOutlined
                      onClick={(e) => {
                        e.stopPropagation();
                        openRuleViewerInModal(record);
                      }}
                    />
                  </Tooltip>
                </Text>
              </Space>
            )}
          </ReactHoverObserver>
        );
      },
    },
  ];

  const cleanup = () => {
    //Unselect all rules
    unselectAllRules(dispatch);
  };

  const EscFn = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      // navigate.goBack();
    }
  };

  const stableCleanup = useCallback(cleanup, [dispatch]);

  useEffect(() => {
    //Cleanup
    //Unselect All Rules when navigated away
    return stableCleanup;
  }, [stableCleanup]);

  useEffect(() => {
    if (headerTitle) {
      document.addEventListener("keydown", EscFn);
    }
    window.addEventListener("resize", () => {
      setSize(window.innerWidth);
    });
    return () => {
      if (headerTitle) document.removeEventListener("keydown", EscFn);
      window.removeEventListener("resize", () => {
        setSize(window.innerWidth);
      });
    };
  }, [headerTitle]);

  useEffect(() => {
    stableFilterRulesBySearch();
  }, [stableFilterRulesBySearch]);

  useEffect(() => {
    stableGenerateGroupwiseRulesToPopulate();
  }, [stableGenerateGroupwiseRulesToPopulate]);

  useEffect(() => {
    dispatch(getUpdateGroupsActionObject(groups));
  }, [dispatch, groups]);

  useEffect(() => {
    if (search) {
      const expandableRows = document.querySelectorAll(".expanded-row");
      expandableRows.forEach((row) => {
        const isCollapsed = row.querySelector(
          ".ant-table-row-expand-icon-collapsed"
        );

        if (isCollapsed) {
          row.click();
        }
      });
    }
  }, [search]);

  if (rulesToPopulate.length === 0) {
    // return <RuleSearchFailRow />;
  }

  const proTableData = [];
  for (const G_ID in groupwiseRulesToPopulate) {
    const dataObject = groupwiseRulesToPopulate[G_ID][GROUP_DETAILS];
    dataObject["children"] = groupwiseRulesToPopulate[G_ID][GROUP_RULES];

    // Handle case of UNGROUPED
    if (!dataObject["name"]) {
      dataObject["creationDate"] = 1629967497355; // Random - Just to maintain structure
      dataObject["description"] = "";
      dataObject["id"] = UNGROUPED_GROUP_ID;
      dataObject["name"] = UNGROUPED_GROUP_NAME;
      dataObject["objectType"] = "group";
      dataObject["status"] = GLOBAL_CONSTANTS.RULE_STATUS.ACTIVE;
    }
    proTableData.push(dataObject);
  }

  // Move "Ungrouped" group to last
  if (!isEmpty(proTableData) && proTableData[0].id === UNGROUPED_GROUP_ID) {
    // When the "Ungrouped" group is empty, we dont need to show it
    if (isEmpty(proTableData[0].children)) {
      // Remove the Ungrouped group from array!
      proTableData.splice(0, 1);
    } else {
      // Continue moving "Ungrouped" group to last
      proTableData.push(proTableData.shift());
    }
  }

  return (
    <>
      <ProTable
        rowClassName={(record, index) => {
          return record.objectType === "group"
            ? `rule-group-row ${!!record.expanded && "expanded-row"}`
            : null;
        }}
        columnsState={{
          persistenceKey: "rules-index-table",
          persistenceType: "localStorage",
        }}
        loading={isTableLoading}
        expandable={{
          defaultExpandAllRows: false,
          defaultExpandedRowKeys: [UNGROUPED_GROUP_ID],
          expandRowByClick: true,
          rowExpandable: true,
          expandedRowClassName: "expanded-row",
        }}
        tableAlertRender={(_) => {
          return <span>{`${_.selectedRowKeys.length} Rules selected`}</span>;
        }}
        tableAlertOptionRender={() =>
          isAlertOptionsAllowed ? (
            <Space>
              <Tooltip title="Change Group">
                <Button
                  shape="circle"
                  onClick={handleChangeGroupOnClick}
                  icon={<FolderOpenOutlined />}
                />
              </Tooltip>
              <Tooltip title="Share">
                <Button
                  shape="circle"
                  onClick={handleShareRulesOnClick}
                  icon={<UsergroupAddOutlined />}
                />
              </Tooltip>
              <Tooltip title="Export">
                <Button
                  shape="circle"
                  onClick={handleExportRulesOnClick}
                  icon={<DownloadOutlined />}
                />
              </Tooltip>
              <Tooltip title="Delete">
                <Button
                  shape="circle"
                  onClick={handleDeleteRulesOnClick}
                  icon={<DeleteOutlined />}
                />
              </Tooltip>
            </Space>
          ) : null
        }
        rowSelection={options.disableSelection ? false : rowSelection}
        columns={columns}
        dataSource={search ? proData : proTableData}
        rowKey="id"
        pagination={false}
        search={false}
        dateFormatter={false}
        headerTitle={
          headerTitle ? (
            headerTitle
          ) : (
            <>
              {size < 800 ? null : "My Rules "}
              <Search
                placeholder="Enter Rule Name"
                value={searchValue}
                onChange={(e) => {
                  handleDataChange(e);
                  setSearchValue(e.target.value);
                }}
                onSearch={(e) => {
                  handleSearch(e);
                }}
                style={{ width: 200, marginLeft: "5px" }}
              />
            </>
          )
        }
        options={false}
        toolBarRender={
          toolBarRender
            ? toolBarRender
            : () => [
                <Button
                  onClick={handleImportRulesOnClick}
                  shape={size < 1150 ? "circle" : null}
                  icon={<ImportOutlined />}
                >
                  {size < 1150 ? null : "Import"}
                </Button>,
                <Button
                  onClick={handleExportRulesOnClick}
                  shape={size < 1150 ? "circle" : null}
                  icon={<DownloadOutlined />}
                >
                  {size < 1150 ? null : "Export"}
                </Button>,
                <Button
                  onClick={handleShareRulesOnClick}
                  shape={size < 1150 ? "circle" : null}
                  icon={<UsergroupAddOutlined />}
                >
                  {size < 1150 ? null : "Share"}
                </Button>,
                <Button
                  onClick={handleNewGroupOnClick}
                  shape={size < 1150 ? "circle" : null}
                  icon={<GroupOutlined />}
                >
                  {size < 1150 ? null : "New Group"}
                </Button>,
                <Button
                  type="primary"
                  onClick={handleNewRuleOnClick}
                  icon={<PlusOutlined />}
                >
                  New Rule
                </Button>,
              ]
        }
      />
      {isSharedListRuleViewerModalActive ? (
        <SharedListRuleViewerModal
          isOpen={isSharedListRuleViewerModalActive}
          toggle={toggleSharedListRuleViewerModal}
          rule={ruleToViewInModal}
        />
      ) : null}
      {isLimitReachedModalActive && limitReachedModalFeatureName ? (
        <LimitReachedModal
          isOpen={isLimitReachedModalActive}
          toggle={toggleLimitReachedModal}
          featureName={limitReachedModalFeatureName}
          userPlanName={userPlanName}
          mode={
            !FeatureManager.isFeatureEnabled(
              limitReachedModalFeatureName,
              user,
              userPlanName
            )
              ? APP_CONSTANTS.LIMIT_REACHED_MODAL.MODES.CHECK_IF_ENABLED
              : APP_CONSTANTS.LIMIT_REACHED_MODAL.MODES.CHECK_LIMIT
          }
        />
      ) : null}
      {isShareRulesModalActive ? (
        <CreateSharedListModal
          isOpen={isShareRulesModalActive}
          toggle={toggleShareRulesModal}
          rulesToShare={sharedListModalRuleIDs}
        />
      ) : null}
      {isDeleteConfirmationModalActive ? (
        <DeleteConfirmationModal
          isOpen={isDeleteConfirmationModalActive}
          toggle={toggleDeleteConfirmationModal}
          ruleToDelete={ruleToDelete}
          promptToLogin={promptUserToLogin}
          deleteRecordFromStorage={deleteRecordFromStorage}
          handleRecordsDeletion={() =>
            moveRecordToTrashAndContinue(false, ruleToDelete)
          }
          isMoveToTrashInProgress={isRuleMovingToTrash}
          isDeletionInProgress={isRuleBeingDeleted}
        />
      ) : null}
    </>
  );
};

export default RulesTable;
