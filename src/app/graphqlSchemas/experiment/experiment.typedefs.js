const typeDef = `
type Experiment {
  id: String!
  name: String
  description: String
  status: String
}

extend type Query {
  experiments: [Experiment]
}

extend type Mutation {
    addUpdateExperiment(
      uid: String!,
      id: String!,
      key: String!,
      name: String,
      description: String,
      begin: String,
      end: String,
      location: String,
      numberOfTrials: Int!
      state: String
      status: String
    ): ExperimentData

    buildExperimentData(
      uid: String!,
      id: String!
    ): Boolean
  }
`;
module.exports = typeDef;
