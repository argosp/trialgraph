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
      id,
      name,
      properties,
      description,
      numberOfTrials,
      state,
    } = args;

    const newTrialSet = {
      custom: {
        id: key,
        type: 'trialSet',
        data: {
          id,
          key,
          name,
          description,
          properties,
          numberOfTrials,
          state,
        },
      },
    };

    const response = await this.connector.addUpdateTask(
      newTrialSet,
      uid,
      experimentId,
    );

    return response.data;
  }
}

module.exports = TrialSet;
