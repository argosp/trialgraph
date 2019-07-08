const typeDef = `
type Asset {
  id: String!
  name: String!
  type: String
}

extend type Query {
  assets(experimentId:String!): [Asset]
}

extend type Mutation {
  addUpdateAsset(
    experimentId: String!,
    uid: String!,
    id: String!,
    name: String,
    type: String
  ): Asset
}

extend type Subscription {
  assetsUpdated: Boolean!
}
`
module.exports = typeDef;