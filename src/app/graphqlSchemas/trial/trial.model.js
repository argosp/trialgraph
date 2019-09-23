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
      notes,
      begin,
      end,
      devices,
      assets,
      trialSet,
      properties,
    } = args;
    const newTrial = {
      project: experimentId,
      title: name,
      description: `${name}. starts in ${begin}, ends in ${end}`,
      custom: {
        id,
        type: 'trial',
        data: {
          begin,
          end,
          devices,
          assets,
          trialSet,
          properties,
          notes,
        },
      },
    };
    const response = await this.connector.addUpdateTask(
      newTrial,
      uid,
      experimentId,
    );
    return JSON.parse(response.body);
  }

  async getTrials(args) {
    const { experimentId, trialSetId } = args;
    let result = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom
        && task.custom.data
        && task.custom.data.trialSet === trialSetId,
    );
    if (typeof result === 'string') {
      result = JSON.parse(result);
    }
    if (result === null || result === undefined || !Array.isArray(result)) {
      return [
        { error: 'Ooops. Something went wrong and we coudnt fetch the data' },
      ];
    }

    const trials = result.filter(
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
    }

    return trials;
  }
}

module.exports = Trial;
