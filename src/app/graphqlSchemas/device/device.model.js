const config = require('../../../config');

class Device {
    constructor({ connector }) {
        this.connector = connector
    }
    async getAllDevices() {
        const devices = await this.connector.getTasks(task => task.custom && task.custom.type == 'device');
        return devices != null ? devices : [];
    }

    async addUpdateDevice(args, context) {
        const { uid, experimentId, id, name, type, properties } = args
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
