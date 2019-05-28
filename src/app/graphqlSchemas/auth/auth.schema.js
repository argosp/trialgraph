const _ = require('lodash')
const authTypeDefs = `

    type LoginResult{
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


const typeResolver = {
  LoginResult: {
    token: _.property('token'),
    uid: _.property('uid')
  }
}
const resolvers = {
  Mutation: {
    async login(_, {email, password}, context) {
        const replay = await context.auth.login(email, password);
        return replay
      },
    async register(_, args, context) {
      const { name, username, email, password, confirmPassword} = args.input
      return await context.auth.register(name, username, email, password, confirmPassword);
    },
  }
}
const authResolvers = _.merge(resolvers,typeResolver)
module.exports = {
  authTypeDefs: authTypeDefs,
  authResolvers: authResolvers
}