const typeDef = `
type Device {
  key: String!
  id: String
  name: String
  deviceTypeKey: String!
  state: String
  properties: [DeviceProperty]
}

extend type Query {
    devices(experimentId:String!, deviceTypeKey:String!): [Device]
}

extend type Mutation {
    addUpdateDevice(
      key: String!,
      experimentId: String!,
      uid: String!,
      id: String,
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
