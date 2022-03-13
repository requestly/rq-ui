import React, { useEffect, useState } from "react";
import { FaCheck, FaExclamationCircle, FaSpinner } from "react-icons/fa";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
// Firebase
// import firebase from "../../../firebase";
import firebaseApp from "../../../firebase";
import { getFunctions, httpsCallable } from "firebase/functions";
import {
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import Jumbotron from "components/bootstrap-legacy/jumbotron";
const DesktopSignIn = () => {
  //Component State
  const [allDone, setAllDone] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleDoneSignIn = async (firebaseUser) => {
    const params = new URLSearchParams(window.location.search);

    const token = await firebaseUser.getIdToken();
    const code = params.get("ot-auth-code");
    const functions = getFunctions();
    const createAuthToken = httpsCallable(functions, "createAuthToken");

    createAuthToken({
      oneTimeCode: code,
      idToken: token,
    })
      .then((res) => {
        // console.log(res);
        setAllDone(true);
        // window.close();
      })
      .catch((e) => {
        console.error(e.message);
        setIsError(true);
        // window.close();
      });
  };

  const renderLoading = () => {
    if (isError) {
      return renderErrorMessage();
    } else if (allDone) {
      return renderAllDone();
    }
    return (
      <h4 className="display-6">
        <FaSpinner className="icon-spin mr-2" />
        Authenticating
      </h4>
    );
  };

  const renderAllDone = () => {
    return (
      <h4 className="display-6">
        <FaCheck className="mr-2" />
        You're now logged into the desktop app. This window can now be safely
        closed.
      </h4>
    );
  };

  const renderErrorMessage = () => {
    return (
      <h4 className="display-6">
        <FaExclamationCircle className="mr-2" />
        An unexpected error has occurred. Please close this window and try
        logging in again
      </h4>
    );
  };

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    getRedirectResult(auth).then(async (result) => {
      if (result && result.user) {
        // User just signed in. we can get the result.credential or result.user
        await handleDoneSignIn(result.user);
      } else if (auth.currentUser) {
        // User already signed in.
        await handleDoneSignIn(auth.currentUser);
      } else {
        // No user signed in, update your UI, show the sign in button.
        // Initiate Google Sign-in for desktop app.
        // At this state, a unique code has already been generated by the desktop app, passed here as a qury param
        const provider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider);
      }
    });
  }, []);

  return (
    <React.Fragment>
      {/* Page content */}
      <Container className=" mt--5" fluid>
        {/* Table */}
        <Row>
          <div className=" col">
            <Card className=" shadow">
              <CardBody>
                <Row>
                  <Col lg="12" md="12" className="text-center">
                    <Jumbotron
                      style={{ background: "transparent" }}
                      className="text-center"
                    >
                      {renderLoading()}
                    </Jumbotron>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default DesktopSignIn;