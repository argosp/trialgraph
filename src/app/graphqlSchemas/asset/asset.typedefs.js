const typeDef = `
type Asset {
  id: String!
  name: String!
  type: String
  number: String
  properties: [KeyVal]
}

extend type Query {
  assets(experimentId:String!, entityType:String): [Asset]
}

extend type Mutation {
  addUpdateAsset(
    experimentId: String!,
    uid: String!,
    id: String!,
    name: String,
    type: String,
    number: String,
    properties: [KeyValInput],
    entityType: String
  ): Asset
}

extend type Subscription {
  assetsUpdated(entityType:String): Boolean!
}
`
module.exports = typeDef;