import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Badge } from "antd";
// Sub Components
import CreateTeamModal from "../CreateFirstTeam/CreateTeamModal";
// Utils
import { redirectToTeam } from "../../../../../../utils/RedirectionUtils";
import { FaLock } from "react-icons/fa";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
// ANALYTICS
import { submitEventUtil } from "../../../../../../utils/AnalyticsUtils";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import ProTable from "@ant-design/pro-table";

const TRACKING = GLOBAL_CONSTANTS.GA_EVENTS;

const TeamsList = ({ teams = [] }) => {
  const navigate = useNavigate();
  // Component State
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);

  const toggleCreateTeamModal = () => {
    setIsCreateTeamModalOpen(!isCreateTeamModalOpen);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const renderSubscriptionStatus = (subscriptionStatus, teamId) => {
    switch (subscriptionStatus) {
      case "active":
        return (
          <span
            style={{ width: "300px" }}
            onClick={() => redirectToTeam(navigate, teamId)}
          >
            <Badge status="success" /> Active
          </span>
        );

      case "incomplete":
        return (
          <Button
            className="btn-icon btn-3"
            color="primary"
            size="sm"
            type="button"
            onClick={() => redirectToTeam(navigate, teamId)}
          >
            <span>
              <FaLock />
            </span>
            <span>Pay now</span>
          </Button>
        );

      default:
        return (
          <span style={{ width: "300px" }}>
            <Badge status="error" /> Inactive
          </span>
        );
    }
  };

  const columns = [
    {
      title: "Team",
      dataIndex: "name",
      render: (_, record) => (
        <span
          onClick={() => {
            redirectToTeam(navigate, record.id);

            //Analytics
            submitEventUtil(
              TRACKING.CATEGORIES.TEAMS,
              TRACKING.ACTIONS.ROUTE_VIEWED,
              `Redirected to Selected Team Page by user`,
              { teamId: record.id }
            );
          }}
          style={{
            cursor: "pointer",
          }}
        >
          {_}
        </span>
      ),
    },
    {
      title: "Members",
      dataIndex: "accessCount",
    },
    {
      title: "Admins",
      dataIndex: "adminCount",
    },
    {
      title: "Subscription",
      render: (_, record) => {
        return renderSubscriptionStatus(record.subscriptionStatus, record.id);
      },
    },
    {
      title: "Actions",
      align: "right",
      render: (_, record) => (
        <span
          style={{ width: "300px", cursor: "pointer" }}
          onClick={() => {
            redirectToTeam(navigate, record.id);

            //Analytics
            submitEventUtil(
              TRACKING.CATEGORIES.TEAMS,
              TRACKING.ACTIONS.ROUTE_VIEWED,
              `Redirected to Selected Team Page by user`,
              { teamId: record.id }
            );
          }}
        >
          <EditOutlined />
        </span>
      ),
    },
  ];

  const getDataSource = () => {
    const dataSource = [];
    if (teams) {
      Object.keys(teams).forEach((teamId) => {
        dataSource.push({
          id: teamId,
          ...teams[teamId],
        });
      });
    }
    return dataSource;
  };

  return (
    <>
      <ProTable
        rowKey="id"
        pagination={false}
        options={false}
        search={false}
        dateFormatter={false}
        columns={columns}
        dataSource={getDataSource()}
        headerTitle="My Teams"
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              setIsCreateTeamModalOpen(true);
              //Analytics
              submitEventUtil(
                TRACKING.CATEGORIES.TEAMS,
                TRACKING.ACTIONS.CLICKED,
                `Create New Team Btn Clicked`
              );
            }}
            icon={<PlusOutlined />}
          >
            Create New Team
          </Button>,
        ]}
      />

      <CreateTeamModal
        isOpen={isCreateTeamModalOpen}
        handleToggleModal={toggleCreateTeamModal}
      />
    </>
  );
};

export default TeamsList;
