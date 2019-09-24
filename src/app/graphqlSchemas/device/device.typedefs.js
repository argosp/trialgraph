const typeDef = `
type Device {
  id: String!
  name: String
  height: String
  sku: String
  brand: String
  deviceType: DeviceType,
}

extend type Query {
    devices(experimentId:String!, deviceTypeId:String!): [Device]
}

extend type Mutation {
    addUpdateDevice(
      experimentId: String!,
      uid: String!,
      id: String!,
      name: String,
      height: String,
      sku: String,
      brand: String,
      deviceType: String,
    ): Device
  }

extend type Subscription {
  devicesUpdated: Boolean!
}
`;

module.exports = typeDef;
