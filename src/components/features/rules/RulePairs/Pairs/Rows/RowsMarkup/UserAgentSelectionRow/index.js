import React from "react";
import { Row, Col, Input, Dropdown, Typography, Menu } from "antd";
import ReactSelect from "react-select";

//ACTIONS
import { getAvailableUserAgents } from "./actions";
import { DownOutlined } from "@ant-design/icons";

const { Text } = Typography;

const UserAgentSelectionRow = ({
  rowIndex,
  pair,
  pairIndex,
  helperFunctions,
  isInputDisabled,
}) => {
  const { modifyPairAtGivenPath } = helperFunctions;

  const userAgentSelectorOnChangeHandler = (itemSet) => {
    modifyPairAtGivenPath(null, pairIndex, "env", itemSet.value.env, [
      {
        path: "userAgent",
        value: itemSet.value.userAgent,
      },
    ]);
  };

  const deviceTypeDropdownOnChangeHandler = (event, newValue) => {
    let extraModifications = [
      {
        path: "env",
        value: "",
      },
    ];

    if (newValue === "custom") {
      extraModifications.push({
        path: "userAgent",
        value: window.navigator.userAgent,
      });
    }

    modifyPairAtGivenPath(
      event,
      pairIndex,
      "envType",
      newValue,
      extraModifications
    );
  };

  const getCurrentUserAgentValue = () => {
    return {
      label: pair.env
        .replace("msie.msie", "Internet Explorer ")
        .replace(/[.|_]/, " "),
    };
  };

  const envTypeOptions = (
    <Menu>
      <Menu.Item key={1}>
        <span
          onClick={(event) =>
            deviceTypeDropdownOnChangeHandler(event, "device")
          }
        >
          Device
        </span>
      </Menu.Item>
      <Menu.Item key={2}>
        <span
          onClick={(event) =>
            deviceTypeDropdownOnChangeHandler(event, "browser")
          }
        >
          Browser
        </span>
      </Menu.Item>
      <Menu.Item key={3}>
        <span
          onClick={(event) =>
            deviceTypeDropdownOnChangeHandler(event, "custom")
          }
        >
          Custom
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <Row
      className=" margin-top-one"
      key={rowIndex}
      span={24}
      style={{
        alignItems: "center",
        justifyContent: "start",
      }}
      gutter={[16, 16]}
    >
      <Col span={4} lg={3} className="my-auto">
        <span>UserAgent</span>
      </Col>
      <Col
        // xl={{ size: "auto" }}
        // lg={{ size: "auto" }}
        // md={{ size: "auto" }}
        // sm="6"
        // xs="6"
        span={4}
        lg={3}
        className="my-auto"
      >
        <Dropdown overlay={envTypeOptions} disabled={isInputDisabled}>
          <Text
            strong
            className="ant-dropdown-link"
            onClick={(e) => e.preventDefault()}
            style={{ textTransform: "capitalize", cursor: "pointer" }}
          >
            {pair.envType === "" ? "Select" : pair.envType} <DownOutlined />
          </Text>
        </Dropdown>
      </Col>
      <Col xl="7" lg="7" md="7" sm="12" xs="12" span={14}>
        {pair.envType === "custom" ? (
          <Input
            placeholder="Enter custom UserAgent string"
            type="text"
            disabled={isInputDisabled}
            onChange={(event) =>
              modifyPairAtGivenPath(event, pairIndex, "userAgent")
            }
            className="display-inline-block has-dark-text "
            value={pair.userAgent}
          />
        ) : (
          <ReactSelect
            isMulti={false}
            name="env"
            options={getAvailableUserAgents(pair)}
            isDisabled={isInputDisabled}
            placeholder="Type to search"
            value={getCurrentUserAgentValue()}
            onChange={(newSelectedItemSet) =>
              userAgentSelectorOnChangeHandler(newSelectedItemSet)
            }
            noOptionsMessage={() => "Please select device type first"}
          />
        )}
      </Col>
    </Row>
  );
};

export default UserAgentSelectionRow;
