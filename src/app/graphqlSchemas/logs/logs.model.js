const uuid = require('uuid/v4');

class Logs {
  constructor({ connector }) {
    this.connector = connector;
  }

  async getLogs(args) {
    let result = await this.connector.getTasksFromExperiment(
      args.experimentId,
      task => task.custom && task.custom.type === 'log' && task.custom.data.state !== 'Deleted',
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

  async getLabels(args) {
    let result = await this.connector.getTasksFromExperiment(
      args.experimentId,
      task => task.custom && task.custom.type === 'label' && task.custom.data.state !== 'Deleted',
    );
    if (typeof result === 'string') {
      result = JSON.parse(result);
    }

    if (result === null || result === undefined || !Array.isArray(result)) {
      return [
        { error: 'Ooops. Something went wrong and we coudnt fetch the data' },
      ];
    }

    if (args.keys) {
      result = result.filter(r => args.keys.find(w => w === r.custom.id))
    }

    return result;
  }

  async addUpdateLog(args) {
    const key = args.logData.key || uuid();

    const newLog = {
      custom: {
        id: key,
        type: 'log',
        data: {
          key,
          title: args.logData.title,
          comment: args.logData.comment,
          labels: args.logData.labels,
          state: args.logData.state,
          startDate: args.logData.startDate
        },
      },
    };

    const responseNewLog = await this.connector.addUpdateTask(
      newLog,
      args.uid,
      args.experimentId,
    );

    return responseNewLog.data;
  }

  async addUpdateLabel(args) {
    const key = args.key || uuid();

    const newLabel = {
      custom: {
        id: key,
        type: 'label',
        data: {
          key,
          name: args.name,
          color: args.color
        },
      },
    };
    if (args.state) {
      newLabel.custom.data.state = args.state
    }


    const responseNewLabel = await this.connector.addUpdateTask(
      newLabel,
      args.uid,
      args.experimentId,
    );

    return responseNewLabel.data;
  }

}

module.exports = Logs;
