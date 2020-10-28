class Data {
  constructor({ connector }) {
    this.connector = connector;
  }

  async getExperimentData(args) {
    const { experimentId } = args;
    let result = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom && task.custom.type === 'experimentData',
    );
    if (typeof result === 'string') {
      result = JSON.parse(result);
    }
    if (result === null || result === undefined || !Array.isArray(result)) {
      return [
        { error: 'Ooops. Something went wrong and we coudnt fetch the data' },
      ];
    }

    return result[0];
  }

  async addUpdateExperimentData(args, experiment) {
    console.log('addUpdateExperimentData function ',args);
    const { uid, key, name, description, begin, end, location, numberOfTrials, state, status, statusChanged, maps } = args;
    const newData = {
      project: experiment.id,
      id: key,
      custom: {
        id: key,
        type: 'experimentData',
        data: {
          key,
          name,
          description,
          begin,
          end,
          location,
          state,
          numberOfTrials,
          status,
          statusChanged,
          maps
        },
      },
    };
    const response = await this.connector.addUpdateTask(
      newData,
      uid,
      experiment.id,
    );

    return response.data;
  }
}

module.exports = Data;
