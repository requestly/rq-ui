import React from "react";
import { Card, Row, Col, Tabs } from "antd";
import { CloseOutlined, CrownTwoTone } from "@ant-design/icons";
import RuleSimulator from "../../../../views/features/rules/RuleSimulatorContainer";
import ExecutionLogs from "./ExecutionLogs";
import { isExtensionVersionCompatible } from "../../../../actions/ExtensionActions";
import APP_CONSTANTS from "../../../../config/constants";
import PremiumRequiredCTA from "../../../payments/PremiumRequiredCTA";
const { TabPane } = Tabs;

const RuleEditorSplitPane = ({
  mode,
  showExecutionLogs,
  expandRulePane,
  collapseRulesPlane,
}) => {
  const activeKey = showExecutionLogs ? "executionLogs" : "ruleSimulator";
  const isExecutionLogsCompatible = isExtensionVersionCompatible(
    APP_CONSTANTS.EXECUTION_LOGS_COMPATIBILITY_VERSION
  );

  const UpgradeExtensionCTA = () => {
    return (
      <>
        <Card className="primary-card github-like-border">
          <Row>
            <Col span={24} align="center">
              <h1 className="display-3">
                {
                  "Please upgrade the extension to latest version to enable this feature"
                }
              </h1>
            </Col>
          </Row>
        </Card>
      </>
    );
  };

  return (
    <>
      <Tabs
        defaultActiveKey={activeKey}
        type="line"
        size={"large"}
        tabBarGutter={15}
        onTabClick={expandRulePane}
        tabBarExtraContent={{
          right: <CloseOutlined onClick={collapseRulesPlane} />,
        }}
      >
        <TabPane tab={"Test this Rule"} key="ruleSimulator">
          <div style={{ padding: "5px", width: "90%" }}>
            <RuleSimulator mode={mode} />
          </div>
        </TabPane>
        <TabPane
          tab={
            <span>
              {"Execution Logs "}
              {!showExecutionLogs ? (
                <CrownTwoTone twoToneColor={"limegreen"} />
              ) : null}
            </span>
          }
          key="executionLogs"
        >
          {isExecutionLogsCompatible ? (
            showExecutionLogs ? (
              <ExecutionLogs />
            ) : (
              <PremiumRequiredCTA
                message={"Execution Logs is a premium feature"}
              />
            )
          ) : (
            <UpgradeExtensionCTA />
          )}
        </TabPane>
      </Tabs>
    </>
  );
};

export default RuleEditorSplitPane;
