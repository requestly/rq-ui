import deleteObjectAtPath from "./deleteObjectAtPath";
const set = require("lodash/set");
const get = require("lodash/get");

export const setReactSelectValue = (
  currentlySelectedRuleData,
  setCurrentlySelectedRule,
  pairIndex,
  newValues,
  targetPath
) => {
  if (newValues === null || newValues.length === 0) {
    deleteObjectAtPath(
      currentlySelectedRuleData,
      setCurrentlySelectedRule,
      targetPath,
      pairIndex
    );
  } else {
    const copyOfCurrentlySelectedRule = JSON.parse(
      JSON.stringify(currentlySelectedRuleData)
    );
    const extractedValues = newValues.map((value) => value.value);
    set(
      copyOfCurrentlySelectedRule.pairs[pairIndex],
      targetPath,
      extractedValues
    );
    setCurrentlySelectedRule(copyOfCurrentlySelectedRule);
  }
};

export const getReactSelectValue = (
  currentlySelectedRuleData,
  pairIndex,
  arrayPath,
  allOptions
) => {
  const currentArray = get(
    currentlySelectedRuleData.pairs[pairIndex],
    arrayPath,
    []
  );
  return allOptions.filter((value) => currentArray.includes(value.value));
};
