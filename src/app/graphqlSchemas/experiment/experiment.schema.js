const _ = require('lodash')
const experimentTypeDefs = require('./experiment.typedefs');
const { pubsub, EXPERIMENTS_UPDATED } = require('../../subscriptions');

const typeResolver = {
  Experiment:{
    id: _.property('_id'),
    name: _.property('title')
  }
}
const resolvers = {
  Query: {
    async experiments(_, args, context){
      return await context.experiment.getAllExperiments();
    }
  },
  Mutation: {
    async addUpdateExperiment(_, args, context) {
      pubsub.publish(EXPERIMENTS_UPDATED, { experimentsUpdated: true });
      const result = await context.experiment.addUpdateExperiment(args, context);
      await context.data.addUpdateData(args, result);
      return result;
    },
    async buildExperimentData(_, args, context) {
      return await context.experiment.buildExperimentData(args);
    }
  },
}
const experimentResolvers = _.merge(resolvers, typeResolver);

module.exports = {
  experimentTypeDefs: experimentTypeDefs,
  experimentResolvers: experimentResolvers
}