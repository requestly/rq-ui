const get = require("lodash/get");

const getObjectValue = (currentlySelectedRuleData, pairIndex, objectPath) => {
  return get(currentlySelectedRuleData.pairs[pairIndex], objectPath, "");
};

export default getObjectValue;
