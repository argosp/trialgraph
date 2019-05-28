const typeDef = `
type Trial {
  id: String!
  name: String
  begin: String!
  end: String!
  devices: [Device]
}
extend type Query {
    trials(experimentId:String!): [Trial]
}
extend type Mutation {
    addUpdateTrial(
      experimentId: String!,
      uid: String!,
      id: String!,
      name: String,
      begin: String,
      end: String,
      devices: [String]
    ): Trial
  }
extend type Subscription {
  trialsUpdated: Boolean!
}

`

module.exports = typeDef;