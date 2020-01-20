class DeviceType {
  constructor({ connector }) {
    this.connector = connector;
  }

  /*  async getAllDeviceTypes() {
    const deviceTypes = await this.connector.getTasks(
      task => task.custom && task.custom.type === 'deviceType',
    );
    return deviceTypes != null ? deviceTypes : [];
  } */

  async getDeviceTypes(args) {
    const { experimentId } = args;
    let result = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom && task.custom.type === 'deviceType',
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

  async addUpdateDeviceType(args) {
    const {
      uid,
      experimentId,
      key,
      id,
      name,
      properties,
      numberOfDevices,
    } = args;

    const newDeviceType = {
      custom: {
        id: key,
        type: 'deviceType',
        data: {
          id,
          key,
          numberOfDevices,
          properties,
          name,
        },
      },
    };

    const response = await this.connector.addUpdateTask(
      newDeviceType,
      uid,
      experimentId,
    );

    return response.data;
  }
}

module.exports = DeviceType;
