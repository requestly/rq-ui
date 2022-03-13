/** rules */
export const getRulesNode = (state) => {
  return state["rules"];
};

/** rules -> allRules */
export const getAllRulesData = (state) => {
  const rulesNode = getRulesNode(state);
  return rulesNode["allRules"];
};

/** rules -> allRules -> rules */
export const getAllRules = (state) => {
  const allRulesData = getAllRulesData(state);
  return allRulesData["rules"];
};

/** rules -> allRules -> rules with MKTRuleID */
export const getMarketplaceRules = (state) => {
  const allRules = getAllRules(state);
  return allRules.filter((data) => "MKTRuleID" in data);
};

/** rules -> allRules -> unique MKTRuleID */
export const getUniqueMarketplaceRuleID = (state) => {
  const onlyMarketplaceRules = getMarketplaceRules(state);
  const uniqueMarketplaceRuleIDs = onlyMarketplaceRules.filter(
    (rule, index, self) =>
      self.findIndex((x) => x.MKTRuleID === rule.MKTRuleID) === index
  );
  return uniqueMarketplaceRuleIDs;
};

/** rules -> allRules -> groups */
export const getAllGroups = (state) => {
  const allRulesData = getAllRulesData(state);
  return allRulesData["groups"];
};

/** rules -> rulesToPopulate  */
export const getRulesToPopulate = (state) => {
  const rulesNode = getRulesNode(state);
  return rulesNode["rulesToPopulate"];
};

/** rules -> groupwiseRulesToPopulate  */
export const getGroupwiseRulesToPopulate = (state) => {
  const rulesNode = getRulesNode(state);
  return rulesNode["groupwiseRulesToPopulate"];
};

/** rules -> selectedRules  */
export const getRulesSelection = (state) => {
  const rulesNode = getRulesNode(state);
  return rulesNode["selectedRules"];
};

/** rules -> currentlySelectedRule  */
export const getCurrentlySelectedRule = (state) => {
  const rulesNode = getRulesNode(state);
  return rulesNode["currentlySelectedRule"];
};

/** rules -> currentlySelectedRule -> data */
export const getCurrentlySelectedRuleData = (state) => {
  const currentlySelectedRule = getCurrentlySelectedRule(state);
  // console.log(currentlySelectedRule);
  return currentlySelectedRule["data"];
};

/** rules -> currentlySelectedRule -> config */
export const getCurrentlySelectedRuleConfig = (state) => {
  const currentlySelectedRule = getCurrentlySelectedRule(state);
  return currentlySelectedRule["config"];
};

/** rules -> lastBackupTimeStamp */
export const getLastBackupTimeStamp = (state) => {
  const rulesNode = getRulesNode(state);
  return rulesNode["lastBackupTimeStamp"];
};

/** user  */
export const getUserAuthDetails = (state) => {
  return state["user"];
};

/** search  */
export const getSearch = (state) => {
  return state["search"];
};

/** search -> rules */
export const getRulesSearchKeyword = (state) => {
  const allSearch = getSearch(state);
  return allSearch["rules"];
};

/** search -> files */
export const getFilesSearchKeyword = (state) => {
  const allSearch = getSearch(state);
  return allSearch["files"];
};

/** search -> sharedLists */
export const getSharedListsSearchKeyword = (state) => {
  const allSearch = getSearch(state);
  return allSearch["sharedLists"];
};

/** search -> marketplace */
export const getMarketplaceSearchKeyword = (state) => {
  const allSearch = getSearch(state);
  return allSearch["marketplace"];
};

/** pendingHardRefresh  */
export const getPendingHardRefreshItems = (state) => {
  return state["pendingHardRefresh"];
};

/** pendingHardRefresh -> rules  */
export const getIsHardRefreshRulesPending = (state) => {
  const pendingHardRefreshItems = getPendingHardRefreshItems(state);
  return pendingHardRefreshItems["rules"];
};

/** pendingRefresh  */
export const getPendingRefreshItems = (state) => {
  return state["pendingRefresh"];
};

/** pendingRefresh -> rules  */
export const getIsRefreshRulesPending = (state) => {
  const pendingRefreshItems = getPendingRefreshItems(state);
  return pendingRefreshItems["rules"];
};

/** pendingRefresh -> sharedLists  */
export const getIsRefreshSharesListsPending = (state) => {
  const pendingRefreshItems = getPendingRefreshItems(state);
  return pendingRefreshItems["sharedLists"];
};

/** sharedLists  */
export const getSharedListsNode = (state) => {
  return state["sharedLists"];
};

/** sharedLists -> selectedLists  */
export const getSelectedSharedLists = (state) => {
  const sharedListsNode = getSharedListsNode(state);
  return sharedListsNode["selectedLists"];
};

/** activeModals  */
export const getActiveModals = (state) => {
  return state["activeModals"];
};

/** marketplace */
export const getMarketplaceRuleStatus = (state) => {
  return state["marketplace"]["ruleStatus"];
};

/** appMode  */
export const getAppMode = (state) => {
  return state["appMode"];
};

/** appTheme  */
export const getAppTheme = (state) => {
  return state["appTheme"];
};

/** desktop */
export const getDesktopSpecificDetails = (state) => {
  return state["desktopSpecificDetails"];
};

/** User country */
export const getUserCountry = (state) => {
  return state["country"];
};

/** Is trial user */
export const getIfTrialModeEnabled = (state) => {
  return state["trialModeEnabled"];
};
