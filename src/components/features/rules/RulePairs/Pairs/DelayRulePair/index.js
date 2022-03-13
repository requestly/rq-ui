import React from "react";
import DelayRow from "../Rows/RowsMarkup/DelayRow";

const DelayRulePair = ({
  pair,
  pairIndex,
  helperFunctions,
  ruleDetails,
  isInputDisabled,
}) => (
  <>
    <DelayRow
      rowIndex={2}
      pair={pair}
      pairIndex={pairIndex}
      helperFunctions={helperFunctions}
      ruleDetails={ruleDetails}
      isInputDisabled={isInputDisabled}
    />
  </>
);

export default DelayRulePair;
