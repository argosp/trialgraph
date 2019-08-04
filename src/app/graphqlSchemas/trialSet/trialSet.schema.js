const _ = require('lodash')
const { pubsub, TRIALSETS_UPDATED } = require('../../subscriptions');
const trialSetTypeDefs = require('./trialSet.typedefs');

const typeResolver = {
  TrialSet: {
    id: _.property('custom.id'),
    name: _.property('custom.data.name'),
    notes: _.property('custom.data.notes'),
    type: _.property('custom.data.type'),
    properties: _.property('custom.data.properties')
  }
}
const resolvers = {
  Query: {
    async trialSets(_, args, context) {
      return await context.trialSet.getTrialSets(args);
    }
  },
  Mutation: {
    async addUpdateTrialSet(_, args, context) {
      pubsub.publish(TRIALSETS_UPDATED, { trialSetsUpdated: true });
      return await context.trialSet.addUpdateTrialSet(args, context)

    }
  },
  Subscription: {
    trialSetsUpdated: {
      subscribe: () => pubsub.asyncIterator(TRIALSETS_UPDATED)
    }
  }
}

const trialSetResolvers = _.merge(resolvers, typeResolver);

module.exports = {
  trialSetTypeDefs: trialSetTypeDefs,
  trialSetResolvers: trialSetResolvers
}