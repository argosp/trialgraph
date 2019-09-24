const typeDef = `
type DeviceType {
  id: String!
  name: String!
  notes: String
  type: String
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
  deviceTypes(experimentId:String!, entityType:String): [DeviceType]
}

extend type Mutation {
  addUpdateDeviceTypes(
    experimentId: String!,
    uid: String!,
    id: String!,
    name: String,
    notes: String,
    type: String,
    numberOfDevices: String,
    numberOfFields: String,
    properties: [KeyValInput],
    entityType: String
  ): DeviceType
}

input KeyValInput {
  key: String
  val: String
  type: String
}

extend type Subscription {
  deviceTypesUpdated(entityType:String): Boolean!
}
`;
module.exports = typeDef;
