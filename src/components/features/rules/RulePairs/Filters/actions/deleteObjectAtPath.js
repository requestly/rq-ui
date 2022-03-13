const omit = require("lodash/omit");

const deleteObjectAtPath = (
  currentlySelectedRuleData,
  setCurrentlySelectedRule,
  targetPath,
  pairIndex
) => {
  const copyOfCurrentlySelectedRule = JSON.parse(
    JSON.stringify(currentlySelectedRuleData)
  );
  if (typeof targetPath === "string") {
    setCurrentlySelectedRule(
      omit(copyOfCurrentlySelectedRule, [`pairs[${pairIndex}].${targetPath}`])
    );
  } else {
    let arrayOfCompleteTargetPaths = targetPath.map(
      (targetPath) => `pairs[${pairIndex}].${targetPath}`
    );
    setCurrentlySelectedRule(
      omit(copyOfCurrentlySelectedRule, arrayOfCompleteTargetPaths)
    );
  }
};

export default deleteObjectAtPath;
