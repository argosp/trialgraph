const typeDef = `
type Device {
  id: String!
  name: String!
  type: String
  properties: [KeyVal]
}

type KeyVal {
  key: String
  val: String
}

extend type Query {
  devices: [Device]
}

extend type Mutation {
  addUpdateDevice(
    uid: String!,
    id: String!,
    name: String,
    type: String,
    properties: [KeyValInput]
  ): Device
}

input KeyValInput {
  key: String
  val: String
}

extend type Subscription {
  devicesUpdated: Boolean!
}
`
module.exports = typeDef;