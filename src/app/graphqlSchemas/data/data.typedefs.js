const typeDef = `
type Data {
  id: String!
  name: String!
  type: String,
  begin: String,
  end: String
}

extend type Query {
  experimentData(experimentId:String!): Data
}

extend type Mutation {
  addUpdateData(
    experimentId: String!,
    uid: String!,
    id: String!,
    name: String,
    type: String,
    begin: String,
    end: String,
  ): Data
}

extend type Subscription {
  experimentDataUpdated: Boolean!
}
`
module.exports = typeDef;