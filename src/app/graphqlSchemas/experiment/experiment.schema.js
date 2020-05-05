const { property, merge } = require('lodash');
const experimentTypeDefs = require('./experiment.typedefs');
const { pubsub, EXPERIMENTS_UPDATED } = require('../../subscriptions');

const typeResolver = {
  Experiment: {
    id: property('id'),
    name: property('title'),
    description: property('description'),
    status: property('status'),
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
      if (args.id === '') {
        const experiment = await context.experiment.addUpdateExperiment(args, context);

        pubsub.publish(EXPERIMENTS_UPDATED, { experimentsUpdated: true });

      return context.data.addUpdateExperimentData(args, experiment);
      } else {
        if (args.state === 'Deleted') {
          const experiment = await context.experiment.addUpdateExperiment(args, context);
          pubsub.publish(EXPERIMENTS_UPDATED, { experimentsUpdated: true });
        }
        return context.data.addUpdateExperimentData(args, args);
      }
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
