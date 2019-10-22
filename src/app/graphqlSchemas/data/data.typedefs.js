const typeDef = `
type Data {
  project: String!
  id: String!
  begin: String
  end: String
  location: String
  numberOfTrials: Int!
}

extend type Query {
  experimentData(experimentId:String!): Data
}

extend type Mutation {
  addUpdateData(
    project: String!,
    uid: String!,
    id: String!,
    begin: String,
    end: String,
    location: String,
    numberOfTrials: Int,
  ): Data
}

extend type Subscription {
  experimentDataUpdated: Boolean!
}
`;
module.exports = typeDef;
