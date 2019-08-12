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
        const { uid, id, name, begin, end } = args;
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

    async buildExperimentData(args, context) {
        const { uid, id } = args;
        const tasks = await this.connector.getTasksFromExperiment(id.split('_')[0], task => task.custom && (task.custom.type === 'trial') && task.custom.id === id);
        const devices = tasks[0].custom.data.devices ? tasks[0].custom.data.devices.map(d => {return{
            "Name": d.name,
            "Type": d.type,
            "attributes": d.properties ? d.properties.reduce((obj, item) => Object.assign(obj, { [item.key]: item.val }), {}): {},
            "contains": [],
            "entityType": "DEVICE"
        }}) : [];
        const assets = tasks[0].custom.data.assets ? tasks[0].custom.data.assets.map(d => {return{
            "Name": d.name,
            "Type": d.type,
            "attributes": d.properties ? d.properties.reduce((obj, item) => Object.assign(obj, { [item.key]: item.val }), {}) : {},
            "contains": [],
            "entityType": "ASSET"
        }}) : [];
        const res = {Entities: devices.concat(assets), properties: tasks[0].custom.data.properties ? tasks[0].custom.data.properties.reduce((obj, item) => Object.assign(obj, { [item.key]: item.val }), {}) : {}};
        return true;
    }

}

module.exports = Experiment;
