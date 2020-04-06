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
