const config = require('../../../config');

class Asset {
    constructor({ connector }) {
        this.connector = connector
    }
    async getAllAssets() {
        const assets = await this.connector.getTasks(task => task.custom && task.custom.type == 'asset');
        return assets != null ? assets : [];
    }

    async getAssets(args) {
        const { experimentId } = args;
        const result = await this.connector.getTasksFromExperiment(experimentId, (task => task.custom && task.custom.type === 'asset'));
        if(typeof result === 'string')
            result = JSON.parse(result);
        if (result === null || result === undefined || !Array.isArray(result)) {
            return [{ error: 'Ooops. Something went wrong and we coudnt fetch the data' }]
        }

        return result;
    }

    async addUpdateAsset(args, context) {
        const { uid, experimentId, id, name, type, number, properties } = args
        const newAsset = {
            title: name,
            project: experimentId,
            description: `asset ${name}, of type ${type}`,
            custom: {
                id: id,
                type: "asset",
                data: {
                    entityType: "ASSET",
                    type: type,
                    number: number,
                    properties: properties
                }
            },
        };
        const response = await this.connector.addUpdateTask(newAsset, uid, experimentId);
        const data = JSON.parse(response.body)
        return data;
    }
}

module.exports = Asset;
