class Device {
  constructor({ connector }) {
    this.connector = connector;
  }

  async addUpdateDevice(args) {
    const {
      key,
      uid,
      experimentId,
      id,
      name,
      deviceTypeKey,
      properties,
    } = args;

    const newDevice = {
      custom: {
        id,
        type: 'device',
        data: {
          key,
          name,
          deviceTypeKey,
          properties,
        },
      },
    };

    const response = await this.connector.addUpdateTask(
      newDevice,
      uid,
      experimentId,
    );

    return response.data;
  }

  async getDevices(args) {
    const { experimentId, deviceTypeKey } = args;
    let result = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom
        && task.custom.data
        && task.custom.data.deviceTypeKey === deviceTypeKey,
    );

    if (typeof result === 'string') {
      result = JSON.parse(result);
    }

    if (result === null || result === undefined || !Array.isArray(result)) {
      return [
        { error: 'Ooops. Something went wrong and we coudnt fetch the data' },
      ];
    }

    return result;
  }
}

module.exports = Device;
