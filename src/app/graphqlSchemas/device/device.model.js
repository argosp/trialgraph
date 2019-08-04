const config = require('../../../config');

class Device {
    constructor({ connector }) {
        this.connector = connector
    }
    async getAllDevices() {
        const devices = await this.connector.getTasks(task => task.custom && task.custom.type == 'device');
        return devices != null ? devices : [];
    }

    async getDevices(args) {
        const { experimentId, entityType = 'device' } = args;
        const result = await this.connector.getTasksFromExperiment(experimentId, (task => task.custom && task.custom.type === entityType));
        if(typeof result === 'string')
            result = JSON.parse(result);
        if (result === null || result === undefined || !Array.isArray(result)) {
            return [{ error: 'Ooops. Something went wrong and we coudnt fetch the data' }]
        }

        return result;
    }

    async addUpdateDevice(args, context) {
        const { uid, experimentId, id, name, type, properties, number, entityType, notes } = args
        const newDevice = {
            title: name,
            project: experimentId,
            description: `${entityType} ${name}, of type ${type}`,
            custom: {
                id: id,
                type: entityType,
                data: {
                    entityType: entityType.toUpperCase(),
                    type: type,
                    number: number,
                    properties: properties,
                    notes: notes
                }
            },
        };
        const response = await this.connector.addUpdateTask(newDevice, uid, experimentId);
        const data = JSON.parse(response.body);
        return data;
    }
}

module.exports = Device;
