const { merge } = require('lodash');
const { makeExecutableSchema } = require('graphql-tools');
const rootTypeDefs = require('./root');
const { experimentResolvers, experimentTypeDefs } = require('./experiment/experiment.schema');
const { deviceResolvers, deviceTypeDefs } = require('./device/device.schema');
const { trialResolvers, trialTypeDefs } = require('./trial/trial.schema');
const { assetResolvers, assetTypeDefs } = require('./asset/asset.schema');
const { trialSetResolvers, trialSetTypeDefs } = require('./trialSet/trialSet.schema');
const { authResolvers, authTypeDefs } = require('./auth/auth.schema');
const GraphQLJSON = require('graphql-type-json');
const jsonTypeDef = `scalar JSON`
const _JSON = {JSON:GraphQLJSON}


const executableSchema = makeExecutableSchema({
    typeDefs: [rootTypeDefs, experimentTypeDefs, deviceTypeDefs, trialTypeDefs, assetTypeDefs, trialSetTypeDefs, authTypeDefs, jsonTypeDef],
    resolvers: merge(experimentResolvers, deviceResolvers, trialResolvers, assetResolvers, trialSetResolvers, authResolvers, _JSON),
    // schemaDirectives: {
    //     requiretrial: requiretrialDirective
    // },
    formatError: error => {
        return new Error('Internal server error');
        // Or, you can delete the exception information
        // delete error.extensions.exception;
        // return error;
    },

});

module.exports = executableSchema;