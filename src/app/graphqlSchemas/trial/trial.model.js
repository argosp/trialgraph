class Trial {

    constructor({ connector }) {
        this.connector = connector;
    }

    async addUpdateTrial(args) {
        const { uid, experimentId, id, name, begin, end, device, trialSet, properties } = args
        const newTrial = {
            project: experimentId,
            title: name,
            description: `${name}. starts in ${begin}, ends in ${end}`,
            custom: {
                id: id,
                type: "trial",
                data: {
                    begin,
                    end,
                    device,
                    trialSet,
                    properties
                }
            },
        };
        const response = await this.connector.addUpdateTask(newTrial, uid, experimentId);
        const data = JSON.parse(response.body)
        return data;
    }

    async getTrials(args) {
        const { experimentId } = args;
        const result = await this.connector.getTasksFromExperiment(experimentId);
        if(typeof result === 'string')
            result = JSON.parse(result);
        if (result === null || result === undefined || !Array.isArray(result)) {
            return [{ error: 'Ooops. Something went wrong and we coudnt fetch the data' }]
        }

        const trials = result.filter(task => task.custom && task.custom.type === 'trial');

        for (let trial of trials) {
            trial.device = result.find(task => task.custom && task.custom.type === 'device' &&
                trial.custom.data && trial.custom.data.device === task.custom.id);
        }

        for (let trial of trials) {
            trial.trialSet = result.find(task => task.custom && task.custom.type === 'trialSet' &&
                trial.custom.data && trial.custom.data.trialSet === task.custom.id);
        }

        return trials;
    }
}

module.exports = Trial;