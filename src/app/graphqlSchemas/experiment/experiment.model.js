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
}

module.exports = Experiment;
