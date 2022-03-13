import React, { useState } from "react";
import { Row, Col, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
//UTILS
import { redirectToRules } from "../../../../utils/RedirectionUtils";
//CONSTANTS
import ProCard from "@ant-design/pro-card";
import Jumbotron from "components/bootstrap-legacy/jumbotron";
import ImportSharedListFromURLModal from "../ImportSharedListFromURLModal";

const CreateSharedListCTA = () => {
  const navigate = useNavigate();
  // Component State
  const [
    isImportSharedListFromURLModalVisible,
    setIsImportSharedListFromURLModalVisible,
  ] = useState(false);

  const renderActionsButtons = () => {
    return (
      <>
        <Button
          type="primary"
          onClick={() => setIsImportSharedListFromURLModalVisible(true)}
        >
          Import from URL
        </Button>
        <Button color="secondary" onClick={() => redirectToRules(navigate)}>
          Go to Rules
        </Button>
      </>
    );
  };

  return (
    <ProCard className="primary-card github-like-border">
      <Row>
        <Col span={24} style={{ textAlign: "center" }}>
          <Jumbotron
            style={{ background: "transparent" }}
            className="text-center"
          >
            <h1 className="display-3">Share Rules with other users</h1>
            <p className="lead">
              To create a Shared List, go to Rules page, select the required
              Rules & click Share Rules button
            </p>
            <Space>{renderActionsButtons()}</Space>
          </Jumbotron>
        </Col>
      </Row>
      {isImportSharedListFromURLModalVisible ? (
        <ImportSharedListFromURLModal
          isOpen={isImportSharedListFromURLModalVisible}
          toggle={() =>
            setIsImportSharedListFromURLModalVisible(
              !isImportSharedListFromURLModalVisible
            )
          }
        />
      ) : null}
    </ProCard>
  );
};

export default CreateSharedListCTA;
