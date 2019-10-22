const typeDef = `
type Data {
  project: Experiment
  id: String!
  begin: String
  end: String
  location: String
  numberOfTrials: Int!
}

extend type Query {
  experimentData(experimentId:String!): Data
  experimentsWithData: [Data]
}

extend type Mutation {
  addUpdateData(
    project: String!,
    uid: String!,
    id: String!,
    begin: String,
    end: String,
    location: String,
    numberOfTrials: Int!,
  ): Data
}

extend type Subscription {
  experimentDataUpdated: Boolean!
}
`;
module.exports = typeDef;
