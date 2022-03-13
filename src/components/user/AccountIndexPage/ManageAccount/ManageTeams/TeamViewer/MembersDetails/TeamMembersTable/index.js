import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Table } from "antd";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";

import { isEmpty } from "lodash";
// Icons
import { FaEdit, FaTrash } from "react-icons/fa";
// Firebase
import { getFunctions, httpsCallable } from "firebase/functions";
// Sub Components
import ChangeUserRoleModal from "./ChangeUserRoleModal";
import SpinnerColumn from "../../../../../../../misc/SpinnerColumn";
import { toast } from "utils/Toast.js";
// Utils
import { redirectToMyTeams } from "../../../../../../../../utils/RedirectionUtils";
import { getUserAuthDetails } from "../../../../../../../../utils/GlobalStoreUtils";
// Store
import { store } from "../../../../../../../../store";
import DeleteUserModal from "./DeleteUserModal";
import ContactUsModal from "./ContactUsModal";

const TeamMembersTable = ({ teamId, refresh, callback }) => {
  const navigate = useNavigate();
  const mountedRef = useRef(true);
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const user = getUserAuthDetails(state);
  // Component State
  const [members, setMembers] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [changeUserRoleModal, setChangeUserRoleModal] = useState({
    isActive: false,
    userId: false,
    isCurrentlyAdmin: false,
  });
  const [deleteUserModal, setDeleteUserModal] = useState({
    isActive: false,
    userId: false,
  });
  const [contactUsModal, setContactUsModal] = useState(false);
  const [isTeamPlanActive, setIsTeamPlanActive] = useState(true);
  const [isRemoveAllowed, setIsRemoveAllowed] = useState(false);
  const [billingExclude, setBillingExclude] = useState([]);

  const functions = getFunctions();
  const getTeamUsers = httpsCallable(functions, "getTeamUsers");
  const getTeamSubscriptionInfo = httpsCallable(
    functions,
    "getTeamSubscriptionInfo"
  );
  const getTeamBillingExclude = httpsCallable(
    functions,
    "getTeamBillingExclude"
  );

  //eslint-disable-next-line
  const stableGetTeamUsers = useCallback(getTeamUsers, []);
  // eslint-disable-next-line
  const stableGetTeamSubsctiptionInfo = useCallback(
    getTeamSubscriptionInfo,
    []
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableGetTeamBillingExclude = useCallback(getTeamBillingExclude, []);

  const toggleChangeUserRoleModal = () => {
    setChangeUserRoleModal({
      ...changeUserRoleModal,
      isActive: !changeUserRoleModal.isActive,
    });
  };

  const toggleDeleteUserModal = () => {
    setDeleteUserModal({
      ...deleteUserModal,
      isActive: !deleteUserModal.isActive,
    });
  };

  const toggleContactUsModal = () => {
    setContactUsModal((prev) => {
      //       console.log(prev);
      return !prev;
    });
  };

  const renderLoader = () => {
    return <SpinnerColumn customLoadingMessage="Finding your teammates" />;
  };

  const columns = [
    {
      title: false,
      dataIndex: "img",
      key: "img",
      align: "center",
      render: (member) => (
        <span style={{ zIndex: "unset" }}>
          <img
            alt={member.displayName}
            style={{ borderRadius: "50%", width: "12%" }}
            src={member.photoUrl}
          />
        </span>
      ),
    },
    {
      title: "Member",
      dataIndex: "member",
      align: "left",
      render: (member) => (
        <span style={{ width: "100px" }}>
          {member.displayName +
            (user.details.profile.uid === member.id ? " (You) " : "") +
            (billingExclude.includes(member.id) ? " (Free) " : "")}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: ["member", "email"],
      align: "left",
      render: (email) => <span style={{ width: "100px" }}>{email}</span>,
    },
    {
      title: "Role",
      dataIndex: "role",
      align: "center",
      render: (member) => (
        <span style={{ width: "100px" }}>
          {member.isOwner ? (
            <span>
              <Badge status="success" /> Owner
            </span>
          ) : member.isAdmin ? (
            <span>
              <Badge status="success" /> Admin
            </span>
          ) : (
            <span>Member</span>
          )}
        </span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      align: "right",
      render: (member) => (
        <span style={{ width: "300px" }}>
          {member.isOwner ? (
            "-"
          ) : (
            <span style={{ fontSize: "1.3em" }}>
              <span
                className="custom-tooltip"
                style={{ marginRight: "20px", cursor: "pointer" }}
              >
                <FaEdit
                  onClick={() => {
                    setChangeUserRoleModal({
                      ...changeUserRoleModal,
                      isActive: true,
                      userId: member.id,
                      isCurrentlyAdmin: member.isAdmin,
                    });
                  }}
                />
                <span className="custom-tooltiptext">Change Role</span>
              </span>
              <span className="custom-tooltip" style={{ cursor: "pointer" }}>
                <FaTrash
                  onClick={() => {
                    isRemoveAllowed
                      ? setDeleteUserModal({
                          ...deleteUserModal,
                          isActive: true,
                          userId: member.id,
                        })
                      : setContactUsModal(true);
                  }}
                />
                <span className="custom-tooltiptext">Remove</span>
              </span>
            </span>
          )}
        </span>
      ),
    },
  ];

  const renderTable = () => {
    return (
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    );
  };

  const fetchBillingExclude = () => {
    stableGetTeamBillingExclude({
      teamId: teamId,
    })
      .then((res) => {
        const response = res.data;
        if (response.success) {
          setBillingExclude(response.billingExclude);
        }
      })
      .catch((err) => {
        setBillingExclude([]);
      });
  };

  const fetchTeamMembers = () => {
    stableGetTeamUsers({
      teamId: teamId,
    })
      .then((res) => {
        if (!mountedRef.current) return null;
        const response = res.data;
        if (response.success) {
          setMembers(response.users);
        } else {
          throw new Error(response.message);
        }
      })
      .catch((err) => {
        if (!mountedRef.current) return null;
        toast.error(err.message);
        redirectToMyTeams(navigate);
      });
  };

  //eslint-disable-next-line
  const stableFetchTeamMembers = useCallback(fetchTeamMembers, [
    teamId,
    navigate,
  ]);

  const fetchTeamSubscriptionStatus = () => {
    stableGetTeamSubsctiptionInfo({ teamId: teamId })
      .then((res) => {
        const response = res.data;
        setIsTeamPlanActive(
          response.subscriptionStatus ===
            GLOBAL_CONSTANTS.SUBSCRIPTION_STATUS.ACTIVE
        );
      })
      .catch((err) => new Error(err));
  };

  const stableFetchTeamSubscriptionStatus = useCallback(
    fetchTeamSubscriptionStatus,
    [stableGetTeamSubsctiptionInfo, teamId]
  );

  const modifyMembersCallback = () => {
    setMembers([]); // To render loader
    mountedRef.current = true;
    fetchTeamMembers();
    isTeamPlanActive && fetchBillingExclude();
    callback && callback();
  };

  //eslint-disable-next-line
  const stableModifyMembersCallback = useCallback(modifyMembersCallback, []);

  // For loading data first time
  useEffect(() => {
    stableFetchTeamMembers();
    return () => {
      mountedRef.current = false;
    };
  }, [stableFetchTeamMembers]);

  // For refreshing data after modification has been made to the members list
  useEffect(() => {
    stableModifyMembersCallback();
  }, [stableModifyMembersCallback, refresh]);

  useEffect(() => {
    setDataSource([]);
    members.map((member, idx) => {
      return setDataSource((prevVal) => {
        return [
          ...prevVal,
          {
            key: idx + 1,
            img: member,
            member: member,
            role: member,
            actions: member,
          },
        ];
      });
    });
  }, [members]);

  useEffect(() => {
    if (user.details.isLoggedIn) {
      stableFetchTeamSubscriptionStatus();
      const isRequestlyUser =
        user.details.profile.email === "requestly.extension@gmail.com";
      setIsRemoveAllowed(isRequestlyUser || !isTeamPlanActive);
    }
  }, [user, stableFetchTeamSubscriptionStatus, teamId, isTeamPlanActive]);

  return (
    <React.Fragment>
      {/* Since members array can never be empty in any case, we can use it to show/hide loader */}
      {isEmpty(members) ? renderLoader() : renderTable()}

      <ChangeUserRoleModal
        isOpen={changeUserRoleModal.isActive}
        toggleModal={toggleChangeUserRoleModal}
        userId={changeUserRoleModal.userId}
        teamId={teamId}
        isCurrentlyAdmin={changeUserRoleModal.isCurrentlyAdmin}
        callbackOnSuccess={() => modifyMembersCallback()}
      />
      <DeleteUserModal
        isOpen={deleteUserModal.isActive}
        toggleModal={toggleDeleteUserModal}
        userId={deleteUserModal.userId}
        teamId={teamId}
        callbackOnSuccess={() => modifyMembersCallback()}
      />
      <ContactUsModal
        isOpen={contactUsModal}
        toggleModal={toggleContactUsModal}
      />
    </React.Fragment>
  );
};

export default TeamMembersTable;
