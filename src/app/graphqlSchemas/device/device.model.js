class Device {
  constructor({ connector }) {
    this.connector = connector;
  }
  
  mergeDeep(...objects) {
    const isObject = obj => obj && typeof obj === 'object';

    return objects.reduce((prev, obj) => {
      Object.keys(obj).forEach(key => {
        const pVal = prev[key];
        const oVal = obj[key];
        if (Array.isArray(pVal) && Array.isArray(oVal)) {
            if (pVal[0].key) {
              oVal.forEach(v => {
                let index = pVal.findIndex(p => p.key === v.key)
                if (index !== -1) {
                    pVal[index] = this.mergeDeep(pVal[index], v);
                } else {
                    pVal.push(v);
                }
            })
            prev[key] = pVal;

          } else prev[key] = pVal.concat(...oVal);
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = this.mergeDeep(pVal, oVal);
        } else {
          prev[key] = oVal;
        }
      });

      return prev;
    }, {});
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

    if (action !== 'update' || args.hasOwnProperty('id')) newDevice.custom.data.id = id;
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
        newDevice.custom = this.mergeDeep(device[0].custom, newDevice.custom);
      }
      if (state === 'Deleted' && device[0].custom.data.state !== 'Deleted') {
        updateDeviceType = true;
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

  async getDevices(args) {
    const { experimentId, deviceTypeKey, trialKey } = args;
    let result = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom
        && task.custom.data
        &&(!deviceTypeKey || task.custom.data.deviceTypeKey === deviceTypeKey)
        && task.custom.type =="device"
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
