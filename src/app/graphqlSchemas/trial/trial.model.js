class Trial {
  constructor({ connector }) {
    this.connector = connector;
  }

  async addUpdateTrial(args) {
    const {
      uid,
      experimentId,
      id,
      name,
      key,
      trialSetKey,
      properties,
      numberOfDevices,
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
          properties,
        },
      },
    };

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
        && task.custom.data.trialSetKey === trialSetKey,
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
}

module.exports = Trial;
