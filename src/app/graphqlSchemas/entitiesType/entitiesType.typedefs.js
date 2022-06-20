const typeDef = `
type EntitiesType {
  key: String!
  name: String
  numberOfEntities: Int
  state: String
  properties: [KeyVal]
}

input EntityTypeInput {
  key: String
  experimentId: String
  name: String
  numberOfEntities: Int
  state: String
  properties: [KeyValInput]
}

type KeyVal {
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

extend type Query {
  entitiesTypes(experimentId:String!): [EntitiesType]
}

extend type Mutation {
  addUpdateEntitiesType(
    key: String!,
    experimentId: String!,
    uid: String!,
    name: String,
    numberOfEntities: Int,
    state: String,
    properties: [KeyValInput]
    action: String
  ): EntitiesType
}

input KeyValInput {
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
  inheritable: Boolean
  static: Boolean
  value: String
  defaultValue: String
  defaultProperty: Boolean
}

extend type Subscription {
  entitiesTypesUpdated: Boolean!
}
`;
module.exports = typeDef;
