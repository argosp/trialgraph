const _ = require('lodash');
const { pubsub, DEVICE_TYPES_UPDATED } = require('../../subscriptions');
const deviceTypeTypeDefs = require('./deviceType.typedefs');

const typeResolver = {
  DeviceType: {
    id: _.property('custom.id'),
    name: _.property('title'),
    notes: _.property('custom.data.notes'),
    type: _.property('custom.data.type'),
    properties: _.property('custom.data.properties'),
    numberOfDevices: _.property('custom.data.numberOfDevices'),
    numberOfFields: _.property('custom.data.numberOfFields'),
  },
  KeyVal: {
    key: _.property('key'),
    val: _.property('val'),
    type: _.property('type'),
  },
};
const resolvers = {
  Query: {
    async deviceTypes(_, args, context) {
      return await context.deviceType.getDeviceTypes(args);
    },
  },
  Mutation: {
    async addUpdateDeviceTypes(_, args, context) {
      pubsub.publish(DEVICE_TYPES_UPDATED, { deviceTypesUpdated: true });
      return await context.deviceType.addUpdateDeviceTypes(args, context);
    },
  },
  Subscription: {
    deviceTypesUpdated: {
      subscribe: () => pubsub.asyncIterator(DEVICE_TYPES_UPDATED),
    },
  },
};

const deviceTypeResolvers = _.merge(resolvers, typeResolver);

module.exports = {
  deviceTypeTypeDefs,
  deviceTypeResolvers,
};
