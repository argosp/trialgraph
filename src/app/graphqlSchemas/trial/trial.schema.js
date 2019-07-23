const _ = require('lodash')
const { pubsub, TRIALS_UPDATED } = require('../../subscriptions');
const trialTypeDefs = require('./trial.typedefs');
const typeResolver = {
  Trial: {
    id: _.property('custom.id'),
    name: _.property('title'),
    begin: _.property('custom.data.begin'),
    end: _.property('custom.data.end'),
    trialSet: _.property('trialSet'),
    properties: _.property('custom.data.properties'),
    devices: _.property('devices'),
    assets: _.property('assets')
  }
}
const resolvers = {
  Query: {
    async trials(_, args, context) {
      const trials = await context.trial.getTrials(args, context)
      return trials;
    }
  },
  Mutation: {
    async addUpdateTrial(_, args, context) {
      pubsub.publish(TRIALS_UPDATED, { trialsUpdated: true });
      return await context.trial.addUpdateTrial(args, context)

    }
  },
  Subscription: {
    trialsUpdated: {
      subscribe: () => pubsub.asyncIterator(TRIALS_UPDATED)
    }
  }
}
const trialResolvers = _.merge(typeResolver, resolvers);

module.exports = {
  trialTypeDefs: trialTypeDefs,
  trialResolvers: trialResolvers
}