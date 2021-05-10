const { pubsub, TRIALSETS_UPDATED } = require('../../subscriptions');

class TrialSet {
  constructor({ connector }) {
    this.connector = connector;
  }

  /*  async getAllTrialSets() {
    const trialSets = await this.connector.getTasks(
      task => task.custom && task.custom.type === 'trialSet',
    );
    return trialSets != null ? trialSets : [];
  } */

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

  async getTrialSets(args) {
    const { experimentId } = args;
    let result = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom && task.custom.type === 'trialSet' && task.custom.data.state !== 'Deleted',
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

  async setTrials(key, experimentId, uid) {
    let result = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom &&
        task.custom.data.state !== 'Deleted' &&
        (task.custom.type === 'trialSet' && task.custom.data.key === key ||
        task.custom.type === 'trial' && task.custom.data.trialSetKey === key),
    );
    let trialSet = result.find(r => r.custom.type === 'trialSet' && r.custom.data.key === key);
    trialSet.custom.data.numberOfTrials = result.length - 1;

    await this.connector.addUpdateTask(
      trialSet,
      uid,
      experimentId,
    );
    pubsub.publish(TRIALSETS_UPDATED, { trialSetsUpdated: true });
  }

  async addUpdateTrialSet(args) {
    const {
      uid,
      experimentId,
      key,
      name,
      properties,
      description,
      numberOfTrials,
      state,
      action,
    } = args;

    let newTrialSet = {
      custom: {
        type: 'trialSet',
        data: {
          key,
        },
      },
    };

    if (action !== 'update' || args.hasOwnProperty('name')) newTrialSet.custom.data.name = name;
    if (action !== 'update' || args.hasOwnProperty('description')) newTrialSet.custom.data.description = description;
    if (action !== 'update' || args.hasOwnProperty('properties')) newTrialSet.custom.data.properties = properties;
    if (action !== 'update' || args.hasOwnProperty('numberOfTrials')) newTrialSet.custom.data.numberOfTrials = numberOfTrials;
    if (action !== 'update' || args.hasOwnProperty('state')) newTrialSet.custom.data.state = state;
    
    const trialSet = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom
        && task.custom.data
        && task.custom.data.key === key,
    );

    if (trialSet[0]) {
      if (action === 'update') {
        newTrialSet.custom = this.mergeDeep(trialSet[0].custom, newTrialSet.custom);
      }
    } else {
      if (action === 'update') {
        return [
          { error: 'Ooops. TrialSet not found.' },
        ];
      }
    }

    const response = await this.connector.addUpdateTask(
      newTrialSet,
      uid,
      experimentId,
    );

    return response.data;
  }
}

module.exports = TrialSet;
