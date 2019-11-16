const typeDef = `
type ExperimentData {
  project: Experiment
  id: String!
  begin: String
  end: String
  location: String
  numberOfTrials: Int!
}

extend type Query {
  experimentData(experimentId:String!): ExperimentData
  experimentsWithData: [ExperimentData]
}

extend type Mutation {
  addUpdateExperimentData(
    project: String!,
    uid: String!,
    id: String!,
    begin: String,
    end: String,
    location: String,
    numberOfTrials: Int!,
  ): ExperimentData
}

extend type Subscription {
  experimentDataUpdated: Boolean!
}
`;
module.exports = typeDef;
