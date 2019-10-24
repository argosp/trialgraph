const { property, merge } = require('lodash');
const { pubsub, TRIALS_UPDATED } = require('../../subscriptions');
const trialTypeDefs = require('./trial.typedefs');

const typeResolver = {
  Trial: {
    id: property('custom.id'),
    name: property('custom.data.name'),
    key: property('custom.data.key'),
    created: property('created'),
    trialSetKey: property('custom.data.trialSetKey'),
    numberOfDevices: property('custom.data.numberOfDevices'),
    status: property('status'),
    properties: property('custom.data.properties'),
  },
};
const resolvers = {
  Query: {
    async trials(_, args, context) {
      return context.trial.getTrials(args, context);
    },
  },
  Mutation: {
    async addUpdateTrial(_, args, context) {
      pubsub.publish(TRIALS_UPDATED, { trialsUpdated: true });
      return context.trial.addUpdateTrial(args, context);
    },
  },
  Subscription: {
    trialsUpdated: {
      subscribe: () => pubsub.asyncIterator(TRIALS_UPDATED),
    },
  },
};
const trialResolvers = merge(typeResolver, resolvers);

module.exports = {
  trialTypeDefs,
  trialResolvers,
};
