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
  entities: [TrialEntity]
  deployedEntities: [TrialEntity]
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
      entities: [TrialEntityInput]
      deployedEntities: [TrialEntityInput]
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

input TrialEntityInput {
  entitiesTypeKey: String
  containsEntities:[String]
  properties: [EntityPropertyInput]
  key: String
}

type TrialEntity {
  key: String!
  name: String
  entitiesTypeKey: String
  containsEntities:[String]
  properties: [EntityProperty]
}
`;

module.exports = typeDef;


