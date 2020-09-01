const typeDefs = `
 scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  extend type Query {
    uploads: [File]
  }

  extend type Mutation {
    uploadFile(file: Upload!): String
    moveFile(file: String): String
    deleteFile(file: String): String
  }
  
`;
module.exports = typeDefs;



// uploadFile(file: Upload!): File!