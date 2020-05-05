const typeDef = `
type ExperimentData {
  project: Experiment
  id: String!
  key: String
  name: String
  description: String
  begin: String
  end: String
  location: String
  numberOfTrials: Int!
  state: String
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
    key: String!,
    name: String
    description: String
    state: String
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
