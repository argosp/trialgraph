const Utils = require('../services/utils');

class Device {
  constructor({ connector }) {
    this.connector = connector;
  }

  async addUpdateEntity(args, context) {
    const {
      key,
      uid,
      experimentId,
      name,
      deviceTypeKey,
      state,
      properties,
      action,
    } = args;

    let newDevice = {
      custom: {
        id: key,
        type: 'device',
        data: {
          key,
          deviceTypeKey,
        },
      },
    };

    if (action !== 'update' || args.hasOwnProperty('name')) newDevice.custom.data.name = name;
    if (action !== 'update' || args.hasOwnProperty('state')) newDevice.custom.data.state = state;
    if (action !== 'update' || args.hasOwnProperty('properties')) newDevice.custom.data.properties = properties;

    let updateDeviceType = false;

    const device = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom
        && task.custom.data
        && task.custom.data.key === key,
    );

    if (device[0]) {
      if (action === 'update') {
        newDevice.custom = Utils.mergeDeep(device[0].custom, newDevice.custom);
      }
      if (state === 'Deleted' && device[0].custom.data.state !== 'Deleted') {
        updateDeviceType = true;
        this.removeEntities(args, context);
      }
    } else {
      if (action === 'update') {
        return [
          { error: 'Ooops. Trial not found.' },
        ];
      }
      updateDeviceType = true;
    }

    const response = await this.connector.addUpdateTask(
      newDevice,
      uid,
      experimentId,
    );

    if (updateDeviceType) context.deviceType.setDevices(deviceTypeKey, experimentId, uid);

    return response.data;
  }

  async removeEntities(args, context) {
    const {
      key,
      experimentId,
    } = args;
    //remove entities of device from trials
    //1. get all trials that have the device in entities
    let result = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom
        && task.custom.data
        && task.custom.type === "trial"
    );

    result.filter(a => a.custom.data.deployedEntities.find(e => e.key === key) || a.custom.data.entities.find(e => e.key === key)).forEach(r => {
      //2. update entities of each trial 
      context.trial.addUpdateTrial({ ...r.custom.data, experimentId, entities: r.custom.data.entities.filter(e => e.key !== key), deployedEntities: r.custom.data.deployedEntities.filter(e => e.key !== key) }, context);
    });
  }


  async getDevices(args) {
    const { experimentId, deviceTypeKey, trialKey } = args;
    let result = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom
        && task.custom.data
        && (!deviceTypeKey || task.custom.data.deviceTypeKey === deviceTypeKey)
        && task.custom.type == "device"
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

    if (trialKey) {
      const trial = await this.connector.getTasksFromExperiment(
        experimentId,
        task => task.custom
          && task.custom.data
          && task.custom.data.key === trialKey
          && task.custom.data.state !== 'Deleted',
      );
      const deviceskeys = trial[0].custom.data[trial[0].custom.data.status === 'design' ? 'entities' : 'deployedEntities'].map(e => e.key);
      return result.filter(r => deviceskeys.indexOf(r.custom.data.key) !== -1);
    }
    return result;
  }
}

module.exports = Device;
