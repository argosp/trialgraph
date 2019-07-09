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
        const { experimentId } = args;
        const result = await this.connector.getTasksFromExperiment(experimentId, (task => task.custom && task.custom.type === 'device'));
        if(typeof result === 'string')
            result = JSON.parse(result);
        if (result === null || result === undefined || !Array.isArray(result)) {
            return [{ error: 'Ooops. Something went wrong and we coudnt fetch the data' }]
        }

        return result;
    }

    async addUpdateDevice(args, context) {
        const { uid, experimentId, id, name, type, properties, number } = args
        const newDevice = {
            title: name,
            project: experimentId,
            description: `device ${name}, of type ${type}`,
            custom: {
                id: id,
                type: "device",
                data: {
                    entityType: "DEVICE",
                    type: type,
                    number: number,
                    properties: properties
                }
            },
        };
        const response = await this.connector.addUpdateTask(newDevice, uid, experimentId);
        const data = JSON.parse(response.body)
        return data;
    }
}

module.exports = Device;
