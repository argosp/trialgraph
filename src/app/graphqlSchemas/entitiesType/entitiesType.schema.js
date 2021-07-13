const { property, merge } = require('lodash');
const { pubsub, ENTITIES_TYPES_UPDATED } = require('../../subscriptions');
const entitiesTypeTypeDefs = require('./entitiesType.typedefs');

const typeResolver = {
  EntitiesType: {
    key: property('custom.data.key'),
    name: property('custom.data.name'),
    properties: property('custom.data.properties'),
    numberOfEntities: property('custom.data.numberOfEntities'),
    state: property('custom.data.state'),
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
    async entitiesTypes(_, args, context) {
      return context.entitiesType.getEntitiesTypes(args);
    },
  },
  Mutation: {
    async addUpdateEntitiesType(_, args, context) {
      pubsub.publish(ENTITIES_TYPES_UPDATED, { entitiesTypesUpdated: true });
      return context.entitiesType.addUpdateEntitiesType(args, context);
    },
  },
  Subscription: {
    entitiesTypesUpdated: {
      subscribe: () => pubsub.asyncIterator(ENTITIES_TYPES_UPDATED),
    },
  },
};

const entitiesTypeResolvers = merge(resolvers, typeResolver);

module.exports = {
  entitiesTypeTypeDefs,
  entitiesTypeResolvers,
};
