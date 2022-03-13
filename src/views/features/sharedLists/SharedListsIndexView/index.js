import React from "react";
//SUB COMPONENTS
//VIEWS
import SharedListsIndexPage from "../../../../components/features/sharedLists/SharedListsIndexPage";
import ProtectedRoute from "../../../../components/authentication/ProtectedRoute";

export default class SharedListsIndexView extends React.Component {
  render() {
    return (
      <>
        <ProtectedRoute component={SharedListsIndexPage} />
      </>
    );
  }
}
