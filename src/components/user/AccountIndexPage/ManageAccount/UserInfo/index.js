import React, { useEffect, useState, useContext } from "react";
import {
  Row,
  Card,
  CardHeader,
  Col,
  Button,
  CardBody,
  FormGroup,
  Form,
  Input,
} from "reactstrap";
import Select from "react-select";
import { isEmpty } from "lodash";
import { toast } from "utils/Toast.js";
// UTILS
import DataStoreUtils from "../../../../../utils/DataStoreUtils";
import * as GlobalStoreUtils from "../../../../../utils/GlobalStoreUtils";
import { getCountryNameFromISOCode } from "../../../../../utils/FormattingHelper";
//STORE
import { store } from "../../../../../store";
// ACTIONS
import { updateUserProfile } from "./actions";
import { refreshUserInGlobalState } from "../../../common/actions";
// CONSTANTS
import APP_CONSTANTS from "../../../../../config/constants";

const UserInfo = ({
  customHeading,
  shadow,
  hideBillingAddress,
  hideIndiaInCountryList,
}) => {
  //Global State
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const user = GlobalStoreUtils.getUserAuthDetails(state);
  //Component State
  const [areChangesPending, setAreChangesPending] = useState(false);
  const [userFullName, setUserFullName] = useState("");
  const [userAddrLine1, setUserAddrLine1] = useState("");
  const [userAddrLine2, setUserAddrLine2] = useState("");
  const [userAddrCity, setUserAddrCity] = useState("");
  const [userAddrState, setUserAddrState] = useState("");
  const [userAddrCountry, setUserAddrCountry] = useState("");
  const [userAddrZIP, setUserAddrZIP] = useState("");

  const handleSaveProfileOnClick = () => {
    updateUserProfile(user.details.profile.uid, {
      FullName: userFullName,
      Address: {
        AddrLine1: userAddrLine1,
        AddrLine2: userAddrLine2,
        AddrCity: userAddrCity,
        AddrState: userAddrState,
        AddrCountry: userAddrCountry,
        AddrZIP: userAddrZIP,
      },
    }).then(() => {
      // Flag to disable submit button
      setAreChangesPending(false);
      // Refresh user in global state
      refreshUserInGlobalState(dispatch);
      // Notify
      toast.info("Profile saved");
    });
  };

  const renderSaveButton = () => {
    return (
      <Row className="align-items-center">
        <Col className="text-center" xs="12">
          <Button
            color={areChangesPending ? "primary" : "secondary"}
            onClick={handleSaveProfileOnClick}
            size="sm"
            disabled={!areChangesPending}
          >
            Save
          </Button>
        </Col>
      </Row>
    );
  };

  const renderBillingAddress = () => {
    return (
      <React.Fragment>
        <h6 className="heading-small text-muted mb-4">Billing address</h6>
        <div className="pl-lg-4">
          <Row>
            <Col md="4">
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-address-line1"
                >
                  Line 1
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-address-line1"
                  placeholder="Street"
                  type="text"
                  value={userAddrLine1}
                  onChange={(e) => {
                    setAreChangesPending(true);
                    setUserAddrLine1(e.target.value);
                  }}
                />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-address-line2"
                >
                  Line 2
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-address-line2"
                  placeholder="Appartment"
                  type="text"
                  value={userAddrLine2}
                  onChange={(e) => {
                    setAreChangesPending(true);
                    setUserAddrLine2(e.target.value);
                  }}
                />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-address-city"
                >
                  City
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-address-city"
                  placeholder="City"
                  type="text"
                  value={userAddrCity}
                  onChange={(e) => {
                    setAreChangesPending(true);
                    setUserAddrCity(e.target.value);
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg="4">
              <FormGroup>
                <label className="form-control-label" htmlFor="input-state">
                  State
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-state"
                  placeholder="State"
                  type="text"
                  value={userAddrState}
                  onChange={(e) => {
                    setAreChangesPending(true);
                    setUserAddrState(e.target.value);
                  }}
                />
              </FormGroup>
            </Col>
            <Col lg="4">
              <FormGroup>
                <label className="form-control-label" htmlFor="input-country">
                  Country
                </label>
                <Select
                  styles={APP_CONSTANTS.STYLES.reactSelectCustomStyles}
                  id="input-country"
                  className="form-control-alternative"
                  classNamePrefix="form-control-alternative"
                  placeholder="eg. United States"
                  options={APP_CONSTANTS.PRICING.COUNTRY_CODES}
                  value={
                    isEmpty(userAddrCountry)
                      ? null
                      : {
                          value: userAddrCountry,
                          label: getCountryNameFromISOCode(userAddrCountry),
                        }
                  }
                  onChange={(selectedValue) => {
                    setAreChangesPending(true);
                    setUserAddrCountry(selectedValue.value);
                  }}
                />

                {/* <Input
                  className="form-control-alternative"
                  id="input-country"
                  placeholder="Country"
                  type="select"
                  value={isEmpty(userAddrCountry) ? "choose" : userAddrCountry}
                  onChange={(e) => {
                    setAreChangesPending(true);
                    setUserAddrCountry(e.target.value);
                  }}
                >
                  <option value="choose" disabled hidden>
                    Choose country
                  </option>
                  <option value="US">United States</option>
                  <option value="DE">Germany</option>
                  {hideIndiaInCountryList ? null : (
                    <option value="IN">India</option>
                  )}
                </Input> */}
              </FormGroup>
            </Col>
            <Col lg="4">
              <FormGroup>
                <label className="form-control-label" htmlFor="input-zip-code">
                  ZIP/Postal Code
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-zip-code"
                  placeholder="eg. V6B 3K9"
                  type="text"
                  value={userAddrZIP}
                  onChange={(e) => {
                    setAreChangesPending(true);
                    setUserAddrZIP(e.target.value);
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  };

  useEffect(() => {
    // Initial values. Fetch full profile
    DataStoreUtils.getValue(["users", user.details.profile.uid]).then(
      (userRef) => {
        if (!userRef) return;
        const { profile } = userRef;
        if (profile) {
          // Full Name
          profile["displayName"] && setUserFullName(profile["displayName"]);
          // Address
          if (profile["address"]) {
            // Address - Line 1
            profile["address"]["line1"] &&
              setUserAddrLine1(profile["address"]["line1"]);
            // Address - Line 2
            profile["address"]["line2"] &&
              setUserAddrLine2(profile["address"]["line2"]);
            // Address - City
            profile["address"]["city"] &&
              setUserAddrCity(profile["address"]["city"]);
            // Address - State
            profile["address"]["state"] &&
              setUserAddrState(profile["address"]["state"]);
            // Address - ZIP Code
            profile["address"]["postal_code"] &&
              setUserAddrZIP(profile["address"]["postal_code"]);
            // Address - Country
            profile["address"]["country"] &&
              setUserAddrCountry(profile["address"]["country"]);
          }
        }
      }
    );
  }, [user]);

  return (
    <Card className={`profile-card ${shadow ? "profile-card-shadow" : ""}`}>
      <CardHeader className="bg-white border-0">
        <Row className="align-items-center">
          <Col xs="8">
            <h3 className="mb-0">
              {customHeading ? customHeading : "My account"}
            </h3>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        <Form className="profile-card-form">
          <h6 className="heading-small text-muted mb-4">Basic information</h6>
          <div className="pl-lg-4">
            <Row className="profile-card-form-info">
              <FormGroup className="profile-card-form-field">
                <label className="form-control-label" htmlFor="input-username">
                  Name
                </label>
                <Input
                  className="form-control-alternative"
                  value={userFullName}
                  id="input-username"
                  placeholder="Full Name"
                  type="text"
                  onChange={(e) => {
                    setAreChangesPending(true);
                    setUserFullName(e.target.value);
                  }}
                  style={{ textTransform: "capitalize" }}
                />
              </FormGroup>
              <FormGroup className="profile-card-form-field">
                <label className="form-control-label" htmlFor="input-email">
                  Email address
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-email"
                  placeholder="Email address"
                  type="email"
                  disabled="disabled"
                  defaultValue={user.details.profile.email}
                  style={{ textTransform: "lowercase" }}
                />
              </FormGroup>
            </Row>
          </div>

          {/* Address */}
          {hideBillingAddress ? (
            <React.Fragment></React.Fragment>
          ) : (
            renderBillingAddress()
          )}

          {areChangesPending ? (
            renderSaveButton()
          ) : (
            <React.Fragment></React.Fragment>
          )}
        </Form>
      </CardBody>
    </Card>
  );
};

export default UserInfo;
