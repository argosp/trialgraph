const _ = require('lodash')
const { pubsub, ASSETS_UPDATED } = require('../../subscriptions');
const assetTypeDefs = require('./asset.typedefs');

const typeResolver = {
  Asset: {
    id: _.property('custom.id'),
    name: _.property('title'),
    notes: _.property('custom.data.notes'),
    type: _.property('custom.data.type'),
    properties: _.property('custom.data.properties'),
    number: _.property('custom.data.number')
  }
}
const resolvers = {
  Query: {
    async assets(_, args, context) {
      return await context.asset.getAssets(args);
    }
  },
  Mutation: {
    async addUpdateAsset(_, args, context) {
      pubsub.publish(ASSETS_UPDATED, { assetsUpdated: true });
      return await context.asset.addUpdateAsset(args, context)

    }
  },
  Subscription: {
    assetsUpdated: {
      subscribe: () => pubsub.asyncIterator(ASSETS_UPDATED)
    }
  }
}

const assetResolvers = _.merge(resolvers, typeResolver);

module.exports = {
  assetTypeDefs: assetTypeDefs,
  assetResolvers: assetResolvers
}