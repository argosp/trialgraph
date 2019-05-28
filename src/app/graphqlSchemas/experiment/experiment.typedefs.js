const typeDef = `
type Experiment {
  id: String!
  name: String
}
extend type Query {
  experiments: [Experiment]
}
`
module.exports = typeDef;