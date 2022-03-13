import React, { useContext, useState } from "react";
import { Slider } from "antd";
// STORE
import { store } from "store";
import { getUpdateTeamUsersToCheckout } from "../../../../store/action-objects";
import { getTeamUsersToCheckout } from "../../../../utils/GlobalStoreUtils";

const TeamSlider = ({ tooltipPlacement, alwaysVisible }) => {
  //   Global State
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const usersCount = getTeamUsersToCheckout(state);

  const [count, setCount] = useState(usersCount);

  const handleSliderChange = (value) => {
    dispatch(getUpdateTeamUsersToCheckout(value));
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Slider
        min={5}
        max={50}
        onChange={(value) => setCount(value)}
        onAfterChange={(value) => handleSliderChange(value)}
        value={count}
        tooltipVisible={alwaysVisible}
        tooltipPlacement={tooltipPlacement}
      />
    </div>
  );
};

export default TeamSlider;
