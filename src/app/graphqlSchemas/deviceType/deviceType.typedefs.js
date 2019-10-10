const typeDef = `
type DeviceType {
  id: String!
  name: String
  numberOfDevices: Int
  numberOfFields: Int
  properties: [KeyVal]
}

type KeyVal {
  key: String
  type: String
  id: String
  label: String
  description: String
  prefix: String
  suffix: String
  required: Boolean
  template: String
  multipleValues: Boolean
  trialField: Boolean
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
    numberOfDevices: Int,
    numberOfFields: Int,
    properties: [KeyValInput]
  ): DeviceType
}

input KeyValInput {
  key: String
  type: String
  id: String
  label: String
  description: String
  prefix: String
  suffix: String
  required: Boolean
  template: String
  multipleValues: Boolean
  trialField: Boolean
}

extend type Subscription {
  deviceTypesUpdated: Boolean!
}
`;
module.exports = typeDef;
