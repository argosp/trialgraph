const logsTypeDefs = require('./logs.typedefs');
const { property, merge } = require('lodash');

const typeResolver = {
    Label: {
        key: property('custom.data.key'),
        name: property('custom.data.name'),
        color: property('custom.data.color') 
    },
    Log: {
        key: property('custom.data.key'),
        title: property('custom.data.title'),
        comment: property('custom.data.comment'),
        created: property('created'),
        updated: property('updated'),
        creator: property('creator.name'),
        labels: async (log, args, context) => {
            return await context.logs.getLabels({ experimentId: log.project._id, keys: log.custom.data.labels })
        },
        allLabels: async (log, args, context) => {
            return await context.logs.getLabels({ experimentId: log.project._id })
        }
    },
};

const resolvers = {
    Query: {
        async log(_, args, context) {
            const logs = await context.logs.getLogs(args);
            return logs.find(q => q.custom.id === args.logId)
        },
        async logs(_, args, context) {
            return context.logs.getLogs(args);
        },
        async labels(_, args, context) {
            return context.logs.getLabels(args);
        }
    },
    Mutation: {
        async addUpdateLog(_, args, context) {
            return context.logs.addUpdateLog(args);
        },
        async addUpdateLabel(_, args, context) {
            return context.logs.addUpdateLabel(args);
        }
    },
};

const logsResolvers = merge(resolvers, typeResolver);

module.exports = {
    logsTypeDefs,
    logsResolvers,
};