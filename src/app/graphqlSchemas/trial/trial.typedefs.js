const typeDef = `
type Trial {
  key: String
  name: String
  trialSetKey: String
  created: String
  status: String
  cloneFrom: String
  cloneFromTrailKey: String
  numberOfEntities: Int
  state: String
  properties: [TrialProperty]
  entities: [TrialEntity]
  fullDetailedEntities: [FullDetailedEntity]
  deployedEntities: [TrialEntity]
  error: String
}

input TrialInput {
  key: String
  name: String
  trialSetKey: String
  state: String
  status: String
  cloneFrom: String
  cloneFromTrailKey: String
  numberOfEntities: Int
  properties: [TrialPropertyInput]
  entities: [TrialEntityInput]
  deployedEntities: [TrialEntityInput]
  action: String
  changedEntities: [TrialEntityInput]
}

extend type Query {
    trial(experimentId: String, trialKey: String!): Trial
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
      cloneFromTrailKey: String,
      numberOfEntities: Int,
      properties: [TrialPropertyInput]
      entities: [TrialEntityInput]
      deployedEntities: [TrialEntityInput]
      action: String
      changedEntities: [TrialEntityInput]
    ): Trial
  }

extend type Mutation {
  updateTrialContainsEntities(
    uid: String!
    key: String!
    experimentId: String!
    parentEntityKey: String!
    entity: TrialEntityInput!
    action: String!
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
  type: String
}
type FullDetailedEntity {
  key: String
  name: String
  entitiesTypeName: String
  entitiesTypeKey: String
  containsEntities:[String]
  properties: [EntityProperty]
}

type TrialEntity {
  key: String
  name: String
  entitiesTypeKey: String
  containsEntities:[String]
  properties: [EntityProperty]
}
`;

module.exports = typeDef;
