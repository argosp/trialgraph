const typeDef = `
type DeviceType {
  id: String!
  name: String
  numberOfDevices: String
  numberOfFields: String
  properties: [KeyVal]
}

type KeyVal {
  key: String
  val: String
  type: String
}

extend type Query {
  deviceTypes(experimentId:String!): [DeviceType]
}

extend type Mutation {
  addUpdateDeviceTypes(
    experimentId: String!,
    uid: String!,
    id: String!,
    name: String,
    numberOfDevices: String,
    numberOfFields: String,
    properties: [KeyValInput]
  ): DeviceType
}

input KeyValInput {
  key: String
  val: String
  type: String
}

extend type Subscription {
  deviceTypesUpdated(type:String): Boolean!
}
`;
module.exports = typeDef;
