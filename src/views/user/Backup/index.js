import React from "react";
//SUB COMPONENTS
//VIEWS
import BackupPage from "../../../components/user/BackupPage";
import ProtectedRoute from "../../../components/authentication/ProtectedRoute";

export default class Backup extends React.Component {
  render() {
    return (
      <>
        <ProtectedRoute
          premiumRequired
          component={BackupPage}
          premiumMessage="Auto backups your data at periodic intervals so that you don't ever lose them while switching devices."
        />
      </>
    );
  }
}
