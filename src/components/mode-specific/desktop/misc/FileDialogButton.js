import { Button } from "antd";
import { useState } from "react";

const FileDialogButton = ({ text, callback }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDialogPromise = (result) => {
    const { canceled, filePaths, bookmarks } = result;
    if (!canceled) {
      setSelectedFile(filePaths[0]);
      if (callback) {
        return callback(filePaths[0]);
      }
    }

    // return callback(null);
  };

  const onClickHandler = () => {
    if (
      window.RQ &&
      window.RQ.DESKTOP &&
      window.RQ.DESKTOP.SERVICES &&
      window.RQ.DESKTOP.SERVICES.IPC
    ) {
      window.RQ.DESKTOP.SERVICES.IPC.invokeEventInMain(
        "open-file-dialog",
        {}
      ).then((result) => {
        handleDialogPromise(result);
      });
    }
  };

  return (
    <Button onClick={onClickHandler} style={{ marginRight: 8 }}>
      {text || "Select File"}
    </Button>
  );
};

export default FileDialogButton;
