const Utils = require('../services/utils');

class Entity {
  constructor({ connector }) {
    this.connector = connector;
  }
  async validateEntityName(args) {
    const {newEntity, experimentId} = args
    const entities = await this.getEntities({experimentId, entitiesTypeKey: newEntity.custom.data.entitiesTypeKey})
    const findEntityByName = entities.find(t =>
      t.custom.data.name === newEntity.custom.data.name && t.custom.data.key !== newEntity.custom.data.key)
    return findEntityByName ? false : true
  }

  async addUpdateEntity(args, context) {
    const {
      key,
      uid,
      experimentId,
      name,
      entitiesTypeKey,
      state,
      properties,
      action,
      dontUpdateEntityType
    } = args;

    let newEntity = {
      custom: {
        id: key,
        type: 'device',
        data: {
          key,
          entitiesTypeKey,
        },
      },
    };


    if (action !== 'update' || args.hasOwnProperty('name')) newEntity.custom.data.name = name;
    if (action !== 'update' || args.hasOwnProperty('state')) newEntity.custom.data.state = state;
    if (action !== 'update' || args.hasOwnProperty('properties')) newEntity.custom.data.properties = properties;

    let updateEntitiesType = false;

    const device = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom
        && task.custom.data
        && task.custom.data.key === key,
    );


    if (device[0]) {
      if (action === 'update') {
        newEntity.custom = Utils.mergeDeep(device[0].custom, newEntity.custom);
      }
      if (state === 'Deleted' && device[0].custom.data.state !== 'Deleted') {
        updateEntitiesType = true;
        this.removeEntities(args, context);
      }
    } else {
      if (action === 'update') {
        return [
          { error: 'Ooops. Trial not found.' },
        ];
      }
      if (!dontUpdateEntityType) {
        updateEntitiesType = true;
      }
    }
    const isEntityValidated = await this.validateEntityName({newEntity, experimentId})
    if (!isEntityValidated) {
      return {
        error: 'duplicate name'
      }
    }

    const response = await this.connector.addUpdateTask(
      newEntity,
      uid,
      experimentId,
    );

    if (updateEntitiesType) context.entitiesType.setEntities(entitiesTypeKey, experimentId, uid);

    return response.data;
  }

  async removeEntities(args, context) {
    const {
      key,
      experimentId,
    } = args;
    //remove entities of device from trials
    //1. get all trials that have the entity in entities
    let result = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom
        && task.custom.data
        && task.custom.type === "trial"
    );

    result.filter(a => a.custom.data.deployedEntities.find(e => e.key === key) || a.custom.data.entities.find(e => e.key === key)).forEach(r => {
     //2. update entities of each trial
      context.trial.addUpdateTrial({ ...r.custom.data, experimentId, entities: r.custom.data.entities.filter(e => e.key !== key), deployedEntities: r.custom.data.deployedEntities.filter(e => e.key !== key) }, context);
    });
  }


  async getEntities(args) {
    const { experimentId, entitiesTypeKey, trialKey } = args;
    let result = await this.connector.getTasksFromExperiment(
      experimentId,
      task => task.custom
        && task.custom.data
        && (!entitiesTypeKey || task.custom.data.entitiesTypeKey === entitiesTypeKey)
        && task.custom.type == "device"
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

    if (trialKey) {
      const trial = await this.connector.getTasksFromExperiment(
        experimentId,
        task => task.custom
          && task.custom.data
          && task.custom.data.key === trialKey
          && task.custom.data.state !== 'Deleted',
      );
      const deviceskeys = trial[0].custom.data[trial[0].custom.data.status === 'design' ? 'entities' : 'deployedEntities'].map(e => e.key);
      return result.filter(r => deviceskeys.indexOf(r.custom.data.key) !== -1);
    }
    return result;
  }
}

module.exports = Entity;
