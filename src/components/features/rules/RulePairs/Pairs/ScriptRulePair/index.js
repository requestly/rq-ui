import React, { useCallback, useEffect, useState } from "react";
import AvailableScriptsRow from "../Rows/RowsMarkup/AvailableScriptsRow";
import RequestSourceRow from "../Rows/RowsMarkup/RequestSourceRow";
import AddCustomScriptRow from "../Rows/RowsMarkup/AddCustomScriptRow";
import CustomScriptRow from "../Rows/RowsMarkup/CustomScriptRow";
import { generateObjectId } from "../../../../../../utils/FormattingHelper";
import { useLocation } from "react-router-dom";

const ScriptRulePair = ({
  pair,
  pairIndex,
  helperFunctions,
  ruleDetails,
  isInputDisabled,
}) => {
  const location = useLocation();

  const isInEditMode = location.pathname
    .split("/rules/editor")[1]
    ?.startsWith("/edit");

  const toShowLibraries = isInEditMode && pair?.libraries?.length;

  const [
    hasUserClickedDeleteIconInThisSession,
    setHasUserClickedDeleteIconInThisSession,
  ] = useState(false);

  const {
    pushValueToArrayInPair,
    deleteArrayValueByIndexInPair,
  } = helperFunctions;

  const addEmptyScript = (event) => {
    event && event.preventDefault();
    pushValueToArrayInPair(event, pairIndex, "scripts", {
      ...ruleDetails.EMPTY_SCRIPT_FORMAT,
      id: generateObjectId(),
    });
  };

  const stableAddEmptyScript = useCallback(addEmptyScript, [
    pairIndex,
    pushValueToArrayInPair,
    ruleDetails.EMPTY_SCRIPT_FORMAT,
  ]);

  const deleteScript = (event, pairIndex, scriptIndex) => {
    event && event.preventDefault();

    setHasUserClickedDeleteIconInThisSession(true);

    deleteArrayValueByIndexInPair(event, pairIndex, "scripts", scriptIndex);
  };

  // Auto Populate Empty Code Script
  useEffect(() => {
    if (Array.isArray(pair.scripts) && pair.scripts.length === 0) {
      if (hasUserClickedDeleteIconInThisSession) return;
      stableAddEmptyScript();
    }
  }, [
    stableAddEmptyScript,
    pair.scripts,
    hasUserClickedDeleteIconInThisSession,
  ]);

  return (
    <React.Fragment>
      <RequestSourceRow
        rowIndex={1}
        pair={pair}
        pairIndex={pairIndex}
        helperFunctions={helperFunctions}
        ruleDetails={ruleDetails}
        isInputDisabled={isInputDisabled}
      />
      {!!toShowLibraries && (
        <AvailableScriptsRow
          rowIndex={3}
          pair={pair}
          pairIndex={pairIndex}
          helperFunctions={{ ...helperFunctions }}
          isInputDisabled={isInputDisabled}
        />
      )}
      {pair.scripts.map((script, scriptIndex) => (
        <CustomScriptRow
          key={script.id}
          rowIndex={2}
          pair={pair}
          pairIndex={pairIndex}
          helperFunctions={{ ...helperFunctions, deleteScript }}
          ruleDetails={ruleDetails}
          script={script}
          scriptIndex={scriptIndex}
          isInputDisabled={isInputDisabled}
        />
      ))}

      <AddCustomScriptRow
        helperFunctions={{ ...helperFunctions, addEmptyScript }}
      />
    </React.Fragment>
  );
};

export default ScriptRulePair;
