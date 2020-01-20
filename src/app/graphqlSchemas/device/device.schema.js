const { property, merge } = require('lodash');
const { pubsub, DEVICES_UPDATED } = require('../../subscriptions');
const deviceTypeDefs = require('./device.typedefs');

const typeResolver = {
  Device: {
    id: property('custom.data.id'),
    name: property('custom.data.name'),
    key: property('custom.data.key'),
    deviceTypeKey: property('custom.data.deviceTypeKey'),
    properties: property('custom.data.properties'),
  },
/*  DeviceKeyVal: {
    val: property('val'),
    key: property('key'),
    type: property('type'),
    id: property('id'),
    label: property('label'),
    description: property('description'),
    prefix: property('prefix'),
    suffix: property('suffix'),
    required: property('required'),
    template: property('template'),
    multipleValues: property('multipleValues'),
    trialField: property('trialField'),
  }, */
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
