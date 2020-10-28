const { property, merge } = require('lodash');
const { pubsub, DATAS_UPDATED } = require('../../subscriptions');
const dataTypeDefs = require('./data.typedefs');

const typeResolver = {
  ExperimentData: {
    id: property('id'),
    key: property('custom.data.key'),
    name: property('custom.data.name'),
    description: property('custom.data.description'),
    begin: property('custom.data.begin'),
    end: property('custom.data.end'),
    location: property('custom.data.location'),
    numberOfTrials: property('custom.data.numberOfTrials'),
    project: property('project'),
    state: property('custom.data.state'),
    status: property('custom.data.status'),
    maps: property('custom.data.maps'),
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
    async addUpdateExperimentData(_, args, context) {
      pubsub.publish(DATAS_UPDATED, { experimentDataUpdated: true });
      return context.data.addUpdateExperimentData(args, context);
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
