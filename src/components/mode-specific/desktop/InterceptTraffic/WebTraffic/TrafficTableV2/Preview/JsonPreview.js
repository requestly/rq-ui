import { JsonEditor as Editor } from "jsoneditor-react";
import { useEffect, useRef } from "react";

const JsonPreview = ({ data, updateAllowed, setCurrentData, setIsValid }) => {
  const jsonEditorRef = useRef(null);

  useEffect(() => {
    if (jsonEditorRef) {
      try {
        const data_obj = JSON.parse(data);
        jsonEditorRef.current.update(data_obj);
      } catch (err) {
        return <h3>Not a valid json</h3>;
      }
    }
  }, [jsonEditorRef, data]);

  const jsonUpdateHandler = (currentJson) => {
    setCurrentData(JSON.stringify(currentJson));
  };

  const setRef = (instance) => {
    if (instance) {
      jsonEditorRef.current = instance.jsonEditor;
    } else {
      jsonEditorRef.current = null;
    }
  };

  const setValidity = (errors) => {
    if (errors && errors.length > 0) setIsValid(false);
    else setIsValid(true);
  };

  // onEditable is true for now as JsonEditor doesn't support dynamic onEditable
  // https://github.com/josdejong/jsoneditor/issues/1386
  if (data) {
    try {
      const data_obj = JSON.parse(data);
      return (
        <Editor
          ref={setRef}
          value={data_obj}
          onChange={jsonUpdateHandler}
          allowedModes={["tree", "text"]}
          mode="tree"
          search={true}
          onEditable={() => true}
          htmlElementProps={{ style: { height: "95%", color: "black" } }}
          onValidationError={setValidity}
        />
      );
    } catch (err) {
      return <h3>Not a valid json</h3>;
    }
  } else {
    return <h3>Not a valid json</h3>;
  }
};

export default JsonPreview;
