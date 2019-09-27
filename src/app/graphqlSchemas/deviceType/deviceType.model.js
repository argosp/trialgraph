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

  async addUpdateDeviceTypes(args) {
    const {
      uid,
      experimentId,
      id,
      name,
      properties,
      numberOfDevices,
      numberOfFields,
    } = args;

    const newDeviceType = {
      custom: {
        id,
        type: 'deviceType',
        data: {
          numberOfDevices,
          numberOfFields,
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

    return JSON.parse(response.body);
  }
}

module.exports = DeviceType;
