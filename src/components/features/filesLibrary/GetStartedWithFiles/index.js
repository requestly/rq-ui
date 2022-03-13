import React, { useState } from "react";
import { Row, Col, Button, Space } from "antd";
import ProCard from "@ant-design/pro-card";
//CONSTANTS
import APP_CONSTANTS from "../../../../config/constants";
// Icons
import { EditOutlined } from "@ant-design/icons";
import Jumbotron from "components/bootstrap-legacy/jumbotron";
import NewMockSelector from "../FilesLibraryTableContainer/FilesTable/mockModal";
import UploadFileBtn from "../UploadFileBtn";
import { redirectToCreateNewFile } from "utils/RedirectionUtils";
import { useNavigate } from "react-router-dom";

const GetStartedWithFiles = ({ updateCollection }) => {
  const navigate = useNavigate();
  const path = window.location.pathname;

  const [
    isNewRuleSelectorModalActive,
    setIsNewRuleSelectorModalActive,
  ] = useState(false);

  const toggleNewRuleSelectorModal = () => {
    setIsNewRuleSelectorModalActive(
      isNewRuleSelectorModalActive ? false : true
    );
  };
  const handleSeeDemoClick = () => {
    window.open("https://youtu.be/l2RxXQxQ3SI");
  };
  return (
    <ProCard className="primary-card github-like-border">
      <Row style={{ textAlign: "center" }} align="center">
        <Col span={24}>
          <Jumbotron
            style={{ background: "transparent" }}
            className="text-center"
          >
            {/* <h1 className="display-3">Host your JS & CSS Files</h1> */}
            <h1 className="display-3">Mock Server</h1>
            <p className="lead">
              You can host static files like HTML, CSS, JS or even Images
              <br />
              You can also create{" "}
              <span style={{ fontWeight: "bold" }}>
                Mocks for your API's
              </span>{" "}
              with{" "}
              <span style={{ fontWeight: "bold" }}>different status codes</span>
              , <span style={{ fontWeight: "bold" }}>response headers</span> or{" "}
              <span style={{ fontWeight: "bold" }}>body</span>.
              <Button
                type="link"
                color="secondary"
                onClick={() =>
                  window.open(
                    APP_CONSTANTS.LINKS.REQUESTLY_DOCS_MOCK_SERVER,
                    "_blank"
                  )
                }
              >
                Read Docs
              </Button>
            </p>

            <Space>
              <Button
                className="btn-icon btn-3"
                type="primary"
                onClick={() => {
                  path.includes("my-mocks")
                    ? redirectToCreateNewFile(navigate, "API")
                    : setIsNewRuleSelectorModalActive(true);
                }}
                icon={<EditOutlined />}
              >
                {path.includes("my-mocks")
                  ? "Create API Mock"
                  : "Create File Mock"}
              </Button>
              {path.includes("my-mocks") ? null : (
                <UploadFileBtn
                  updateCollection={updateCollection}
                  currentFilesCount={0}
                  buttonType="secondary"
                />
              )}
              <Button
                className="btn-icon btn-3"
                type="secondary"
                onClick={() => handleSeeDemoClick()}
              >
                See Demo
              </Button>
            </Space>
          </Jumbotron>
        </Col>
      </Row>
      {isNewRuleSelectorModalActive ? (
        <NewMockSelector
          isOpen={isNewRuleSelectorModalActive}
          toggle={toggleNewRuleSelectorModal}
        />
      ) : null}
    </ProCard>
  );
};

export default GetStartedWithFiles;
