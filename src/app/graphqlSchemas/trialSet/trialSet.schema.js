const { property, merge } = require('lodash');
const { pubsub, TRIALSETS_UPDATED } = require('../../subscriptions');
const trialSetTypeDefs = require('./trialSet.typedefs');

const typeResolver = {
  TrialSet: {
    key: property('custom.data.key'),
    name: property('custom.data.name'),
    description: property('custom.data.description'),
    properties: property('custom.data.properties'),
    numberOfTrials: property('custom.data.numberOfTrials'),
    state: property('custom.data.state'),
  },
};

const resolvers = {
  Query: {
    async trialSets(_, args, context) {
      return context.trialSet.getTrialSets(args, context);
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
