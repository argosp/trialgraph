const typeDef = `
type Trial {
  key: String!
  name: String
  trialSetKey: String!
  created: String
  status: String
  cloneFrom: String
  numberOfDevices: Int!
  state: String
  properties: [TrialProperty]
  entities: JSON
  deployedEntities: JSON
}

extend type Query {
    trials(experimentId:String!, trialSetKey:String!): [Trial]
}

extend type Mutation {
    addUpdateTrial(
      key: String!,
      experimentId: String!,
      uid: String!,
      name: String,
      trialSetKey: String!,
      state: String,
      status: String,
      cloneFrom: String,
      numberOfDevices: Int,
      properties: [TrialPropertyInput]
      entities: JSON
      deployedEntities: JSON
      action: String
    ): Trial
  }
  
input TrialPropertyInput { 
  val: String
  key: String!
}

type TrialProperty { 
  val: String
  key: String!
}

extend type Subscription {
  trialsUpdated: Boolean!
}

`;

module.exports = typeDef;


