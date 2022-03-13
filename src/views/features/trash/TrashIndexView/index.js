import React from "react";
//SUB COMPONENTS
//VIEWS
import TrashIndexPage from "../../../../components/features/trash/TrashIndexPage";
import ProtectedRoute from "../../../../components/authentication/ProtectedRoute";

export default class TrashIndexView extends React.Component {
  render() {
    return (
      <>
        <ProtectedRoute component={TrashIndexPage} />
      </>
    );
  }
}
