const typeDef = `
type Log {
  key: String
  title: String
  comment: String
  created: String
  updated: String
  creator: String
  labels: [Label]
  allLabels: [Label]
}

input LogInput {
  title: String,
  comment: String,
  key: String
}

type Label {
  key: String
  name: String
  color: String
}

extend type Query {
  log(experimentId:String!, logId: String!): Log
  logs(experimentId:String!): [Log]
  labels(experimentId: String!): [Label]
}

extend type Mutation {
    addUpdateLog(
      experimentId: String,
      uid: String,
      logData: LogInput
    ): Log
    addUpdateLabel(
      experimentId: String,
      uid: String,
      key: String,
      name: String,
      color: String
    ): Label
  }
`;
module.exports = typeDef;
