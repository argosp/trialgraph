const config = require('../../../config');

class Experiment {
    constructor({ connector }) {
        this.connector = connector
    }
    async getAllExperiments() {
        let projects = await this.connector.getAllProjects();
        projects = projects.filter(project => project._id !== config.devicesProjectId);
        return projects;
    }

    async addUpdateExperiment(args) {
        const { uid, id, name, begin, end } = args
        const newExperiment = {
            title: name,
            description: `${name}. starts in ${begin}, ends in ${end}`,
            custom: {
                id: id,
                type: "experiment",
                data: {
                    begin,
                    end
                }
            },
        };
        const response = await this.connector.addUpdateProject(newExperiment, uid);
        const data = JSON.parse(response.body);
        return data;
    }

    async addUpdateData(args, experiment) {
        const { uid, id, name, begin, end } = args;
        const experimentId = experiment._id;
        const newData = {
            project: experimentId,
            title: `${name}_data`,
            description: `${name}. starts in ${begin}, ends in ${end}`,
            custom: {
                id: id,
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

module.exports = Experiment;
