const typeDef = `
type Log {
  key: String
  title: String
  comment: String
  created: String
  updated: String
  creator: String
}

input LogInput {
  title: String,
  comment: String,
  key: String
}

extend type Query {
  log(experimentId:String!, logId: String!): Log
  logs(experimentId:String!): [Log]
}

extend type Mutation {
    addUpdateLog(
      experimentId: String,
      uid: String,
      logData: LogInput
    ): Log
  }
`;
module.exports = typeDef;
