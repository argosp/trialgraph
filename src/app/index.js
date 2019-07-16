const { ApolloServer } = require('apollo-server-express')
const RootConnector = require('./graphqlSchemas/connectors/rootConnector');
const Auth = require('./graphqlSchemas/auth/auth.model');
const Experiment = require('./graphqlSchemas/experiment/experiment.model');
const Device = require('./graphqlSchemas/device/device.model');
const Data = require('./graphqlSchemas/data/data.model');
const Trial = require('./graphqlSchemas/trial/trial.model');
const Asset = require('./graphqlSchemas/asset/asset.model');
const TrialSet = require('./graphqlSchemas/trialSet/trialSet.model');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const schema = require('./graphqlSchemas/schema');
const example = require('./example');
const config = require('../config');


module.exports = {
    graphql: ((app) => {
        const server = new ApolloServer({
            schema,
            context: async ({ req }) => {
                const rootConnector = new RootConnector(req.headers.authorization || config.token);
                return {
                    auth: new Auth({ connector: rootConnector }),
                    experiment: new Experiment({ connector: rootConnector }),
                    device: new Device({ connector: rootConnector }),
                    asset: new Asset({ connector: rootConnector }),
                    trialSet: new TrialSet({ connector: rootConnector }),
                    trial: new Trial({ connector: rootConnector }),
                    data: new Data({ connector: rootConnector })
                }
            },
            playground: {
                tabs: [{
                    endpoint: '/graphql',
                    query: example,
                },],
            },
        });

        server.applyMiddleware({ app, path: '/graphql' });
        return server;
    }),
    subscriptionServer: ((httpServer) => {
        new SubscriptionServer({
            execute,
            subscribe,
            schema,
        }, {
                server: httpServer,
                path: '/subscriptions'
            });

    })
};