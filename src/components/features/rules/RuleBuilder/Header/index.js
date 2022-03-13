import React from "react";
import { Row, Col } from "antd";
//Sub Components
import ActionTitle from "./ActionTitle";
import ActionButtons from "./ActionButtons";

const Header = (props) => {
  const {
    currentlySelectedRuleConfig,
    topCountShowRequiredDataObject,
    shareBtnClickHandler,
  } = props;
  return (
    <Row>
      <Col span={12}>
        <ActionTitle
          currentlySelectedRuleConfig={currentlySelectedRuleConfig}
          topCountShowRequiredDataObject={topCountShowRequiredDataObject}
        />
      </Col>
      <Col span={12} align="right">
        <ActionButtons
          location={props.location}
          shareBtnClickHandler={shareBtnClickHandler}
        />
      </Col>
    </Row>
  );
};

export default Header;
