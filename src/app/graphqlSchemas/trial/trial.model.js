class Trial {
  constructor({ connector }) {
    this.connector = connector;
  }

  mergeDeep(...objects) {
    const isObject = obj => obj && typeof obj === 'object';

    return objects.reduce((prev, obj) => {
      Object.keys(obj).forEach(key => {
        const pVal = prev[key];
        const oVal = obj[key];
        if (Array.isArray(pVal) && pVal.length && Array.isArray(oVal) && oVal.length) {
          if (pVal[0] && pVal[0].key) {
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
        } else if (!Array.isArray(pVal) && isObject(pVal) && isObject(oVal) && !Array.isArray(oVal)) {
          prev[key] = this.mergeDeep(pVal, oVal);
        } else {
          prev[key] = oVal;
        }
      });

      return prev;
    }, {});
  }

  async addUpdateTrial(args, context) {
    console.log(JSON.stringify(args))
    const {
      uid,
      experimentId,
      name,
      key,
      trialSetKey,
      properties,
      entities,
      deployedEntities,
      numberOfDevices,
      state,
      status,
      cloneFrom,
      action,
    } = args;
    let newTrial = {
      custom: {
        type: 'trial',
        data: {
          key,
          trialSetKey,
          cloneFrom
        },
      },
    };

    if (action !== 'update' || args.hasOwnProperty('name')) newTrial.custom.data.name = name;
    if (action !== 'update' || args.hasOwnProperty('numberOfDevices')) newTrial.custom.data.numberOfDevices = numberOfDevices;
    if (action !== 'update' || args.hasOwnProperty('state')) newTrial.custom.data.state = state;
    if (action !== 'update' || args.hasOwnProperty('properties')) newTrial.custom.data.properties = properties;
    if (action !== 'update' || args.hasOwnProperty('entities')) newTrial.custom.data.entities = entities;
    if (action !== 'update' || args.hasOwnProperty('deployedEntities')) newTrial.custom.data.deployedEntities = deployedEntities;
    if (action !== 'update' || args.hasOwnProperty('status')) newTrial.custom.data.status = status;
    if (cloneFrom) {
      if (action !== 'update' || args.hasOwnProperty('status')) newTrial.custom.data.status = 'design';
      if (cloneFrom == 'design') newTrial.custom.data.entities = entities;
      if (cloneFrom == 'deploy') newTrial.custom.data.entities = deployedEntities;
      newTrial.custom.data.deployedEntities = [];
    }
    const trial = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom
        && task.custom.data
        && task.custom.data.key === key,
    );

    let updateTrialSet = false;

    if (trial[0]) {
      if (action === 'update') {
        newTrial.custom = this.mergeDeep(trial[0].custom, newTrial.custom);
      }
      newTrial.custom.data.statusUpdated = !!trial[0].custom.data.statusUpdated;
      if (status === 'deploy' && !trial[0].custom.data.statusUpdated) {
        newTrial.custom.data.deployedEntities = entities;
        newTrial.custom.data.statusUpdated = true;
      }
      if (state === 'Deleted' && trial[0].custom.data.state !== 'Deleted') {
        updateTrialSet = true;
      }
    } else {
      if (action === 'update') {
        return [
          { error: 'Ooops. Trial not found.' },
        ];
      }
      updateTrialSet = true;
    }
    console.log('newTrial before one ms before update', JSON.stringify(newTrial));
    const response = await this.connector.addUpdateTask(
      newTrial,
      uid,
      experimentId,
    );
    if (updateTrialSet) context.trialSet.setTrials(trialSetKey, experimentId, uid);
    return response.data;
  }

  async getTrials(args) {
    const { experimentId, trialSetKey } = args;
    let result = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom
        && task.custom.data
        && task.custom.data.trialSetKey === trialSetKey
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

    /*    const trials = result.filter(
      task => task.custom && task.custom.type === 'trial',
    );

    for (const trial of trials) {
      trial.devices = trial.custom.data.devices
        && trial.custom.data.devices.map(d => ({
          entity: result.find(
            task => task.custom
              && task.custom.type === 'device'
              && trial.custom.data
              && d.entity === task.custom.id,
          ),
          properties: d.properties || [],
          type: d.type,
          name: d.name,
        }));

      trial.assets = trial.custom.data.assets
        && trial.custom.data.assets.map(d => ({
          entity: result.find(
            task => task.custom
              && task.custom.type === 'asset'
              && trial.custom.data
              && d.entity === task.custom.id,
          ),
          properties: d.properties || [],
          type: d.type,
          name: d.name,
        }));

      trial.trialSet = result.find(
        task => task.custom
          && task.custom.type === 'trialSet'
          && trial.custom.data
          && trial.custom.data.trialSet === task.custom.id,
      );
    } */
    return result;
  }

  async copyEntities(args) {
    const { experimentId, uid } = args;
    let result = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom
        && task.custom.type === 'trial'
        && task.custom.data
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

    result.forEach(trial => {
      trial.custom.data.deployedEntities = trial.custom.data.entities;
      this.connector.addUpdateTask(
        trial,
        uid,
        experimentId,
      );
    });
  }

  async removeEntity(args) {
    const { experimentId, uid } = args;
    let result = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom
        && task.custom.type === 'trial'
        && task.custom.data
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

    result.forEach(trial => {
      trial.custom.data.deployedEntities = trial.custom.data.entities;
      this.connector.addUpdateTask(
        trial,
        uid,
        experimentId,
      );
    });
  }
}

module.exports = Trial;
