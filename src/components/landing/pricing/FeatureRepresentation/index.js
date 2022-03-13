import React from "react";
import {
  CheckCircleFilled,
  CloseOutlined,
  ExclamationCircleTwoTone,
} from "@ant-design/icons";
// import { BiSad } from "react-icons/bi";

export default function FeatureRepresentation({ feature }) {
  if (feature.title && feature.enabled === true) {
    return (
      <div style={{ display: "flex", margin: "5px" }}>
        <h3 className="pricing-table-item-text" style={{ margin: "5px" }}>
          {feature.icon && feature.icon === "frown" ? (
            <ExclamationCircleTwoTone
              style={{ alignSelf: "center", marginRight: "2px" }}
            />
          ) : (
            <CheckCircleFilled
              className="pricing-icon"
              style={{
                alignSelf: "center",
                marginRight: "2px",
              }}
            />
          )}{" "}
          {feature.title}
        </h3>
      </div>
    );
  } else if (feature.title && feature.enabled === false) {
    return (
      <div style={{ display: "flex", margin: "5px" }}>
        <h3
          className="pricing-table-item-text"
          style={{ color: "grey", margin: "5px" }}
        >
          <CloseOutlined style={{ alignSelf: "center", marginRight: "2px" }} />
          {feature.title}
        </h3>
      </div>
    );
  } else if (feature.title) {
    return feature.title;
  }
}
