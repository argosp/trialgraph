class Trial {
  constructor({ connector }) {
    this.connector = connector;
  }

  async addUpdateTrial(args, context) {
    const {
      uid,
      experimentId,
      id,
      name,
      key,
      trialSetKey,
      properties,
      entities,
      deployedEntities,
      numberOfDevices,
      state,
      status,
    } = args;

    const newTrial = {
      custom: {
        id: key,
        type: 'trial',
        data: {
          id,
          key,
          name,
          trialSetKey,
          numberOfDevices,
          state,
          properties,
          entities,
          deployedEntities,
          status,
        },
      },
    };

    const trial = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom
        && task.custom.data
        && task.custom.data.key === key,
    );

    if (trial[0]) {
      newTrial.custom.data.statusUpdated = !!trial[0].custom.data.statusUpdated;
      if (status === 'deploy' && !trial[0].custom.data.statusUpdated) {
        newTrial.custom.data.deployedEntities = entities;
        newTrial.custom.data.statusUpdated = true;
      }
      if (state === 'Deleted' && trial[0].custom.data.state !== 'Deleted') {
        context.trialSet.setTrials('remove', trialSetKey, experimentId, uid);
      }
    } else {
      context.trialSet.setTrials('add', trialSetKey, experimentId, uid);
    }
    const response = await this.connector.addUpdateTask(
      newTrial,
      uid,
      experimentId,
    );
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
}

module.exports = Trial;
