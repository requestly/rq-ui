import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { redirectToRules, redirectToTraffic } from "utils/RedirectionUtils";

const CompleteStep = () => {
  const navigate = useNavigate();

  const navigateToRules = () => {
    redirectToRules(navigate);
  };

  const navigateToTraffic = () => {
    redirectToTraffic(navigate);
  };

  return (
    <div>
      <Button shape="round" onClick={navigateToRules}>
        Create Rule
      </Button>
      &nbsp;
      <Button shape="round" onClick={navigateToTraffic}>
        See Traffic
      </Button>
    </div>
  );
};

export default CompleteStep;
