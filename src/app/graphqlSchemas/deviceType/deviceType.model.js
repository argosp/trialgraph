class DeviceType {
  constructor({ connector }) {
    this.connector = connector;
  }

  async getAllDeviceTypes() {
    const deviceTypes = await this.connector.getTasks(
      task => task.custom && task.custom.type === 'deviceType',
    );
    return deviceTypes != null ? deviceTypes : [];
  }

  async getDeviceTypes(args) {
    const { experimentId, entityType = 'deviceType' } = args;
    let result = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom && task.custom.type === entityType,
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
      type,
      properties,
      numberOfDevices,
      numberOfFields,
      entityType,
      notes,
    } = args;
    const newDeviceType = {
      title: name,
      project: experimentId,
      description: `${entityType} ${name}, of type ${type}`,
      custom: {
        id,
        type: entityType,
        data: {
          entityType: entityType.toUpperCase(),
          type,
          numberOfDevices,
          numberOfFields,
          properties,
          notes,
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
