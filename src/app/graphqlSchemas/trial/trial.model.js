const Utils = require('../services/utils');
class Trial {
  constructor({ connector }) {
    this.connector = connector;
  }
  async getTrialBytrialKey(experimentId, trialKey) {
    return await this.connector.getTasksFromExperiment(
      experimentId,
      (task) => task.custom && task.custom.data && task.custom.data.key === trialKey
    );
  }

  async addUpdateTrial(args, context) {
    const {
      uid,
      experimentId,
      name,
      key,
      trialSetKey,
      properties,
      entities,
      deployedEntities,
      numberOfEntities,
      state,
      status,
      cloneFrom,
      action,
    } = args;
    let newTrial = {
      custom: {
        id: key,
        type: "trial",
        data: {
          key,
          trialSetKey,
          cloneFrom,
        },
      },
    };
    if (action !== "update" || args.hasOwnProperty("name"))
      newTrial.custom.data.name = name;
    if (action !== "update" || args.hasOwnProperty("numberOfEntities"))
      newTrial.custom.data.numberOfEntities = numberOfEntities;
    if (action !== "update" || args.hasOwnProperty("state"))
      newTrial.custom.data.state = state;
    if (action !== "update" || args.hasOwnProperty("properties"))
      newTrial.custom.data.properties = properties;
    if (action !== "update" || args.hasOwnProperty("entities"))
      newTrial.custom.data.entities = entities;
    if (action !== "update" || args.hasOwnProperty("deployedEntities"))
      newTrial.custom.data.deployedEntities = deployedEntities;
    if (action !== "update" || args.hasOwnProperty("status"))
      newTrial.custom.data.status = status;
    if (cloneFrom) {
      if (action !== "update" || args.hasOwnProperty("status"))
        newTrial.custom.data.status = "design";
      if (cloneFrom == "design") newTrial.custom.data.entities = entities;
      if (cloneFrom == "deploy")
        newTrial.custom.data.entities = deployedEntities;
      newTrial.custom.data.deployedEntities = [];
    }
    const trial = await this.getTrialBytrialKey(experimentId, key); //key is trial.key

    let updateTrialSet = false;

    if (trial[0]) {
      if (action === "update") {
        newTrial.custom = Utils.mergeDeep(trial[0].custom, newTrial.custom);
        // await this.updateInheritableProperties(newTrial.custom.data.entities, experimentId);//deployEntities
      }
      newTrial.custom.data.statusUpdated = !!trial[0].custom.data.statusUpdated;
      if (status === "deploy" && !trial[0].custom.data.statusUpdated) {
        newTrial.custom.data.deployedEntities = entities;
        newTrial.custom.data.statusUpdated = true;
      }
      if (state === "Deleted" && trial[0].custom.data.state !== "Deleted") {
        updateTrialSet = true;
      }
    } else {
      if (action === "update") {
        return [{ error: "Ooops. Trial not found." }];
      }
      updateTrialSet = true;
    }

    console.log(
      "newTrial before one ms before update",
      JSON.stringify(newTrial)
    );
    const response = await this.connector.addUpdateTask(
      newTrial,
      uid,
      experimentId
    );

    if (updateTrialSet)
      context.trialSet.setTrials(trialSetKey, experimentId, uid);
    return response.data;
  }

 
  async getTrials(args) { 
    const { experimentId, trialSetKey } = args;
    let result = await this.connector.getTasksFromExperiment(
      experimentId,
      (task) =>
        task.custom &&
        task.custom.data &&
        task.custom.data.trialSetKey === trialSetKey &&
        task.custom.data.state !== "Deleted"
    );

    if (typeof result === "string") {
      result = JSON.parse(result);
    }

    if (result === null || result === undefined || !Array.isArray(result)) {
      return [
        { error: "Ooops. Something went wrong and we coudnt fetch the data" },
      ];
    }

    return result;
  }

