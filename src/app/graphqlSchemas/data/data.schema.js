const _ = require('lodash')
const { pubsub, DATAS_UPDATED } = require('../../subscriptions');
const dataTypeDefs = require('./data.typedefs');

const typeResolver = {
  Data: {
    id: _.property('custom.id'),
    name: _.property('title'),
    type: _.property('custom.data.type'),
    begin: _.property('custom.data.begin'),
    end: _.property('custom.data.end'),
  },
  KeyVal: {
    key: _.property('key'),
    val: _.property('val')
  }
}
const resolvers = {
  Query: {
    async experimentData(_, args, context) {
      return await context.data.getExperimentData(args);
    }
  },
  Mutation: {
    async addUpdateData(_, args, context) {
      pubsub.publish(DATAS_UPDATED, { experimentDataUpdated: true });
      return await context.data.addUpdateData(args, context)

    }
  },
  Subscription: {
    experimentDataUpdated: {
      subscribe: () => pubsub.asyncIterator(DATAS_UPDATED)
    }
  }
}

const dataResolvers = _.merge(resolvers, typeResolver);

module.exports = {
  dataTypeDefs: dataTypeDefs,
  dataResolvers: dataResolvers
}