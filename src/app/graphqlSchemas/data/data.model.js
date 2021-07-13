const Utils = require('../services/utils');

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
    const { uid, key, name, description, begin, end, location, numberOfTrials, state, status, statusChanged, maps, action } = args;
    let newData = {
      project: experiment.id,
      id: key,
      custom: {
        id: key,
        type: 'experimentData',
        data: {
          key,
        },
      },
    };
      
    if (action !== 'update' || args.hasOwnProperty('name')) newData.custom.data.name = name;
    if (action !== 'update' || args.hasOwnProperty('description')) newData.custom.data.description = description;
    if (action !== 'update' || args.hasOwnProperty('begin')) newData.custom.data.begin = begin;
    if (action !== 'update' || args.hasOwnProperty('end')) newData.custom.data.end = end;
    if (action !== 'update' || args.hasOwnProperty('location')) newData.custom.data.location = location;
    if (action !== 'update' || args.hasOwnProperty('state')) newData.custom.data.state = state;
    if (action !== 'update' || args.hasOwnProperty('numberOfTrials')) newData.custom.data.numberOfTrials = numberOfTrials;
    if (action !== 'update' || args.hasOwnProperty('status')) newData.custom.data.status = status;
    if (action !== 'update' || args.hasOwnProperty('statusChanged')) newData.custom.data.statusChanged = statusChanged;
    if (action !== 'update' || args.hasOwnProperty('maps')) newData.custom.data.maps = maps;

    const data = await this.connector.getTasksFromExperiment(
      experiment.id,
      task => task.custom
        && task.custom.data
        && task.custom.data.key === key,
    );

    if (data[0]) {
      if (action === 'update') {
        newData.custom = Utils.mergeDeep(data[0].custom, newData.custom);
      }
    } else {
      if (action === 'update') {
        return [
          { error: 'Ooops. entitiesType not found.' },
        ];
      }
    }

    const response = await this.connector.addUpdateTask(
      newData,
      uid,
      experiment.id,
    );

    return response.data;
  }
}

module.exports = Data;
