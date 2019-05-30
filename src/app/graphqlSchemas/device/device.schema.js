const _ = require('lodash')
const { pubsub, DEVICES_UPDATED } = require('../../subscriptions');
const deviceTypeDefs = require('./device.typedefs');

const typeResolver = {
  Device: {
    id: _.property('custom.id'),
    name: _.property('title'),
    type: _.property('custom.data.type'),
    properties: _.property('custom.data.properties')
  },
  KeyVal: {
    key: _.property('key'),
    val: _.property('val')
  }
}
const resolvers = {
  Query: {
    async devices(_, { }, context) {
      return await context.device.getAllDevices();
    }
  },
  Mutation: {
    async addUpdateDevice(_, args, context) {
      pubsub.publish(DEVICES_UPDATED, { devicesUpdated: true });
      return await context.device.addUpdateDevice(args, context)

    }
  },
  Subscription: {
    devicesUpdated: {
      subscribe: () => pubsub.asyncIterator(DEVICES_UPDATED)
    }
  }
}

const deviceResolvers = _.merge(resolvers, typeResolver);

module.exports = {
  deviceTypeDefs: deviceTypeDefs,
  deviceResolvers: deviceResolvers
}