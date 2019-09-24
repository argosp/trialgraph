const { merge } = require('lodash');
const { makeExecutableSchema } = require('graphql-tools');
const GraphQLJSON = require('graphql-type-json');
const rootTypeDefs = require('./root');
const {
  experimentResolvers,
  experimentTypeDefs,
} = require('./experiment/experiment.schema');
const {
  deviceTypeResolvers,
  deviceTypeTypeDefs,
} = require('./deviceType/deviceType.schema');
const { trialResolvers, trialTypeDefs } = require('./trial/trial.schema');
const { assetResolvers, assetTypeDefs } = require('./asset/asset.schema');
const { dataResolvers, dataTypeDefs } = require('./data/data.schema');
const {
  trialSetResolvers,
  trialSetTypeDefs,
} = require('./trialSet/trialSet.schema');
const { authResolvers, authTypeDefs } = require('./auth/auth.schema');

const jsonTypeDef = 'scalar JSON';
const _JSON = { JSON: GraphQLJSON };

const executableSchema = makeExecutableSchema({
  typeDefs: [
    rootTypeDefs,
    experimentTypeDefs,
    deviceTypeTypeDefs,
    trialTypeDefs,
    assetTypeDefs,
    dataTypeDefs,
    trialSetTypeDefs,
    authTypeDefs,
    jsonTypeDef,
  ],
  resolvers: merge(
    experimentResolvers,
    deviceTypeResolvers,
    trialResolvers,
    assetResolvers,
    dataResolvers,
    trialSetResolvers,
    authResolvers,
    _JSON,
  ),
  // schemaDirectives: {
  //     requiretrial: requiretrialDirective
  // },
  formatError: error => new Error('Internal server error'),
  // Or, you can delete the exception information
  // delete error.extensions.exception;
  // return error;
});

module.exports = executableSchema;
