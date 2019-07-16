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

}

module.exports = Experiment;
