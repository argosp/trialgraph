const typeDef = `
type Experiment {
  id: String!
  name: String
  description: String
  status: String
}

input ExperimentInput {
  id: String
  key: String
  name: String
  description: String 
  begin: String
  end: String
  location: String
  numberOfTrials: Int
  state: String
  status: String
  maps: [MapInput]
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
type AllExperimentData {
  entityTypes: [EntitiesType]
  entities: [Entity]
  trialSets:[TrialSet]
  trials: [Trial]
  logs: [Log]
}

extend type Query {
  getAllExperimentData(experimentId: String): AllExperimentData
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

    uploadExperiment(
      experiment: ExperimentInput
      entityTypes: [EntityTypeInput]
      entities: [EntityInput]
      trialSets: [TrialSetInput]
      trials: [TrialInput]
      logs: [LogInput]
      uid: String
    ): ExperimentData

    buildExperimentData(
      uid: String!,
      id: String!
    ): Boolean
  }
`;
module.exports = typeDef;
