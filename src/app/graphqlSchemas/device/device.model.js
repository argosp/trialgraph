class Device {
  constructor({ connector }) {
    this.connector = connector;
  }

  async addUpdateDevice(args, context) {
    const {
      key,
      uid,
      experimentId,
      id,
      name,
      deviceTypeKey,
      state,
      properties,
    } = args;

    const newDevice = {
      custom: {
        id: key,
        type: 'device',
        data: {
          id,
          key,
          name,
          deviceTypeKey,
          state,
          properties,
        },
      },
    };

    const device = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom
        && task.custom.data
        && task.custom.data.key === key,
    );

    if (device[0]) {
      if (state === 'Deleted' && device[0].custom.data.state !== 'Deleted') {
        context.deviceType.setDevices('remove', deviceTypeKey, experimentId, uid);
      }
    } else {
      context.deviceType.setDevices('add', deviceTypeKey, experimentId, uid);
    }

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
        && task.custom.data.deviceTypeKey === deviceTypeKey
        && task.custom.data.state !== 'Deleted',
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
