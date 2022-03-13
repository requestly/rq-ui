import React from "react";
//SUB COMPONENTS
//VIEWS
import RemoteRulesSettings from "../../../components/user/RemoteRulesSettings";
import ProtectedRoute from "../../../components/authentication/ProtectedRoute";

export default class RemoteRules extends React.Component {
  render() {
    return (
      <>
        <ProtectedRoute component={RemoteRulesSettings} />
      </>
    );
  }
}
