const { property, merge } = require('lodash');
const { pubsub, DEVICE_TYPES_UPDATED } = require('../../subscriptions');
const deviceTypeTypeDefs = require('./deviceType.typedefs');

const typeResolver = {
  DeviceType: {
    id: property('custom.id'),
    name: property('custom.data.name'),
    properties: property('custom.data.properties'),
    numberOfDevices: property('custom.data.numberOfDevices'),
    numberOfFields: property('custom.data.numberOfFields'),
  },
  KeyVal: {
    key: property('key'),
    val: property('val'),
    type: property('type'),
  },
};
const resolvers = {
  Query: {
    async deviceTypes(_, args, context) {
      return context.deviceType.getDeviceTypes(args);
    },
  },
  Mutation: {
    async addUpdateDeviceTypes(_, args, context) {
      pubsub.publish(DEVICE_TYPES_UPDATED, { deviceTypesUpdated: true });
      return context.deviceType.addUpdateDeviceTypes(args, context);
    },
  },
  Subscription: {
    deviceTypesUpdated: {
      subscribe: () => pubsub.asyncIterator(DEVICE_TYPES_UPDATED),
    },
  },
};

const deviceTypeResolvers = merge(resolvers, typeResolver);

module.exports = {
  deviceTypeTypeDefs,
  deviceTypeResolvers,
};
