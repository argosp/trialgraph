const typeDef = `
type Entity {
  key: String!
  name: String
  entitiesTypeKey: String
  state: String
  properties: [EntityProperty]
}

extend type Query {
  entities(
    experimentId:String!,
    entitiesTypeKey:String
    trialKey: String
  ): [Entity]
}

extend type Mutation {
    addUpdateEntity(
      key: String!,
      experimentId: String!,
      uid: String!,
      name: String,
      entitiesTypeKey: String!,
      state: String,
      properties: [EntityPropertyInput]
      action: String
    ): Entity
  }

input EntityPropertyInput { 
    val: String
    key: String!
}

type EntityProperty { 
    val: String
    key: String!
}

extend type Subscription {
  devicesUpdated: Boolean!
}
`;

module.exports = typeDef;
