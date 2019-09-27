class Device {
  constructor({ connector }) {
    this.connector = connector;
  }

  async addUpdateDevice(args) {
    const {
      uid,
      experimentId,
      id,
      name,
      height,
      sku,
      brand,
      deviceType,
    } = args;

    const newDevice = {
      custom: {
        id,
        type: 'device',
        data: {
          name,
          height,
          sku,
          brand,
          deviceType,
        },
      },
    };

    const response = await this.connector.addUpdateTask(
      newDevice,
      uid,
      experimentId,
    );

    return JSON.parse(response.body);
  }

  async getDevices(args) {
    const { experimentId, deviceTypeId } = args;
    let result = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom
        && task.custom.data
        && task.custom.data.deviceType === deviceTypeId,
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
