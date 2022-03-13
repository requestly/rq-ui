import React from "react";
import { Modal } from "antd";

import AceEditor from "react-ace";

import "ace-builds/src-min-noconflict/mode-javascript";
import "ace-builds/src-min-noconflict/mode-css";
import "ace-builds/src-min-noconflict/mode-json";
import "ace-builds/src-min-noconflict/theme-monokai";
import "ace-builds/src-min-noconflict/ext-language_tools";

const RuleSimulatorModal = ({ isOpen, toggle, body, mode }) => {
  return (
    <>
      <Modal
        size="small"
        visible={isOpen}
        onCancel={toggle}
        footer={null}
        style={{
          width: "300px",
          margin: "0 auto",
        }}
        bodyStyle={{ padding: "0", borderRadius: "0.45rem" }}
        width="600px"
      >
        <AceEditor
          width="100%"
          height="400px"
          placeholder={body}
          mode={mode}
          theme="monokai"
          name="body_editor"
          fontSize={17}
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={true}
          //   onChange={onBodyChange}
          value={body}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
          style={{ marginBottom: "0.5rem", marginTop: "0.5rem" }}
        />
      </Modal>
    </>
  );
};

export default RuleSimulatorModal;
