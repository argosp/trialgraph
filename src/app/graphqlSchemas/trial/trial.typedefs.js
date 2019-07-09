const typeDef = `
type Trial {
  id: String!
  name: String
  begin: String!
  end: String!
  device: Device,
  trialSet: TrialSet,
  properties: [KeyVal]
}
extend type Query {
    trials(experimentId:String!): [Trial]
}
extend type Mutation {
    addUpdateTrial(
      experimentId: String!,
      uid: String!,
      id: String!,
      name: String,
      begin: String,
      end: String,
      trialSet: String,
      properties: [KeyValInput],
      device: String
    ): Trial
  }
extend type Subscription {
  trialsUpdated: Boolean!
}

`

module.exports = typeDef;