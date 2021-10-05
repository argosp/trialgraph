const { property, merge } = require('lodash');
const { pubsub, TRIALS_UPDATED } = require('../../subscriptions');
const trialTypeDefs = require('./trial.typedefs');
const {
  UserInputError
} = require('apollo-server-express');

const typeResolver = {
  Trial: {
    name: property('custom.data.name'),
    key: property('custom.data.key'),
    created: property('created'),
    trialSetKey: property('custom.data.trialSetKey'),
    numberOfEntities: property('custom.data.numberOfEntities'),
    status: property('custom.data.status'),
    cloneFrom:property('custom.data.cloneFrom'),
    cloneFromTrailKey:property('custom.data.cloneFromTrailKey'),
    state: property('custom.data.state'),
    properties: property('custom.data.properties'),
    entities: property('custom.data.entities'),
    deployedEntities: property('custom.data.deployedEntities'),
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
    async updateTrialContainsEntities(_, args, context) {
      pubsub.publish(TRIALS_UPDATED, { trialsUpdated: true });
      const res = await context.trial.updateTrialContainsEntities(args, context);
        if (!res.error) return res;
        throw new UserInputError("Error", res);
    }
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
