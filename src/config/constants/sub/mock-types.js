import { FaCss3, FaHtml5, FaJs } from "react-icons/fa";

const MOCK_TYPES_CONFIG = {
  // API: {
  //   ID: 1,
  //   TYPE: "API",
  //   NAME: "Mock API",
  //   DESCRIPTION: "Mock an API Response",
  //   ICON: () => <ApiOutlined />,
  //   PRIMARY_COLOR: "#5b9027",
  //   SECONDARY_COLOR: "#4E7C22",
  //   TOOL_TIP_PLACEMENT: "top",
  // },
  Headers: {
    ID: 2,
    TYPE: "JS",
    NAME: "Mock JS",
    DESCRIPTION: "Mock a JS Response",
    ICON: () => <FaJs />,
    PRIMARY_COLOR: "#dd9d12",
    SECONDARY_COLOR: "#C58C10",
    TOOL_TIP_PLACEMENT: "top",
  },
  CSS: {
    ID: 3,
    TYPE: "CSS",
    NAME: "Mock CSS",
    DESCRIPTION: "Mock a CSS Response",
    ICON: () => <FaCss3 />,
    PRIMARY_COLOR: "#d32a0e",
    SECONDARY_COLOR: "#BB250C",
    TOOL_TIP_PLACEMENT: "top",
  },
  HTML: {
    ID: 4,
    TYPE: "HTML",
    NAME: "Mock HTML",
    DESCRIPTION: "Mock an HTML Response",
    ICON: () => <FaHtml5 />,
    PRIMARY_COLOR: "#2aa5e7",
    SECONDARY_COLOR: "#199ADE",
    TOOL_TIP_PLACEMENT: "top",
  },
};

export default MOCK_TYPES_CONFIG;
