const typeDef = `
type DeviceType {
  key: String!
  name: String
  numberOfDevices: Int
  state: String
  properties: [KeyVal]
}

type KeyVal {
  key: String
  type: String
  label: String
  description: String
  prefix: String
  suffix: String
  required: Boolean
  template: String
  multipleValues: Boolean
  trialField: Boolean
  value: String
  defaultValue: String
  defaultProperty: Boolean
}

extend type Query {
  entitiesTypes(experimentId:String!): [DeviceType]
}

extend type Mutation {
  addUpdateDeviceType(
    key: String!,
    experimentId: String!,
    uid: String!,
    name: String,
    numberOfDevices: Int,
    state: String,
    properties: [KeyValInput]
    action: String
  ): DeviceType
}

input KeyValInput {
  key: String
  type: String
  label: String
  description: String
  prefix: String
  suffix: String
  required: Boolean
  template: String
  multipleValues: Boolean
  trialField: Boolean
  value: String
  defaultValue: String
  defaultProperty: Boolean
}

extend type Subscription {
  deviceTypesUpdated: Boolean!
}
`;
module.exports = typeDef;
