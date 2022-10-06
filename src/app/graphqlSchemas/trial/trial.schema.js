const { property, merge, unionBy } = require('lodash');
const { pubsub, TRIALS_UPDATED } = require('../../subscriptions');
const trialTypeDefs = require('./trial.typedefs');
const {
  UserInputError
} = require('apollo-server-express');

const typeResolver = {
  Trial: {
    name: property('custom.data.name'),
    key: property('custom.data.key'),
    created: property('created'),
    trialSetKey: property('custom.data.trialSetKey'),
    numberOfEntities: property('custom.data.numberOfEntities'),
    status: property('custom.data.status'),
    cloneFrom: property('custom.data.cloneFrom'),
    cloneFromTrailKey: property('custom.data.cloneFromTrailKey'),
    state: property('custom.data.state'),
    properties: property('custom.data.properties'),
    entities: property('custom.data.entities'),
    fullDetailedEntities: async (parent, args, context) => {
      const entities = await context.entity.getEntities({
        experimentId: parent.project._id,
        trialKey: parent.custom.data.key
      }, context);
      return entities.map(e => {
        const entityType = parent.entityTypesArray.find(q => q.custom.data.key == e.custom.data.entitiesTypeKey)
        return { ...e, entityType }
      })
    },
    deployedEntities: property('custom.data.deployedEntities'),
  },
  FullDetailedEntity: {
    name: property('custom.data.name'),
    key: property('custom.data.key'),
    entitiesTypeKey: property('custom.data.entitiesTypeKey'),
    entitiesTypeName: (parent) => {
      return parent.entityType.custom.data.name
    },
    properties: (parent) => {
      return parent.entityType.custom.data.properties.map(p => {
        const props = parent.custom.data.properties.find(q => q.key === p.key);
        return { ...props, ...p }
      })
    },
  }
};
const resolvers = {
  Query: {
    async trial(_, args, context) {
      return await Promise.all([
        context.trial.getTrial(args.experimentId, args.trialKey),
        context.entitiesType.getEntitiesTypes(args)
      ]).then(([trial, entityTypes]) => {
        return { ...trial, entityTypesArray: entityTypes }
      });
    },
    async trials(_, args, context) {
      return context.trial.getTrials(args, context);
      // return await Promise.all([
      //   context.trial.getTrials(args, context),
      //   context.entitiesType.getEntitiesTypes(args)
      // ]).then(([trials, entityTypes]) => {
      //   return trials.map(q => ({ ...q, entityTypesArray: entityTypes }))
      // });
    },
  },
  Mutation: {
    async addUpdateTrial(_, args, context) {
      pubsub.publish(TRIALS_UPDATED, { trialsUpdated: true });
      return context.trial.addUpdateTrial(args, context);
    },
    async updateTrialContainsEntities(_, args, context) {
      pubsub.publish(TRIALS_UPDATED, { trialsUpdated: true });
      const res = await context.trial.updateTrialContainsEntities(args, context);
      if (!res.error) return res;
      throw new UserInputError("Error", res);
    }
  },
  Subscription: {
    trialsUpdated: {
      subscribe: () => pubsub.asyncIterator(TRIALS_UPDATED),
    },
  },
};
const trialResolvers = merge(typeResolver, resolvers);

module.exports = {
  trialTypeDefs,
  trialResolvers,
};
