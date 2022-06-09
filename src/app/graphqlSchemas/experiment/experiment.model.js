const config = require('../../../config');
const uuid = require('uuid/v4');

class Experiment {
  constructor({ connector }) {
    this.connector = connector;
  }

  async getAllExperiments() {
    let projects = await this.connector.getAllProjects();
    projects = projects.filter(
      project => project.id !== config.devicesProjectId,
    );
    return projects;
  }

  async getAllExperimentsWithData() {
    return this.connector.getTasks(
      experiment => experiment.custom
        && experiment.custom.type === 'experimentData'
        && experiment.recycled === undefined
        && experiment.project
        && experiment.project.recycled === undefined
        && experiment.custom.data.state !== 'Deleted',
    );
  }

  async cloneEntity({ element, experimentId,entitiesTypeKey, uid }, context) {
    return new Promise(async (resolve) => {
      const newDevice = await context.entity.addUpdateEntity({
        ...element.custom.data,
        key: uuid(),
        experimentId,
        entitiesTypeKey,
        uid
      }, context)
      if (newDevice) {
        return resolve({ [element.custom.id]: newDevice.custom.id })
      }
    })
  }

  async cloneEntityType({ element, experimentId, uid }, context) {
    return new Promise(async (resolve) => {
      const newEntityType = await context.entitiesType.addUpdateEntitiesType({
        ...element.custom.data,
        key: uuid(),
        experimentId,
        uid
      }, context)
      if (newEntityType) {
        return resolve({ [element.custom.id]: newEntityType.custom.id })
      }
    })
  }

  async cloneDeepExperiment(args, context) {
    const { experimentId, cloneTrailId, uid } = args;
    const entityTypes = await context.entitiesType.getEntitiesTypes({experimentId: cloneTrailId});
    const entityTypeIds = await Promise.all(entityTypes.map(async element => {
      return await this.cloneEntityType({ element, experimentId, uid }, context)
    }))
    const entityTypeIdsMap = Object.assign({}, ...entityTypeIds);
    const entities = await context.entity.getEntities({ experimentId: cloneTrailId }, context)
    const entitiesIds = await Promise.all(entities.map(async element => {
      const entitiesTypeKey = entityTypeIdsMap[element.custom.data.entitiesTypeKey]
      return await this.cloneEntity({ element, experimentId, uid, entitiesTypeKey }, context)
    }))
    const entitiesIdsMap = Object.assign({}, ...entitiesIds);
    const trialSets = await context.trialSet.getTrialSets({ experimentId: cloneTrailId });
    trialSets.forEach(async element => {
      const newTrialSet = await context.trialSet.addUpdateTrialSet({
        ...element.custom.data,
        key: uuid(),
        experimentId,
        uid
      }, context)
      if (newTrialSet) {
        const trials = await context.trial.getTrials({ experimentId: cloneTrailId, trialSetKey: element.custom.id })
        trials.forEach(t => {
          const newEntites = t.custom.data.entities && t.custom.data.entities.map(w => ({
            ...w,
            key: entitiesIdsMap[w.key],
            entitiesTypeKey: entityTypeIdsMap[w.entitiesTypeKey]
          }))
          context.trial.addUpdateTrial({
            ...t.custom.data,
            uid,
            key: uuid(),
            experimentId,
            trialSetKey: newTrialSet.custom.id,
            cloneFrom: null,
            cloneFromTrailKey: null,
            entities: newEntites
          }, context)
        });
      }


    });
  }

  async addUpdateExperiment(args, context) {
    const { uid, name, description, state, status, id, cloneTrailId } = args;

    const newExperiment = {
      custom: {
        id,
      },
      title: name,
      description,
    };
    if (state === 'Deleted') newExperiment.recycled = new Date().toDateString();
    if (state) newExperiment.status = status;
    const response = await this.connector.addUpdateProject(newExperiment, uid);
    if (cloneTrailId && response) {
      this.cloneDeepExperiment({ experimentId: response.data.id, cloneTrailId, uid }, context)

    }

    return response ? response.data : null;
  }

  async getAllExperimentData(args, context) {
    const {experimentId} = args;
    const entityTypes = new Promise(async(resolve) => {
      resolve(await context.entitiesType.getEntitiesTypes({experimentId}))
    });
    const entities = new Promise(async(resolve) => {
      resolve(await context.entity.getEntities({experimentId}))
    });
    const trialSets = new Promise(async(resolve) => {
      resolve(await context.trialSet.getTrialSets({experimentId}))
    });
    const trials = new Promise(async(resolve) => {
      resolve(await context.trial.getTrials({experimentId}))
    });
    const data = await Promise.all([entityTypes, entities, trialSets, trials])
    console.log('33333333333', data)
    return {}
  }

  async buildExperimentData(args, context) {
    const { uid, id } = args;
    const tasks = await this.connector.getTasksFromExperiment(
      id.split('_')[0],
      task => task.custom && task.custom.type === 'trial' && task.custom.id === id,
    );
    const devices = tasks[0].custom.data.devices
      ? tasks[0].custom.data.devices.map(d => ({
        Name: d.name,
        Type: d.type,
        attributes: d.properties
          ? d.properties.reduce(
            (obj, item) => Object.assign(obj, { [item.key]: item.val }),
            {},
          )
          : {},
        contains: [],
        entityType: 'DEVICE',
      }))
      : [];
    const res = {
      Entities: devices,
      properties: tasks[0].custom.data.properties
        ? tasks[0].custom.data.properties.reduce(
          (obj, item) => Object.assign(obj, { [item.key]: item.val }),
          {},
        )
        : {},
    };
    return true;
  }
}

module.exports = Experiment;
