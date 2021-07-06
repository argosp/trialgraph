const typeDef = `
type Device {
  key: String!
  name: String
  deviceTypeKey: String!
  state: String
  properties: [DeviceProperty]
}

extend type Query {
  entities(
    experimentId:String!,
    deviceTypeKey:String
    trialKey: String
  ): [Device]
}

extend type Mutation {
    addUpdateDevice(
      key: String!,
      experimentId: String!,
      uid: String!,
      name: String,
      deviceTypeKey: String!,
      state: String,
      properties: [DevicePropertyInput]
      action: String
    ): Device
  }

input DevicePropertyInput { 
    val: String
    key: String!
}

type DeviceProperty { 
    val: String
    key: String!
}

extend type Subscription {
  devicesUpdated: Boolean!
}
`;

module.exports = typeDef;
