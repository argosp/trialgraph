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
    uploadFile(file: Upload!): File!
  }
  
`;


//  type Query {
//     _ : Boolean // Added here to satisfy requirement of having at least one query defined
//   }


module.exports = typeDefs;


