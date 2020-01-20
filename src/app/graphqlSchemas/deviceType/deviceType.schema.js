const { property, merge } = require('lodash');
const { pubsub, DEVICE_TYPES_UPDATED } = require('../../subscriptions');
const deviceTypeTypeDefs = require('./deviceType.typedefs');

const typeResolver = {
  DeviceType: {
    id: property('custom.data.id'),
    key: property('custom.data.key'),
    name: property('custom.data.name'),
    properties: property('custom.data.properties'),
    numberOfDevices: property('custom.data.numberOfDevices'),
  },
/*  KeyVal: {
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
    async deviceTypes(_, args, context) {
      return context.deviceType.getDeviceTypes(args);
    },
  },
  Mutation: {
    async addUpdateDeviceType(_, args, context) {
      pubsub.publish(DEVICE_TYPES_UPDATED, { deviceTypesUpdated: true });
      return context.deviceType.addUpdateDeviceType(args, context);
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
