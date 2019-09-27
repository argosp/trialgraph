const { property, merge } = require('lodash');
const { pubsub, TRIALSETS_UPDATED } = require('../../subscriptions');
const trialSetTypeDefs = require('./trialSet.typedefs');

const typeResolver = {
  TrialSet: {
    id: property('custom.id'),
    name: property('custom.data.name'),
    description: property('custom.data.description'),
    properties: property('custom.data.properties'),
    numberOfTrials: property('custom.data.numberOfTrials'),
  },
};

const resolvers = {
  Query: {
    async trialSets(_, args, context) {
      return context.trialSet.getTrialSets(args);
    },
  },
  Mutation: {
    async addUpdateTrialSet(_, args, context) {
      pubsub.publish(TRIALSETS_UPDATED, { trialSetsUpdated: true });
      return context.trialSet.addUpdateTrialSet(args, context);
    },
  },
  Subscription: {
    trialSetsUpdated: {
      subscribe: () => pubsub.asyncIterator(TRIALSETS_UPDATED),
    },
  },
};

const trialSetResolvers = merge(resolvers, typeResolver);

module.exports = {
  trialSetTypeDefs,
  trialSetResolvers,
};
