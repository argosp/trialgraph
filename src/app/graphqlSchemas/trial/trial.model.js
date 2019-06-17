class Trial {

    constructor({ connector }) {
        this.connector = connector;
    }

    async addUpdateTrial(args) {
        const { uid, experimentId, id, name, begin, end, device } = args
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
                    device
                }
            },
        };
        const response = await this.connector.addUpdateTask(newTrial, uid, experimentId);
        const data = JSON.parse(response.body)
        return data;
    }

    async getTrials(args) {
        const { experimentId } = args;
        const result = await this.connector.getTasksFromExperiment(experimentId, (task => task.custom && task.custom.type === 'trial'));
        if(typeof result === 'string')
            result = JSON.parse(result);
        if (result === null || result === undefined || !Array.isArray(result)) {
            return [{ error: 'Ooops. Something went wrong and we coudnt fetch the data' }]
        }

        let devices;
        for (let trial of result) {
            devices = await this.connector.getTasks(task => task.custom && task.custom.type === 'device' &&
                trial.custom.data && trial.custom.data.device === task.custom.id);
            trial.device = devices[0];
        }

        return result;
    }
}

module.exports = Trial;