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
        && experiment.custom.data
        && experiment.custom.type === 'experimentData'
        && experiment.recycled === undefined
        && experiment.project
        && experiment.project.recycled === undefined
        && experiment.custom.data.state !== 'Deleted',
    );
  }

  async cloneEntity({ element, experimentId, entitiesTypeKey, uid }, context) {
    return new Promise(async (resolve) => {
      const newDevice = await context.entity.addUpdateEntity({
        ...element.custom.data,
        key: uuid(),
        experimentId,
        entitiesTypeKey,
        uid,
        dontUpdateEntityType: true
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
  async cloneLabel({ element, experimentId, uid }, context) {
    return new Promise(async (resolve) => {
      const newLabel = await context.logs.addUpdateLabel({
        ...element.custom.data,
        key: uuid(),
        experimentId,
        uid
      }, context)
      if (newLabel) {
        return resolve({ [element.custom.id]: newLabel.custom.id })
      }
    })
  }
  async cloneLog({ element, experimentId, uid, labels }, context) {
    return new Promise(async (resolve) => {
      await context.logs.addUpdateLog({
        logData: {
          ...element.custom.data,
          labels,
          key: uuid()
        },
        experimentId,
        uid
      }, context)
      return resolve()
    })
  }
  async cloneTrialSet({ element, experimentId, uid, trials }, context) {
    return new Promise(async (resolve) => {
      const newTrialSet = await context.trialSet.addUpdateTrialSet({
        ...element.custom.data,
        key: uuid(),
        experimentId,
        uid
      }, context)
      if (newTrialSet) {
        return resolve({oldId: element.custom.id, newId: newTrialSet.custom.id})
      }
    })
  }
  async cloneTrial({ element, experimentId, uid, entityTypeIdsMap, entitiesIdsMap, trialSetId }, context) {
    return new Promise(async (resolve) => {
      const newEntites = element.custom.data.entities && element.custom.data.entities.map(w => ({
        ...w,
        key: entitiesIdsMap[w.key],
        entitiesTypeKey: entityTypeIdsMap[w.entitiesTypeKey]
      }))
      await context.trial.addUpdateTrial({
        ...element.custom.data,
        uid,
        key: uuid(),
        experimentId,
        trialSetKey: trialSetId,
        cloneFrom: null,
        cloneFromTrailKey: null,
        entities: newEntites,
        dontUpdateTrialSet: true
      }, context)
      return resolve()
    })
  }

  async cloneDeepExperiment(args, context) {
    const { experimentId, cloneTrailId, uid } = args;
    const labels = args.labels || await context.logs.getLabels({ experimentId: cloneTrailId });
    const labelsIds = await Promise.all(labels.map(async element => {
      return await this.cloneLabel({ element, experimentId, uid }, context)
    }))
    const labelsIdsMap = Object.assign({}, ...labelsIds);
    const logs = args.logs || await context.logs.getLogs({ experimentId: cloneTrailId });
    await Promise.all(logs.map(async element => {
      const labelsArr = element.custom.data.labels && element.custom.data.labels.map(l => labelsIdsMap[l])
      return await this.cloneLog({ element, experimentId, uid, labels: labelsArr }, context)
    }))

    const entityTypes = args.entityTypes || await context.entitiesType.getEntitiesTypes({ experimentId: cloneTrailId });
    const entityTypeIds = await Promise.all(entityTypes.map(async element => {
      return await this.cloneEntityType({ element, experimentId, uid }, context)
    }))
    const entityTypeIdsMap = Object.assign({}, ...entityTypeIds);
    const entities = args.entities || await context.entity.getEntities({ experimentId: cloneTrailId }, context)
    const entitiesIds = await Promise.all(entities.map(async element => {
      const entitiesTypeKey = entityTypeIdsMap[element.custom.data.entitiesTypeKey]
      return await this.cloneEntity({ element, experimentId, uid, entitiesTypeKey }, context)
    }))
    const entitiesIdsMap = Object.assign({}, ...entitiesIds);
    Promise.all(entityTypes.map(async element => {
      return await context.entitiesType.setEntities(entityTypeIdsMap[element.custom.id], experimentId, uid);
    }))
    const trialSets = args.trialSets || await context.trialSet.getTrialSets({ experimentId: cloneTrailId });
    const trialSetsIds = await Promise.all(trialSets.map(async element => {
      return await this.cloneTrialSet({ element, experimentId, uid }, context)
    }))
    await Promise.all(trialSetsIds.map(async element => {
      let trials = [];
      if (args.trials) {
        trials = args.trials.filter(q => q.custom.data.trialSetKey === element.oldId)
      } else {
        trials = await context.trial.getTrials({ experimentId: cloneTrailId, trialSetKey: element.oldId })
      }
      await Promise.all(trials.map(async t => {
        return await this.cloneTrial({element: t, experimentId, uid, entityTypeIdsMap, entitiesIdsMap, trialSetId: element.newId}, context)
      }))
      await context.trialSet.setTrials(element.newId, experimentId, uid);
    }))
  }



  async uploadExperiment(args, context) {
    const { experiment, uid, entityTypes, entities, trialSets, trials, logs, labels } = args
    const newExperiment = {
      custom: {
        id: '',
      },
      title: experiment.name,
      description: experiment.description,
    };
    const response = await this.connector.addUpdateProject(newExperiment, uid);
    if (response) {
      this.cloneDeepExperiment({
        experimentId: response.data.id,
        uid,
        entityTypes: entityTypes.map(q => ({ custom: { data: { ...q }, id: q.key } })),
        entities: entities.map(q => ({ custom: { data: { ...q }, id: q.key } })),
        trialSets: trialSets.map(q => ({ custom: { data: { ...q }, id: q.key } })),
        trials: trials.map(q => ({ custom: { data: { ...q }, id: q.key } })),
        logs: logs.map(q => ({ custom: { data: { ...q }, id: q.key } })),
        labels: labels.map(q => ({ custom: { data: { ...q }, id: q.key } }))
      }, context)
    }

    return response ? response.data : null;
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
    const { experimentId } = args;
    const entityTypes = new Promise(async (resolve) => {
      resolve(await context.entitiesType.getEntitiesTypes({ experimentId }))
    });
    const entities = new Promise(async (resolve) => {
      resolve(await context.entity.getEntities({ experimentId }))
    });
    const trialSets = new Promise(async (resolve) => {
      resolve(await context.trialSet.getTrialSets({ experimentId }))
    });
    const trials = new Promise(async (resolve) => {
      resolve(await context.trial.getTrials({ experimentId }))
    });
    const logs = new Promise(async (resolve) => {
      resolve(await context.logs.getLogs({ experimentId }))
    });
    const labels = new Promise(async (resolve) => {
      resolve(await context.logs.getLabels({ experimentId }))
    });
    const data = await Promise.all([entityTypes, entities, trialSets, trials, logs, labels])
    return {
      entityTypes: data[0],
      entities: data[1],
      trialSets: data[2],
      trials: data[3],
      logs: data[4],
      labels: data[5]
    }
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
