const typeDef = `
type Device {
  id: String!
  name: String
  deviceTypeKey: String!
  properties: [DeviceProperty]
}

extend type Query {
    devices(experimentId:String!, deviceTypeKey:String!): [Device]
}

extend type Mutation {
    addUpdateDevice(
      experimentId: String!,
      uid: String!,
      id: String!,
      name: String,
      deviceTypeKey: String!,
      properties: [DevicePropertyInput] 
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
