const config = require('../../../config');
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

  async addUpdateLog(args) {
    const key = args.logData.key || uuid();

    const newLog = {
      custom: {
        id: key,
        type: 'log',
        data: {
          key,
          title: args.logData.title,
          comment: args.logData.comment
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
 
}

module.exports = Logs;
