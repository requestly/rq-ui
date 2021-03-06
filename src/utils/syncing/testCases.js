// Case 1 => When the data is the exact same in firebase and local storage. We call it similarData. We expect the merged data to be exactly same with similarData

export const similarData = [
  {
    createdBy: null,
    creationDate: 1637883809503,
    currentOwner: "B9iucUbkz7uWut24Ryo0OlDW5Rry",
    description: "",
    groupId: "",
    id: "Cancel_dr301",
    isSample: false,
    lastModified: 1637883811831,
    lastModifiedBy: null,
    modificationDate: 1637883811830,
    name: "ertert",
    objectType: "rule",
    pairs: [
      {
        id: "7kvez",
        source: {
          filters: {},
          key: "Url",
          operator: "Contains",
          value: "yiuiyui",
        },
      },
    ],
    ruleType: "Cancel",
    status: "Active",
  },
  {
    createdBy: null,
    creationDate: 1637883802524,
    currentOwner: "B9iucUbkz7uWut24Ryo0OlDW5Rry",
    description: "",
    groupId: "",
    id: "Cancel_1vkei",
    isSample: false,
    lastModified: 1637883805567,
    lastModifiedBy: null,
    modificationDate: 1637883805567,
    name: "sewr",
    objectType: "rule",
    pairs: [
      {
        id: "j23ip",
        source: {
          filters: {},
          key: "Url",
          operator: "Contains",
          value: "trytyut",
        },
      },
    ],
    ruleType: "Cancel",
    status: "Active",
  },
];

// Case 2 => When the data in both the places are same, but one is updated and the other is not. We call one updatedData and the other outdatedData. We expect the merged data to be exactly same with updatedData

export const updatedData = [
  {
    createdBy: null,
    creationDate: 1637883809503,
    currentOwner: "B9iucUbkz7uWut24Ryo0OlDW5Rry",
    description: "",
    groupId: "",
    id: "Cancel_dr301",
    isSample: false,
    lastModified: 1637883811831,
    lastModifiedBy: null,
    modificationDate: 1637883811830,
    name: "updated_rule_1",
    objectType: "rule",
    pairs: [
      {
        id: "7kvez",
        source: {
          filters: {},
          key: "Url",
          operator: "Contains",
          value: "yiuiyui",
        },
      },
    ],
    ruleType: "Cancel",
    status: "Active",
  },
  {
    createdBy: null,
    creationDate: 1637883802524,
    currentOwner: "B9iucUbkz7uWut24Ryo0OlDW5Rry",
    description: "",
    groupId: "",
    id: "Cancel_1vkei",
    isSample: false,
    lastModified: 1637883805567,
    lastModifiedBy: null,
    modificationDate: 1637883805567,
    name: "updated_rule_2",
    objectType: "rule",
    pairs: [
      {
        id: "j23ip",
        source: {
          filters: {},
          key: "Url",
          operator: "Contains",
          value: "trytyut",
        },
      },
    ],
    ruleType: "Cancel",
    status: "Active",
  },
];

export const outdatedData = [
  {
    createdBy: null,
    creationDate: 1637883809503,
    currentOwner: "B9iucUbkz7uWut24Ryo0OlDW5Rry",
    description: "",
    groupId: "",
    id: "Cancel_dr301",
    isSample: false,
    lastModified: 1637883811801,
    lastModifiedBy: null,
    modificationDate: 1637883811830,
    name: "ertert",
    objectType: "rule",
    pairs: [
      {
        id: "7kvez",
        source: {
          filters: {},
          key: "Url",
          operator: "Contains",
          value: "yiuiyui",
        },
      },
    ],
    ruleType: "Cancel",
    status: "Active",
  },
  {
    createdBy: null,
    creationDate: 1637883802524,
    currentOwner: "B9iucUbkz7uWut24Ryo0OlDW5Rry",
    description: "",
    groupId: "",
    id: "Cancel_1vkei",
    isSample: false,
    lastModified: 1637883805507,
    lastModifiedBy: null,
    modificationDate: 1637883805567,
    name: "sewr",
    objectType: "rule",
    pairs: [
      {
        id: "j23ip",
        source: {
          filters: {},
          key: "Url",
          operator: "Contains",
          value: "trytyut",
        },
      },
    ],
    ruleType: "Cancel",
    status: "Active",
  },
];

// Case 3 => When the data in firebase and local storage differ from each other. We call one firebaseData and the other localData. We expect the merged data to be union of both firebaseData and localData and we call it mergedData

export const firebaseData = [
  {
    createdBy: null,
    creationDate: 1637883809503,
    currentOwner: "B9iucUbkz7uWut24Ryo0OlDW5Rry",
    description: "",
    groupId: "",
    id: "Cancel_dr301",
    isSample: false,
    lastModified: 1637883811831,
    lastModifiedBy: null,
    modificationDate: 1637883811830,
    name: "ertert",
    objectType: "rule",
    pairs: [
      {
        id: "7kvez",
        source: {
          filters: {},
          key: "Url",
          operator: "Contains",
          value: "yiuiyui",
        },
      },
    ],
    ruleType: "Cancel",
    status: "Active",
  },
  {
    createdBy: null,
    creationDate: 1637883802524,
    currentOwner: "B9iucUbkz7uWut24Ryo0OlDW5Rry",
    description: "",
    groupId: "",
    id: "Cancel_1vkei",
    isSample: false,
    lastModified: 1637883805567,
    lastModifiedBy: null,
    modificationDate: 1637883805567,
    name: "sewr",
    objectType: "rule",
    pairs: [
      {
        id: "j23ip",
        source: {
          filters: {},
          key: "Url",
          operator: "Contains",
          value: "trytyut",
        },
      },
    ],
    ruleType: "Cancel",
    status: "Active",
  },
];

