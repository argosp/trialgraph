const { pubsub, ENTITIES_TYPES_UPDATED } = require('../../subscriptions');
const Utils = require('../services/utils');

class EntitiesType {
  constructor({ connector }) {
    this.connector = connector;
  }

  /*  async getAllEntitiesTypes() {
    const entitiesTypes = await this.connector.getTasks(
      task => task.custom && task.custom.type === 'entitiesType',
    );
    return entitiesTypes != null ? entitiesTypes : [];
  } */

  async getEntitiesTypes(args) {
    const { experimentId } = args;
    let result = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom && task.custom.type === 'entitiesType' && task.custom.data.state !== 'Deleted',
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

  async setEntities(key, experimentId, uid) {
    let result = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom &&
        task.custom.data.state !== 'Deleted' &&
        (task.custom.type === 'entitiesType' && task.custom.data.key === key ||
        task.custom.type === 'device' && task.custom.data.entitiesTypeKey === key),
    );
    let entitiesType = result.find(r => r.custom.type === 'entitiesType' && r.custom.data.key === key);
    entitiesType.custom.data.numberOfEntities = result.length - 1;

    await this.connector.addUpdateTask(
      entitiesType,
      uid,
      experimentId,
    );
    pubsub.publish(ENTITIES_TYPES_UPDATED, { entitiesTypesUpdated: true });
  }

  async addUpdateEntitiesType(args) {
    const {
      uid,
      experimentId,
      key,
      name,
      properties,
      numberOfEntities,
      state,
      action,
    } = args;

    let newEntitiesType = {
      custom: {
        id: key,
        type: 'entitiesType',
        data: {
          key,
        },
      },
    };

    if (action !== 'update' || args.hasOwnProperty('name')) newEntitiesType.custom.data.name = name;
    if (action !== 'update' || args.hasOwnProperty('properties')) newEntitiesType.custom.data.properties = properties;
    if (action !== 'update' || args.hasOwnProperty('numberOfEntities')) newEntitiesType.custom.data.numberOfEntities = numberOfEntities;
    if (action !== 'update' || args.hasOwnProperty('state')) newEntitiesType.custom.data.state = state;
    
    const entitiesType = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom
        && task.custom.data
        && task.custom.data.key === key,
    );

    if (entitiesType[0]) {
      if (action === 'update') {
        newEntitiesType.custom = Utils.mergeDeep(entitiesType[0].custom, newEntitiesType.custom);
      }
    } else {
      if (action === 'update') {
        return [
          { error: 'Ooops. entitiesType not found.' },
        ];
      }
    }

    const response = await this.connector.addUpdateTask(
      newEntitiesType,
      uid,
      experimentId,
    );

    return response.data;
  }
}

module.exports = EntitiesType;
