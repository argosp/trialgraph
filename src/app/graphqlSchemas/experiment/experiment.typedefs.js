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
input MapInput {
  imageUrl: String
  imageName: String
  lower: Float
  upper: Float
  left: Float
  right: Float
  width: Int
  height: Int
  embedded: Boolean
}
type Map {
  imageUrl: String
  imageName: String
  lower: Float
  upper: Float
  left: Float
  right: Float
  width: Int
  height: Int
  embedded: Boolean
}

extend type Query {
  getAllExperimentData(experimentId: String): JSON
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
      maps: [MapInput]
      action: String
      cloneTrailId: String
    ): ExperimentData

    buildExperimentData(
      uid: String!,
      id: String!
    ): Boolean
  }
`;
module.exports = typeDef;
