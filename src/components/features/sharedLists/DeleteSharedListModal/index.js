import React, { useState, useEffect, useCallback, useContext } from "react";
import { Button, Col, Row, Space } from "antd";
import { Modal } from "antd";
import isEmpty from "is-empty";
//STORE
import { store } from "../../../../store";
//ICONS
import { FaTrash } from "react-icons/fa";
import { AiOutlineWarning } from "react-icons/ai";
//ACTIONS
import { deleteSharedList, refreshPendingStatus } from "./actions";
import { LoadingOutlined } from "@ant-design/icons";
import { getUpdateSelectedSharedListsActionObject } from "store/action-objects";

const DeleteSharedListModal = ({
  sharedListIdsToDeleteArray,
  userId,
  isOpen,
  toggle,
}) => {
  //Global State
  const globalState = useContext(store);
  const { dispatch } = globalState;
  //Component State
  const [deletionSuccessful, setDeletionSuccessful] = useState(false);
  const [deletionConfirmed, setDeletionConfirmed] = useState(false);

  const renderLoader = () => (
    <Row>
      <Col span={24} align="center">
        <Space>
          <LoadingOutlined />
        </Space>
      </Col>
    </Row>
  );

  const renderModalFooter = (options) => {
    const { showConfirmationBtn } = options;
    return (
      <Row>
        <Col span={24} align="center">
          <Space>
            <Button
              color="secondary"
              data-dismiss="modal"
              type="button"
              onClick={toggle}
            >
              Close
            </Button>
            {showConfirmationBtn ? (
              <Button
                type="primary"
                data-dismiss="modal"
                onClick={() => setDeletionConfirmed(true)}
              >
                Yes
              </Button>
            ) : null}
          </Space>
        </Col>
      </Row>
    );
  };

  const renderConfirmation = () => {
    if (isEmpty(sharedListIdsToDeleteArray)) {
      return renderWarningMessage();
    } else {
      return (
        <React.Fragment>
          <Row>
            <Col span={24} align="center">
              <h1 className="display-2">
                <FaTrash />
              </h1>
              <b>Are you sure to delete the selected lists?</b>
              <p>
                <b>Total Lists Selected: </b>
                {sharedListIdsToDeleteArray.length} <br />
              </p>
            </Col>
          </Row>
          {renderModalFooter({
            showConfirmationBtn: true,
          })}
        </React.Fragment>
      );
    }
  };

  const renderDeleteSummary = () => {
    return (
      <React.Fragment>
        <div className="modal-body ">
          <Col lg="12" md="12" xl="12" sm="12" xs="12" className="text-center">
            <b>Successfully deleted lists</b>
          </Col>
        </div>
        {renderModalFooter({
          showConfirmationBtn: false,
        })}
      </React.Fragment>
    );
  };

  const renderWarningMessage = () => (
    <React.Fragment>
      <Row>
        <Col align="center" span={24}>
          <h1 className="display-2">
            <AiOutlineWarning />
          </h1>
          <h5>Please select a list before deleting</h5>
        </Col>
      </Row>
      <br />
      {renderModalFooter({
        showConfirmationBtn: false,
      })}
    </React.Fragment>
  );

  const doDeleteSharedLists = (cb) => {
    const allPromises = [];
    sharedListIdsToDeleteArray.forEach((sharedListId) => {
      allPromises.push(deleteSharedList(userId, sharedListId, dispatch));
    });
    return Promise.all(allPromises);
  };

  const stableDoDeleteSharedLists = useCallback(doDeleteSharedLists, [
    dispatch,
    sharedListIdsToDeleteArray,
    userId,
  ]);

  const updateCurrentlySelectedLists = (dispatch, newValue) => {
    dispatch(getUpdateSelectedSharedListsActionObject(newValue));
  };

  useEffect(() => {
    if (deletionConfirmed && !deletionSuccessful) {
      stableDoDeleteSharedLists().then(() => {
        //Mark flag to prevent further detection
        setDeletionSuccessful(true);
        //Unselect all lists
        updateCurrentlySelectedLists(dispatch, {});
        //Mark flag to Refresh Lists on index page
        refreshPendingStatus(dispatch);
        //Close the modal -> Unmount this component
        toggle();
      });
    }
  }, [
    deletionConfirmed,
    deletionSuccessful,
    stableDoDeleteSharedLists,
    toggle,
    dispatch,
  ]);

  return (
    <Modal
      className="modal-dialog-centered "
      visible={isOpen}
      onCancel={toggle}
      footer={null}
      title="Delete List"
    >
      {!deletionConfirmed
        ? renderConfirmation()
        : deletionSuccessful
        ? renderDeleteSummary()
        : renderLoader()}
    </Modal>
  );
};

export default DeleteSharedListModal;
