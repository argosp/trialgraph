const typeDef = `
type TrialSet {
  id: String!
  name: String,
  notes: String,
  type: String,
  properties: [KeyVal]
}

extend type Query {
  trialSets(experimentId:String!): [TrialSet]
}

extend type Mutation {
  addUpdateTrialSet(
    experimentId: String!,
    uid: String!,
    id: String!,
    name: String,
    notes: String,
    type: String,
    properties: [KeyValInput]
  ): TrialSet
}

extend type Subscription {
  trialSetsUpdated: Boolean!
}
`
module.exports = typeDef;