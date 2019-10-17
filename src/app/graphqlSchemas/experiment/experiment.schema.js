const { property, merge } = require('lodash');
const experimentTypeDefs = require('./experiment.typedefs');
const { pubsub, EXPERIMENTS_UPDATED } = require('../../subscriptions');

const typeResolver = {
  Experiment: {
    id: property('_id'),
    name: property('title'),
    description: property('description'),
    begin: property('created'),
    end: property('due'),
    location: property('location'),
    status: property('status'),
    numberOfTrials: property('numberOfTrials'),
  },
};

const resolvers = {
  Query: {
    async experiments(_, args, context) {
      return context.experiment.getAllExperiments();
    },
  },
  Mutation: {
    async addUpdateExperiment(_, args, context) {
      pubsub.publish(EXPERIMENTS_UPDATED, { experimentsUpdated: true });
      const result = await context.experiment.addUpdateExperiment(args, context);
      await context.data.addUpdateData(args, result);
      return result;
    },
    async buildExperimentData(_, args, context) {
      return context.experiment.buildExperimentData(args);
    },
  },
};

const experimentResolvers = merge(resolvers, typeResolver);

module.exports = {
  experimentTypeDefs,
  experimentResolvers,
};
