const { pubsub, TRIALSETS_UPDATED } = require('../../subscriptions');
const Utils = require('../services/utils');
const uuid = require('uuid/v4');
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

  async addUpdateTrialSet(args, context) {
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
      cloneTrailKey
    } = args;

    let newTrialSet = {
      custom: {
        id: key,
        type: 'trialSet',
        data: {
          key,
        },
      },
    };
    if(cloneTrailKey) {
      const trials = await context.trial.getTrials({experimentId, trialSetKey: cloneTrailKey})
      trials.forEach(element => {
        context.trial.addUpdateTrial({
          ...element.custom.data,
          uid,
          key: uuid(),
          experimentId,
          trialSetKey: key,
          cloneFrom: null,
          cloneFromTrailKey: null
        }, context)
      });
    }


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
        newTrialSet.custom = Utils.mergeDeep(trialSet[0].custom, newTrialSet.custom);
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
