const typeDefs = `
 scalar Upload

 type File {
  id: ID!
  path: String!
  filename: String!
  mimetype: String!
  encoding: String!
}

  extend type Query {
    uploads: [File]
  }

  extend type Mutation {
    uploadFile(file: Upload!): File
    moveFile(file: String): String
    deleteFile(file: String): String
  }
  
`;
module.exports = typeDefs;


