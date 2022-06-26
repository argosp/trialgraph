const logsTypeDefs = require('./logs.typedefs');
const { property, merge } = require('lodash');

const typeResolver = {
    Log: {
        key: property('custom.data.key'),
        title: property('custom.data.title'),
        comment: property('custom.data.comment'),
        created: property('created'),
        updated: property('updated'),
        creator: property('creator.name')
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
        }
    },
    Mutation: {
        async addUpdateLog(_, args, context) {
            return context.logs.addUpdateLog(args);
        }
    },
};

const logsResolvers = merge(resolvers, typeResolver);

module.exports = {
    logsTypeDefs,
    logsResolvers,
};