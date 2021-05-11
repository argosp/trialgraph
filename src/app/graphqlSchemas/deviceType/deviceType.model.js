const { pubsub, DEVICE_TYPES_UPDATED } = require('../../subscriptions');
const Utils = require('../services/utils');

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
      task => task.custom && task.custom.type === 'deviceType' && task.custom.data.state !== 'Deleted',
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

  async setDevices(key, experimentId, uid) {
    let result = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom &&
        task.custom.data.state !== 'Deleted' &&
        (task.custom.type === 'deviceType' && task.custom.data.key === key ||
        task.custom.type === 'device' && task.custom.data.deviceTypeKey === key),
    );
    let deviceType = result.find(r => r.custom.type === 'deviceType' && r.custom.data.key === key);
    deviceType.custom.data.numberOfDevices = result.length - 1;

    await this.connector.addUpdateTask(
      deviceType,
      uid,
      experimentId,
    );
    pubsub.publish(DEVICE_TYPES_UPDATED, { deviceTypesUpdated: true });
  }

  async addUpdateDeviceType(args) {
    const {
      uid,
      experimentId,
      key,
      name,
      properties,
      numberOfDevices,
      state,
      action,
    } = args;

    let newDeviceType = {
      custom: {
        type: 'deviceType',
        data: {
          key,
        },
      },
    };

    if (action !== 'update' || args.hasOwnProperty('name')) newDeviceType.custom.data.name = name;
    if (action !== 'update' || args.hasOwnProperty('properties')) newDeviceType.custom.data.properties = properties;
    if (action !== 'update' || args.hasOwnProperty('numberOfDevices')) newDeviceType.custom.data.numberOfDevices = numberOfDevices;
    if (action !== 'update' || args.hasOwnProperty('state')) newDeviceType.custom.data.state = state;
    
    const deviceType = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom
        && task.custom.data
        && task.custom.data.key === key,
    );

    if (deviceType[0]) {
      if (action === 'update') {
        newDeviceType.custom = Utils.mergeDeep(deviceType[0].custom, newDeviceType.custom);
      }
    } else {
      if (action === 'update') {
        return [
          { error: 'Ooops. deviceType not found.' },
        ];
      }
    }

    const response = await this.connector.addUpdateTask(
      newDeviceType,
      uid,
      experimentId,
    );

    return response.data;
  }
}

module.exports = DeviceType;
