const typeDef = `
type Device {
  id: String!
  name: String!
  notes: String
  type: String
  number: String
  properties: [KeyVal]
}

type KeyVal {
  key: String
  val: String
  type: String
}

extend type Query {
  devices(experimentId:String!, entityType:String): [Device]
}

extend type Mutation {
  addUpdateDevice(
    experimentId: String!,
    uid: String!,
    id: String!,
    name: String,
    notes: String,
    type: String,
    number: String,
    properties: [KeyValInput],
    entityType: String
  ): Device
}

input KeyValInput {
  key: String
  val: String
  type: String
}

extend type Subscription {
  devicesUpdated(entityType:String): Boolean!
}
`
module.exports = typeDef;