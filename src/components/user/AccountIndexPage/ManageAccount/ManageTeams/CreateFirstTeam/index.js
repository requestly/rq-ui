import React, { useState } from "react";
import { Button, Row, Col, Space } from "antd";
// SUB COMPONENTS
import CreateTeamModal from "./CreateTeamModal";
// CONSTANTS
import APP_CONSTANTS from "../../../../../../config/constants";
import ProCard from "@ant-design/pro-card";

const CreateFirstTeam = () => {
  //Component State
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);

  const toggleCreateTeamModal = () => {
    setIsCreateTeamModalOpen(!isCreateTeamModalOpen);
  };
  return (
    <>
      <ProCard className="primary-card github-like-border" title="My Teams">
        <Row>
          <Col span={24} align="center">
            <p>
              You can create or join multiple teams. Each team is billed
              separately and subscription is shared with all members.
            </p>
            <br />
            <Space>
              <Button
                type="primary"
                onClick={() => setIsCreateTeamModalOpen(true)}
              >
                Create your first team
              </Button>
              <Button
                onClick={(e) =>
                  window.open(
                    APP_CONSTANTS.LINKS.REQUESTLY_DOCS_TEAM_SUBSCRIPTION,
                    "_blank"
                  )
                }
              >
                Know More
              </Button>
            </Space>
          </Col>
        </Row>
      </ProCard>
      <CreateTeamModal
        isOpen={isCreateTeamModalOpen}
        handleToggleModal={toggleCreateTeamModal}
      />
    </>
  );
};

export default CreateFirstTeam;
