import React, { useState, useEffect, useRef, useCallback } from "react";
// Sub Components
import CreateFirstTeam from "./CreateFirstTeam";
// Firebase
import { getFunctions, httpsCallable } from "firebase/functions";
import TeamsList from "./TeamsList";
import { toast } from "utils/Toast.js";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const ManageTeams = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  // Component State
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [teams, setTeams] = useState([]);
  const mountedRef = useRef(true);

  const fetchTeams = () => {
    setLoadingTeams(true);
    const functions = getFunctions();
    const getUserTeams = httpsCallable(functions, "getUserTeams");

    getUserTeams()
      .then((res) => {
        if (!mountedRef.current) return null;
        const response = res.data;
        if (!response.success) throw new Error("Unable to find team");
        setTeams(response.data);
        setLoadingTeams(false);
      })
      .catch((err) => {
        if (!mountedRef.current) return null;
        console.log(err);
        toast.error("You dont have permission to view this team.");
      });
  };

  const stableFetchTeams = useCallback(fetchTeams, []);

  useEffect(() => {
    stableFetchTeams();
    // Cleanup
    return () => {
      mountedRef.current = false;
    };
  }, [stableFetchTeams]);

  return (
    <>
      <div>
        {teams.length > 0 ? (
          <TeamsList teams={teams} />
        ) : (
          <>
            {loadingTeams ? (
              <Spin
                style={{ marginTop: "40px" }}
                indicator={antIcon}
                tip="Loading Teams"
              />
            ) : (
              <CreateFirstTeam />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ManageTeams;
