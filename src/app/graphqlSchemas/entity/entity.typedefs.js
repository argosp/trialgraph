const typeDef = `
type Entity {
  key: String
  name: String
  entitiesTypeKey: String
  state: String
  containsEntities:[String]
  properties: [EntityProperty]
  error: String
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

  input EntityInput {
    entitiesTypeKey: String
    state: String
    properties: [EntityPropertyInput]
    key: String
    name: String
  }

input EntityPropertyInput {
    val: String
    key: String!
}

type EntityProperty {
    val: String
    key: String
    type: String
    label: String
    description: String
    prefix: String
    suffix: String
    required: Boolean
    template: String
    multipleValues: Boolean
    trialField: Boolean
    static: Boolean
    inheritable: Boolean
    value: String
    defaultValue: String
    defaultProperty: Boolean
}

extend type Subscription {
  devicesUpdated: Boolean!
}
`;

module.exports = typeDef;
