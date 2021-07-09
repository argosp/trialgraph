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
  entities: [EntityInput]
  deployedEntities: [EntityInput]
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
      entities: [EntityInput]
      deployedEntities: [EntityInput]
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

input EntityInput {
  typeKey: String
  properties: [DevicePropertyInput]
  containsEntities: [containsEntities]
  key: String
  type: String
}
type containsEntities {
  key: String
}
extend type Subscription {
  trialsUpdated: Boolean!
}

`;

module.exports = typeDef;


