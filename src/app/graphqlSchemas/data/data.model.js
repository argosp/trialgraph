const config = require('../../../config');

class Data {
    constructor({ connector }) {
        this.connector = connector
    }

    async getExperimentData(args) {
        const { experimentId } = args;
        const result = await this.connector.getTasksFromExperiment(experimentId, (task => task.custom && task.custom.type === 'data'));
        if(typeof result === 'string')
            result = JSON.parse(result);
        if (result === null || result === undefined || !Array.isArray(result)) {
            return [{ error: 'Ooops. Something went wrong and we coudnt fetch the data' }]
        }

        return result[0];
    }

    async addUpdateData(args, experiment) {
        const { uid, id, name, begin, end } = args;
        const experimentId = args.experimentId || experiment._id;
        const newData = {
            project: experimentId,
            title: name,
            description: `${name}. starts in ${begin}, ends in ${end}`,
            custom: {
                id: `${experimentId}_data`,
                type: "data",
                data: {
                    entityType: "DATA",
                    begin,
                    end
                }
            },
        };
        const response = await this.connector.addUpdateTask(newData, uid, experimentId);
        const data = JSON.parse(response.body);
        return data;
    }
}

module.exports = Data;
