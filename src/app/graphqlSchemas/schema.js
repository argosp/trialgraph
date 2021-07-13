const { merge } = require('lodash');
const { makeExecutableSchema } = require('graphql-tools');
const GraphQLJSON = require('graphql-type-json');
const rootTypeDefs = require('./root');
const {
  experimentResolvers,
  experimentTypeDefs,
} = require('./experiment/experiment.schema');
const {
  entitiesTypeResolvers,
  entitiesTypeTypeDefs,
} = require('./entitiesType/entitiesType.schema');
const { trialResolvers, trialTypeDefs } = require('./trial/trial.schema');
const { dataResolvers, dataTypeDefs } = require('./data/data.schema');
const {
  trialSetResolvers,
  trialSetTypeDefs,
} = require('./trialSet/trialSet.schema');
const { deviceResolvers, entitiesTypeDefs } = require('./entity/entity.schema');
const { authResolvers, authTypeDefs } = require('./auth/auth.schema');
const {
  filesUploadResolvers,
  filesUploadTypeDefs,
} = require('./filesUpload/filesUpload.schema');

const jsonTypeDef = 'scalar JSON';
const JSON = { JSON: GraphQLJSON };

const executableSchema = makeExecutableSchema({
  typeDefs: [
    rootTypeDefs,
    experimentTypeDefs,
    entitiesTypeTypeDefs,
    entitiesTypeDefs,
    trialTypeDefs,
    dataTypeDefs,
    trialSetTypeDefs,
    authTypeDefs,
    jsonTypeDef,
    filesUploadTypeDefs
    ],
  resolvers: merge(
    experimentResolvers,
    entitiesTypeResolvers,
    deviceResolvers,
    trialResolvers,
    dataResolvers,
    trialSetResolvers,
    authResolvers,
    filesUploadResolvers,
    JSON,
    
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
