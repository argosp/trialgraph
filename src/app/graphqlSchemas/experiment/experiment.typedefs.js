const typeDef = `
type Experiment {
  id: String!
  name: String
}
extend type Query {
  experiments: [Experiment]
}
extend type Mutation {
    addUpdateExperiment(
      uid: String!,
      id: String!,
      name: String,
      begin: String,
      end: String
    ): Experiment
  }
`
module.exports = typeDef;