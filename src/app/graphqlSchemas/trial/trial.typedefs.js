const typeDef = `
type Trial {
  id: String!
  name: String
  notes: String
  begin: String!
  end: String!
  devices: [Entity],
  assets: [Entity],
  trialSet: TrialSet,
  properties: [KeyVal]
}

type Entity {
  entity: DeviceType
  properties: [KeyVal]
  name: String
  type: String
}

extend type Query {
    trials(experimentId:String!, trialSetId:String!): [Trial]
}
extend type Mutation {
    addUpdateTrial(
      experimentId: String!,
      uid: String!,
      id: String!,
      name: String,
      notes: String,
      begin: String,
      end: String,
      trialSet: String,
      properties: [KeyValInput],
      devices: [EntityInput],
      assets: [EntityInput]
    ): Trial
  }

input EntityInput {
  entity: String
  properties: [KeyValInput]
  name: String
  type: String
}

extend type Subscription {
  trialsUpdated: Boolean!
}

`;

module.exports = typeDef;