  async copyEntities(args) {
    const { experimentId, uid } = args;
    let result = await this.connector.getTasksFromExperiment(
      experimentId,
      (task) =>
        task.custom &&
        task.custom.type === "trial" &&
        task.custom.data &&
        task.custom.data.state !== "Deleted"
    );

    if (typeof result === "string") {
      result = JSON.parse(result);
    }

    if (result === null || result === undefined || !Array.isArray(result)) {
      return [
        { error: "Ooops. Something went wrong and we coudnt fetch the data" },
      ];
    }

    result.forEach((trial) => {
      trial.custom.data.deployedEntities = trial.custom.data.entities;
      this.connector.addUpdateTask(trial, uid, experimentId);
    });
  }

  async removeEntity(args) {
    const { experimentId, uid } = args;
    let result = await this.connector.getTasksFromExperiment(
      experimentId,
      (task) =>
        task.custom &&
        task.custom.type === "trial" &&
        task.custom.data &&
        task.custom.data.state !== "Deleted"
    );

    if (typeof result === "string") {
      result = JSON.parse(result);
    }

    if (result === null || result === undefined || !Array.isArray(result)) {
      return [
        { error: "Ooops. Something went wrong and we coudnt fetch the data" },
      ];
    }

    result.forEach((trial) => {
      trial.custom.data.deployedEntities = trial.custom.data.entities;
      this.connector.addUpdateTask(trial, uid, experimentId);
    });
  }

  async updateTrialContainsEntities(args, context) {
    const { key, experimentId, parentEntityKey, entity, uid, action } = args;
    let updatedTrial = {
      custom: {
        id: key,
        type: "trial",
        data: {
          key,
        },
      },
    };
    const trial = await this.getTrialBytrialKey(experimentId, key);
    if (trial[0]) {
      updatedTrial.custom = Utils.mergeDeep(
        trial[0].custom,
        updatedTrial.custom
      );
      const currentEntities = updatedTrial.custom.data.status == "design" ?updatedTrial.custom.data.entities:
        updatedTrial.custom.data.status == "deployedEntities"? updatedTrial.custom.data.deployedEntities:[];
      const updatedEntitiesResponse = this.findAndUpdateParentyEntity(
        currentEntities,
        parentEntityKey,
        entity,
        action
      );
      if (!updatedEntitiesResponse.error) {
        if (updatedTrial.custom.data.status = "design")
          updatedTrial.custom.data.entities = updatedEntitiesResponse;
        else if (updatedTrial.custom.data.status == "deployedEntities") 
          updatedTrial.custom.data.deployedEntities = updatedEntitiesResponse;

        console.log(
          "Trial entities before update in root",
          updatedTrial.custom.data.entities
        );
        const response = await this.connector.addUpdateTask(
          updatedTrial,
          uid,
          experimentId
        );
        return response.data;
      } else return updatedEntitiesResponse;
    } else {
      return { error: "Trial not found." };
    }
  }

  findAndUpdateParentyEntity(entitiesArray, parentEntityKey, entity, action) {
    let isExistEntityInTrial = false;
    let error;
    entitiesArray.forEach((el) => {
      if (el.key === parentEntityKey) {
        if (!el.containsEntities) el.containsEntities = [];
        const index = el.containsEntities.indexOf(entity.key);
        if (action == "update") {
          if (index < 0) el.containsEntities.push(entity.key);//not exist when index == -1
          else {
            error = { error: "Entity alredy exist." };
            return;
          }
        }
        if (action == "delete") {
          if (index > -1) el.containsEntities.splice(index, 1);
          else {
            error = { error: "Entity not found." };
            return;
          }
        }
      }
      if (el.key === entity.key) isExistEntityInTrial = true;
    });
    if (!isExistEntityInTrial) entitiesArray.push(entity);
    //  const updatedInheritableEntitiesArray = 
    //  await this.updateInheritableProperties(parentEntityKey, entitiesArray, experimentId);
    return error || entitiesArray; //return updatedInheritableEntitiesArray
  }
}

module.exports = Trial;
