const { property, merge } = require('lodash');
const authTypeDefs = require('./auth.typedefs');

const typeResolver = {
  LoginResult: {
    token: property('token'),
    uid: property('uid'),
  },
  User: {
    email: property('email'),
    name: property('name'),
    username: property('username'),
    avatar: property('profile.avatar'),
  },
};

const resolvers = {
  Mutation: {
    async login(_, { email, password }, context) {
      return context.auth.login(email, password);
    },

    async register(_, args, context) {
      const { name, username, email, password, confirmPassword } = args.input;
      return context.auth.register(name, username, email, password, confirmPassword);
    },
  },

  Query: {
    async user(_, args, context) {
      return context.auth.getUser(args.uid);
    },
  },
};

const authResolvers = merge(resolvers, typeResolver);

module.exports = {
  authTypeDefs,
  authResolvers,
};
