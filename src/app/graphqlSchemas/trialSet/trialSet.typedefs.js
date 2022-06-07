const typeDef = `
type TrialSet {
  key: String!
  name: String
  description: String
  numberOfTrials: Int
  properties: [KeyVal]
  state: String
}

extend type Query {
  trialSets(experimentId:String!): [TrialSet]
}

extend type Mutation {
  addUpdateTrialSet(
    key: String!,
    experimentId: String!,
    uid: String!,
    name: String, 
    description: String,
    numberOfTrials: Int,
    state: String,
    properties: [KeyValInput]
    action: String,
    cloneTrailKey: String
  ): TrialSet
}

extend type Subscription {
  trialSetsUpdated: Boolean!
}
`;
module.exports = typeDef;
