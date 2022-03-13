import React, { useContext, useEffect } from "react";
import { Button, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
//Global Store
import { store } from "../../../../../../../store";
//Actions
import { closeBtnOnClickHandler } from "../actions";
import { CloseOutlined } from "@ant-design/icons";

const CloseButton = () => {
  //Constants
  const navigate = useNavigate();
  //Global State
  const globalState = useContext(store);
  const { dispatch } = globalState;

  const escFn = (event) => {
    if (event.key === "Escape") closeBtnOnClickHandler(dispatch, navigate);
  };

  useEffect(() => {
    document.addEventListener("keydown", escFn);
    return () => document.removeEventListener("keydown", escFn);
    //eslint-disable-next-line
  }, []);

  return (
    <Tooltip placement="bottom" title={"Esc"}>
      <Button
        className="btn-icon btn-3"
        type="secondary"
        data-dismiss="modal"
        onClick={() => closeBtnOnClickHandler(dispatch, navigate)}
        shape="circle"
        icon={<CloseOutlined />}
      >
        {/* Close */}
      </Button>
    </Tooltip>
  );
};

export default CloseButton;
