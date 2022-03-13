import React from "react";
import { Col } from "reactstrap";
import { FaSpinner } from "react-icons/fa";
import Jumbotron from "components/bootstrap-legacy/jumbotron";
import { Skeleton } from "antd";

const SpinnerColumn = (props) => {
  const { message } = props;

  const renderMessage = () => {
    if (message) {
      return (
        <h1 className="display-3">
          <span>
            <FaSpinner className="icon-spin" /> {message}
          </span>
        </h1>
      );
    }

    return null;
  };

  return (
    <Col lg="12" md="12" xl="12" sm="12" xs="12" className="text-center">
      <Jumbotron style={{ background: "transparent" }} className="text-center">
        {renderMessage()}
        <Skeleton loading={true} />
      </Jumbotron>
    </Col>
  );
};

export default SpinnerColumn;
