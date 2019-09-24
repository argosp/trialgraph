const { property, merge } = require('lodash');
const { pubsub, DEVICES_UPDATED } = require('../../subscriptions');
const deviceTypeDefs = require('./device.typedefs');

const typeResolver = {
  Device: {
    id: property('custom.id'),
    name: property('title'),
    height: property('custom.data.height'),
    sku: property('custom.data.sku'),
    brand: property('custom.data.brand'),
    deviceType: property('deviceType'),
  },
};

const resolvers = {
  Query: {
    async devices(_, args, context) {
      return context.device.getDevices(args, context);
    },
  },
  Mutation: {
    async addUpdateDevice(_, args, context) {
      pubsub.publish(DEVICES_UPDATED, { devicesUpdated: true });
      return context.device.addUpdateDevice(args, context);
    },
  },
  Subscription: {
    devicesUpdated: {
      subscribe: () => pubsub.asyncIterator(DEVICES_UPDATED),
    },
  },
};

const deviceResolvers = merge(typeResolver, resolvers);

module.exports = {
  deviceTypeDefs,
  deviceResolvers,
};
