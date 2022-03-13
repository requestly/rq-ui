import React, { useState, useContext } from "react";
import { Row, Col, Card, Button, Input, Rate } from "antd";
import { toast } from "utils/Toast.js";
//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
//STORE
import { store } from "../../../store";
import { getUserAuthDetails } from "../../../utils/GlobalStoreUtils";
import axios from "axios";
import { getFunctions, httpsCallable } from "firebase/functions";
import { trackUninstallFeedbackEvent } from "utils/analytics/misc/uninstall_feedback";

const TRACKING = GLOBAL_CONSTANTS.GA_EVENTS;

const Goodbye = () => {
  const functions = getFunctions();
  //Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const user = getUserAuthDetails(state);

  //Component State
  const [response, setResponse] = useState({
    uses: "",
    recommend: 0,
    suggestions: "",
  });
  const [responseSubmitted, setResponseSubmitted] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [starResponse, setStarResponse] = useState("false");
  const sendFeedbackResponse = httpsCallable(functions, "sendFeedbackResponse");
  //handleChange
  const handleChange = (e) => {
    const { name, value } = e.target;
    setResponse((prevVal) => {
      return {
        ...prevVal,
        [name]: value,
      };
    });
  };
  const handleSubmit = () => {
    if (response.uses === "") {
      return toast.error(
        "Please provide what have you used Requestly the most for!"
      );
    }
    if (!user.loggedIn) {
      if (userEmail === "")
        return toast.error("Please provide your e-mail address");
      else if (
        userEmail !== "" &&
        !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          userEmail.trim()
        )
      ) {
        return toast.error("Please enter your valid e-mail address");
      }
    } else {
    }

    setResponseSubmitted(true);

    const email = user.loggedIn ? user.details.profile.email : userEmail;
    trackUninstallFeedbackEvent(
      response.recommend,
      response.uses,
      response.suggestions,
      email
    );

    const excelData = {
      email: user.loggedIn ? user.details.profile.email : userEmail,
      uses: response.uses,
      recommend: response.recommend,
      suggestions: response.suggestions,
      date: new Date(),
    };

    //saving data in excel sheet
    axios
      .post(
        "https://sheet.best/api/sheets/a850f90b-6dca-4bac-bde2-733811c273e2",
        excelData
      )
      .then((res) => {
        sendFeedbackResponse({
          email: user.loggedIn ? user.details.profile.email : userEmail,
          mailType: "goodbye",
          message:
            "Rating:" +
            response.recommend +
            "," +
            "Issue:" +
            response.uses +
            "," +
            "Suggestions:" +
            response.suggestions,
          userName: user.loggedIn
            ? user.details.profile.displayName
            : "not_signed_in",
        })
          .then(() => {
            console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      });
  };

  return (
    <React.Fragment>
      <Row>
        <Col style={{ width: "100%", height: "100%" }}>
          {responseSubmitted ? (
            <Row type="flex" justify="center" align="middle">
              <Col>
                <Card
                  style={{
                    marginTop: "15%",
                    border: "2px solid #0a48b3",
                    borderRadius: "5px",
                  }}
                >
                  <div
                    style={{
                      margin: "10px 0px 0px 10px",
                      textAlign: "center",
                    }}
                  >
                    <h2>Thanks 🙂 for your valuable feedback.</h2>
                    {/* <h2>
                        To submit review on chrome store{" "}
                        <img
                          width="25px"
                          height="50px"
                          alt="chrome-store-logo"
                          src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Chrome_Web_Store_logo_2012-2015.svg"
                        />
                        <br></br>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            //Analytics
                            submitEventUtil(
                              TRACKING.CATEGORIES.EXTENSION,
                              TRACKING.ACTIONS.CLICKED,
                              `Review on chrome store button clicked`
                            );
                          }}
                          href="https://chrome.google.com/webstore/detail/requestly-redirect-url-mo/mdnleldcmiljblolnjhpnblkcekpdkpa?hl=en"
                        >
                          <span>
                            Click here <LinkOutlined />
                          </span>
                        </a>
                      </h2> */}
                  </div>
                </Card>
              </Col>
            </Row>
          ) : starResponse === "false" ? (
            <Row type="flex" justify="center" align="middle">
              <Col>
                <Card
                  style={{
                    marginTop: "45%",
                    borderTopRightRadius: "10px",
                    borderTopLeftRadius: "10px",
                    borderBottomRightRadius: "10px",
                    borderBottomLeftRadius: "10px",
                    border: "2px solid #0a48b3",
                  }}
                >
                  <div
                    style={{
                      marginTop: "20px",
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <h3>How satisified were you while using Requestly?</h3>
                    <Rate
                      onChange={(e) => {
                        setStarResponse("true");
                        setResponse((prev) => {
                          return {
                            ...prev,
                            recommend: e,
                          };
                        });
                      }}
                    />
                    <p>Select an option</p>
                  </div>
                </Card>
              </Col>
            </Row>
          ) : (
            <Row type="flex" justify="center" align="middle">
              <Col>
                <Card
                  style={{
                    borderRadius: "10px",
                    border: "2px solid #0a48b3",
                    marginTop: "35px",
                  }}
                >
                  <div style={{ textAlign: "center", verticalAlign: "middle" }}>
                    <h3>We are sad to see you go ☹️</h3>
                    <h3>
                      {" "}
                      We value your opinions a lot and your final feedback will
                      help us make Requestly better.
                    </h3>
                    <h3>Thank you!</h3>
                    <div className="app">
                      <div
                        style={{ margin: "20px auto 0px auto", width: "70%" }}
                      >
                        <div style={{ marginBottom: "20px" }}>
                          <h3>
                            What went wrong?{" "}
                            <span style={{ color: "red" }}>*</span>
                          </h3>
                          <Input.TextArea
                            name="uses"
                            rows={3}
                            value={response.uses}
                            onChange={handleChange}
                          />
                        </div>
                        <div></div>
                        <div style={{ marginTop: "20px" }}>
                          <h3>Any suggestion or feature requests?</h3>
                          <Input.TextArea
                            name="suggestions"
                            value={response.suggestions}
                            rows={3}
                            onChange={handleChange}
                          />
                        </div>
                        {user.loggedIn ? null : (
                          <div style={{ marginTop: "20px" }}>
                            <h3>
                              Enter your Email{" "}
                              <span style={{ color: "red" }}>*</span>
                            </h3>
                            <Input
                              placeholder="Enter your email address"
                              name="email"
                              value={userEmail}
                              onChange={(e) => setUserEmail(e.target.value)}
                            />
                          </div>
                        )}
                        <Button
                          style={{ width: "fit-content", marginTop: "20px" }}
                          block
                          type="primary"
                          size="large"
                          onClick={handleSubmit}
                        >
                          Submit Review
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Goodbye;
