const { property, merge } = require('lodash');
const { pubsub, DATAS_UPDATED } = require('../../subscriptions');
const dataTypeDefs = require('./data.typedefs');

const typeResolver = {
  Data: {
    id: property('id'),
    begin: property('custom.data.begin'),
    end: property('custom.data.end'),
    location: property('custom.data.location'),
    numberOfTrials: property('custom.data.numberOfTrials'),
    project: property('project'),
  },
};

const resolvers = {
  Query: {
    async experimentData(_, args, context) {
      return context.data.getExperimentData(args);
    },
    async experimentsWithData(_, args, context) {
      return context.experiment.getAllExperimentsWithData();
    },
  },
  Mutation: {
    async addUpdateData(_, args, context) {
      pubsub.publish(DATAS_UPDATED, { experimentDataUpdated: true });
      return context.data.addUpdateData(args, context);
    },
  },
  Subscription: {
    experimentDataUpdated: {
      subscribe: () => pubsub.asyncIterator(DATAS_UPDATED),
    },
  },
};

const dataResolvers = merge(resolvers, typeResolver);

module.exports = {
  dataTypeDefs,
  dataResolvers,
};
