import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Modal, Button } from "antd";
import { store } from "../../../../store/index";
import RuleBuilder from "../../../features/rules/RuleBuilder";
import { saveRule } from "../../../features/rules/RuleBuilder/Header/ActionButtons/actions/index";
import { redirectToRuleEditor } from "../../../../utils/RedirectionUtils";
import { getAppMode, getUserAuthDetails } from "utils/GlobalStoreUtils";

const RulePreviewModal = ({ rule, isOpen, toggle }) => {
  const navigate = useNavigate();
  //Global State
  const globalState = useContext(store);
  const { state, dispatch } = globalState;
  const user = getUserAuthDetails(state);
  const appMode = getAppMode(state);
  const createdBy = user?.details?.profile?.uid || null;
  const currentOwner = user?.details?.profile?.uid || null;
  const saveRuleTemplate = (ruleObj) => {
    const lastModifiedBy = Date.now();
    const modificationDate = Date.now();
    ruleObj.appMode = appMode;
    saveRule(ruleObj.appMode, dispatch, {
      ...ruleObj.ruleDefinition,
      createdBy,
      currentOwner,
      lastModifiedBy,
      modificationDate,
    }).then(() => redirectToRuleEditor(navigate, ruleObj.ruleDefinition.id));
  };

  return (
    <Modal
      className="modal-dialog-centered max-width-80-percent "
      visible={isOpen}
      onCancel={toggle}
      footer={null}
      title={
        <Row justify="space-between" align="middle">
          <Col flex="auto">{rule.ruleDefinition.name} (Read Only Mode)</Col>
          <Col flex="none" style={{ marginRight: "2rem" }}>
            {" "}
            <Button type="primary" onClick={() => saveRuleTemplate(rule)}>
              Use this Template
            </Button>
          </Col>
        </Row>
      }
      width="90%"
    >
      <RuleBuilder rule={rule.ruleDefinition} isSharedListViewRule={true} />
    </Modal>
  );
};

export default RulePreviewModal;