export const localData = [
  {
    createdBy: "7px5zooOVjOHfAyGFMetTrrrzsg1",
    creationDate: 1634675682348,
    currentOwner: "7px5zooOVjOHfAyGFMetTrrrzsg1",
    description: "",
    groupId: "Group_de6vs",
    id: "Redirect_11h3k",
    isSample: false,
    lastModified: 1638381744249,
    lastModifiedBy: "7px5zooOVjOHfAyGFMetTrrrzsg1",
    modificationDate: 1634675716179,
    name: "temp",
    objectType: "rule",
    pairs: [
      {
        destination: "https://www.google.com",
        id: "nfqgy",
        source: {
          filters: {},
          key: "Url",
          operator: "Contains",
          value: "facebook",
        },
      },
    ],
    ruleType: "Redirect",
    status: "Active",
  },
  {
    createdBy: "7px5zooOVjOHfAyGFMetTrrrzsg1",
    creationDate: 1634641333556,
    currentOwner: "7px5zooOVjOHfAyGFMetTrrrzsg1",
    description: "",
    groupId: "Group_de6vs",
    id: "Redirect_2dlcz",
    isSample: false,
    lastModified: 1638381056662,
    lastModifiedBy: "7px5zooOVjOHfAyGFMetTrrrzsg1",
    modificationDate: 1634641356969,
    name: "Redirect YT to google",
    objectType: "rule",
    pairs: [
      {
        destination: "https://www.google.com",
        id: "7nt9f",
        source: {
          filters: {},
          key: "Url",
          operator: "Contains",
          value: "youtube",
        },
      },
    ],
    ruleType: "Redirect",
    status: "Inactive",
  },
  {
    createdBy: "7px5zooOVjOHfAyGFMetTrrrzsg1",
    creationDate: 1638991081406,
    currentOwner: "7px5zooOVjOHfAyGFMetTrrrzsg1",
    description: "",
    groupId: "",
    id: "Redirect_xg1sm",
    isSample: false,
    lastModified: 1638997017360,
    lastModifiedBy: "7px5zooOVjOHfAyGFMetTrrrzsg1",
    modificationDate: 1638997017359,
    name: "Redirect to mock",
    objectType: "rule",
    pairs: [
      {
        destination: "https://beta.requestly.io/mock/ELkVSLIqVL09rK4EfT4w",
        id: "tala2",
        source: {
          filters: {},
          key: "Url",
          operator: "Contains",
          value: "facebook.com",
        },
      },
    ],
    ruleType: "Redirect",
    status: "Active",
  },
  {
    createdBy: "7px5zooOVjOHfAyGFMetTrrrzsg1",
    creationDate: 1638380143256,
    currentOwner: "7px5zooOVjOHfAyGFMetTrrrzsg1",
    description: "",
    groupId: "",
    id: "Cancel_6hzxi",
    isSample: false,
    lastModified: 1638380982944,
    lastModifiedBy: "7px5zooOVjOHfAyGFMetTrrrzsg1",
    modificationDate: 1638380157968,
    name: "Cancel FB",
    objectType: "rule",
    pairs: [
      {
        id: "734n9",
        source: {
          filters: {},
          key: "Url",
          operator: "Contains",
          value: "facebook",
        },
      },
    ],
    ruleType: "Cancel",
    status: "Inactive",
  },
  {
    children: [
      {
        createdBy: "7px5zooOVjOHfAyGFMetTrrrzsg1",
        creationDate: 1634675682348,
        currentOwner: "7px5zooOVjOHfAyGFMetTrrrzsg1",
        description: "",
        groupId: "Group_de6vs",
        id: "Redirect_11h3k",
        isSample: false,
        lastModified: 1638381744249,
        lastModifiedBy: "7px5zooOVjOHfAyGFMetTrrrzsg1",
        modificationDate: 1634675716179,
        name: "temp",
        objectType: "rule",
        pairs: [
          {
            destination: "https://www.google.com",
            id: "nfqgy",
            source: {
              filters: {},
              key: "Url",
              operator: "Contains",
              value: "facebook",
            },
          },
        ],
        ruleType: "Redirect",
        status: "Active",
      },
      {
        createdBy: "7px5zooOVjOHfAyGFMetTrrrzsg1",
        creationDate: 1634641333556,
        currentOwner: "7px5zooOVjOHfAyGFMetTrrrzsg1",
        description: "",
        groupId: "Group_de6vs",
        id: "Redirect_2dlcz",
        isSample: false,
        lastModified: 1638381056662,
        lastModifiedBy: "7px5zooOVjOHfAyGFMetTrrrzsg1",
        modificationDate: 1634641356969,
        name: "Redirect YT to google",
        objectType: "rule",
        pairs: [
          {
            destination: "https://www.google.com",
            id: "7nt9f",
            source: {
              filters: {},
              key: "Url",
              operator: "Contains",
              value: "youtube",
            },
          },
        ],
        ruleType: "Redirect",
        status: "Inactive",
      },
    ],
    createdBy: "7px5zooOVjOHfAyGFMetTrrrzsg1",
    creationDate: 1638373682533,
    currentOwner: "7px5zooOVjOHfAyGFMetTrrrzsg1",
    description: "",
    id: "Group_de6vs",
    lastModified: 1638381748313,
    lastModifiedBy: "7px5zooOVjOHfAyGFMetTrrrzsg1",
    name: "New Demo Group",
    objectType: "group",
    status: "Inactive",
  },
];
