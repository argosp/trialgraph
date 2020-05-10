const typeDef = `
type Trial {
  key: String!
  id: String
  name: String
  trialSetKey: String!
  created: String
  status: String
  numberOfDevices: Int!
  state: String
  properties: [TrialProperty]
  entities: [Entity]
  deployedEntities: [Entity]
}

type Entity {
  typeKey: String
  properties: [DeviceProperty]
  key: String
  type: String
}

extend type Query {
    trials(experimentId:String!, trialSetKey:String!): [Trial]
}

extend type Mutation {
    addUpdateTrial(
      key: String!,
      experimentId: String!,
      uid: String!,
      id: String,
      name: String,
      trialSetKey: String!,
      state: String,
      status: String,
      numberOfDevices: Int!,
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

input EntityInput {
  typeKey: String
  properties: [DevicePropertyInput]
  key: String
  type: String
}

extend type Subscription {
  trialsUpdated: Boolean!
}

`;

module.exports = typeDef;
