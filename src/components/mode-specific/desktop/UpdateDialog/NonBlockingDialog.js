import { notification } from "antd";
import { useCallback, useEffect } from "react";

const NonBlockingDialog = ({ updateDetails, quitAndInstall }) => {
  const onClickHandler = () => {
    quitAndInstall();
  };

  const stableOnClickHandler = useCallback(onClickHandler, [quitAndInstall]);

  useEffect(() => {
    notification.info({
      message: `New Update Downloaded (${updateDetails?.version})`,
      description: "Click this to Restart & Install",
      placement: "bottomRight",
      onClick: stableOnClickHandler,
      duration: 0,
      style: { cursor: "pointer" },
      maxCount: 1,
    });
  }, [stableOnClickHandler, updateDetails?.version]);

  return null;
};

export default NonBlockingDialog;
