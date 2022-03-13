import { Button, Modal, Progress, Typography, Row, Col } from "antd";
import {
  ExclamationCircleTwoTone,
  CheckCircleTwoTone,
} from "@ant-design/icons";

const { Text } = Typography;

const BlockingDialog = ({
  updateDetails,
  isUpdateAvailable,
  isUpdateDownloaded,
  quitAndInstall,
  updateProgress,
}) => {
  const updateLink = "https://requestly.io/desktop";

  const handleDownloadClick = () => {
    window.RQ.DESKTOP.SERVICES.IPC.invokeEventInBG("open-external-link", {
      link: updateLink,
    });
  };

  const handleUpdateClick = () => {
    quitAndInstall();
  };

  const renderUpdaterContent = () => {
    if (isUpdateDownloaded) {
      return (
        <>
          <p>
            <CheckCircleTwoTone twoToneColor="green" /> Update Downloaded
          </p>
        </>
      );
    }

    if (
      updateProgress &&
      updateProgress.percent &&
      updateProgress.bytesPerSecond
    ) {
      return (
        <>
          <p>Downloading in Progress..</p>
          <Row>
            <Col span={18}>
              <Progress
                percent={updateProgress.percent}
                status="active"
                format={(percent) => {
                  return (
                    <>
                      {percent.toFixed(2) + "%"}
                      <Text code>
                        {(updateProgress.bytesPerSecond || 0) / 125000 + "Mbps"}
                      </Text>
                    </>
                  );
                }}
              />
            </Col>
          </Row>
        </>
      );
    }

    return (
      <>
        <p>Update to enjoy the latest features of Requestly</p>
        Download latest version from here:{" "}
        <Button type="link" onClick={handleDownloadClick}>
          {updateLink}
        </Button>
      </>
    );
  };

  return (
    <Modal
      centered="true"
      title={
        <>
          <ExclamationCircleTwoTone twoToneColor="red" /> Update Required
        </>
      }
      visible={true}
      closable="false"
      footer={[
        // <Button type="primary" onClick={handleDownloadClick}>
        //   Download
        // </Button>,
        <Button
          type="primary"
          onClick={handleUpdateClick}
          disabled={!isUpdateDownloaded}
        >
          Restart & Install
        </Button>,
      ]}
    >
      {renderUpdaterContent()}
    </Modal>
  );
};

export default BlockingDialog;
