const config = require('../../../config');

class TrialSet {
    constructor({ connector }) {
        this.connector = connector
    }
    async getAllTrialSets() {
        const trialSets = await this.connector.getTasks(task => task.custom && task.custom.type == 'trialSet');
        return trialSets != null ? trialSets : [];
    }

    async getTrialSets(args) {
        const { experimentId } = args;
        const result = await this.connector.getTasksFromExperiment(experimentId, (task => task.custom && task.custom.type === 'trialSet'));
        if(typeof result === 'string')
            result = JSON.parse(result);
        if (result === null || result === undefined || !Array.isArray(result)) {
            return [{ error: 'Ooops. Something went wrong and we coudnt fetch the data' }]
        }

        return result;
    }

    async addUpdateTrialSet(args, context) {
        const { uid, experimentId, id, begin, end, properties, type } = args;
        const newTrialSet = {
            title: id,
            project: experimentId,
            description: `trialSet ${id}, of type ${type}`,
            custom: {
                id: id,
                type: "trialSet",
                data: {
                    entityType: "TRIALSET",
                    type: type,
                    begin: begin,
                    end: end,
                    properties: properties
                }
            },
        };
        const response = await this.connector.addUpdateTask(newTrialSet, uid, experimentId);
        const data = JSON.parse(response.body)
        return data;
    }
}

module.exports = TrialSet;
