const typeDef = `
type Trial {
  key: String!
  name: String
  trialSetKey: String!
  created: String
  status: String
  cloneFrom: String
  numberOfEntities: Int
  state: String
  properties: [TrialProperty]
  entities: [Entity]
  deployedEntities: [Entity]
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
      numberOfEntities: Int,
      properties: [TrialPropertyInput]
      entities: [EntityInput]
      deployedEntities: [EntityInput]
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


