const _ = require('lodash')
const experimentTypeDefs = require('./experiment.typedefs');

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
  }
}
const experimentResolvers = _.merge(resolvers, typeResolver);

module.exports = {
  experimentTypeDefs: experimentTypeDefs,
  experimentResolvers: experimentResolvers
}