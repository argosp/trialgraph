const typeDef = `
type Device {
  id: String!
  name: String!
  type: String
  number: String
  properties: [KeyVal]
}

type KeyVal {
  key: String
  val: String
}

extend type Query {
  devices(experimentId:String!): [Device]
}

extend type Mutation {
  addUpdateDevice(
    experimentId: String!,
    uid: String!,
    id: String!,
    name: String,
    type: String,
    number: String,
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