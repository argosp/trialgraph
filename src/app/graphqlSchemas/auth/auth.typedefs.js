const typeDef = `
  type User {
    email: String
    name: String
    username: String
    avatar: String
  }
  
  extend type Query {
    user(uid: String!): User
  }

  type LoginResult {
    token: String!
    uid: String!
  }

  input RegisterInput {
      name: String
      username: String
      email: String
      password: String
      confirmPassword: String
  }

  extend type Mutation {
      register(input: RegisterInput!): LoginResult
      login(email: String!, password: String!): LoginResult
  }
`;

module.exports = typeDef;
