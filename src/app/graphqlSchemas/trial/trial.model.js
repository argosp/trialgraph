const Utils = require('../services/utils');
class Trial {
  constructor({ connector }) {
    this.connector = connector;
  }
  async getTrialBytrialKey(experimentId, trialKey) {
    const res =  await this.connector.getTasksFromExperiment(
      experimentId,
      (task) => task.custom && task.custom.data && task.custom.data.key === trialKey
    );
    return res[0];
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

    if (trial) {
      if (action === "update") {
        newTrial.custom = Utils.mergeDeep(trial.custom, newTrial.custom);
        // await this.updateInheritableProperties(newTrial.custom.data.entities, experimentId);//deployEntities
      }
      newTrial.custom.data.statusUpdated = !!trial.custom.data.statusUpdated;
      if (status === "deploy" && !trial.custom.data.statusUpdated) {
        newTrial.custom.data.deployedEntities = entities;
        newTrial.custom.data.statusUpdated = true;
      }
      if (state === "Deleted" && trial.custom.data.state !== "Deleted") {
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
  findEntity(entitiesArray, entityKey){
    return entitiesArray.find((el) => el.key === entityKey);
    }
  async updateTrialContainsEntities(args, context) {
    const { key, experimentId, parentEntityKey, entity, uid, action } = args;
    const trial = await this.getTrialBytrialKey(experimentId, key);
    if (trial) {
      const currentEntitiesByStatus = trial.custom.data.status == "design" ?
      trial.custom.data.entities:trial.custom.data.deployedEntities;
      let updatedEntitiesResponse = await this.updateEntitiesByParent(
        currentEntitiesByStatus,
        parentEntityKey,
        entity,
        action
      );
      if (!updatedEntitiesResponse.error) {
        if(action == "update"){
          //  const updatedInheritableEntitiesArray = 
          // updatedEntitiesResponse = await this.updateInheritableProperties(parentEntityKey, updatedEntitiesResponse, experimentId);
        }
        if (trial.custom.data.status = "design")
          trial.custom.data.entities = updatedEntitiesResponse;
        else trial.custom.data.deployedEntities = updatedEntitiesResponse;

        console.log(
          "Trial entities before update in root",
          trial.custom.data.entities
        );
        const response = await this.connector.addUpdateTask(
          trial,
          uid,
          experimentId
        );
        // const response ={ data:"ok"};
        return response.data;
      } else return updatedEntitiesResponse;
    } else {
      return { error: "Trial not found." };
    }
  }

  async updateEntitiesByParent(entitiesArray, parentEntityKey, entity, action) {
    let parentEntityOjb = this.getParentObj(entitiesArray, parentEntityKey);
     if(parentEntityOjb){
        const index = this.getEntityIndexFromContainsEntitiesInParent(parentEntityOjb.containsEntities, entity);
        switch (action) {
          case "update":
            {
              if (index < 0)
              {
              //add to array
                parentEntityOjb.containsEntities.push(entity.key); //not exist when index == -1
                //addNewEntityToTrialEntitiesArray if not exsit. refactor to new func
                const found = this.findEntity(entitiesArray, entity.key); 
                if (!found)
                  entitiesArray.push(entity);
              }
              else return { 
                  error: "Entity alredy exist."
              };
            }
            break;
            case "delete":
            {
              //remove from array
              if (index > -1) parentEntityOjb.containsEntities.splice(index, 1);
              else return {
                  error: "Entity not found."
              };
            }
              break;
          default:
            break;
        }
        return entitiesArray; 
    }
    else  return {
      error: "Parent entity not found."
   };
  }

  getParentObj(entitiesArray, parentEntityKey) {
    let parentEntityOjb = this.findEntity(entitiesArray, parentEntityKey);   
    if (!parentEntityOjb.containsEntities) parentEntityOjb.containsEntities = [];
    return parentEntityOjb;

  }
  getEntityIndexFromContainsEntitiesInParent(containsEntitiesArray, entity) {
    return containsEntitiesArray.indexOf(entity.key);
  }
  
  async updateInheritableProperties(parentEntityKey, entitiesArray, experimentId) { 
    let parentEntityOjb = this.findEntity(entitiesArray, parentEntityKey);
    //NOTE: each trial holds ALL entites include the contian entites.
       if (parentEntityOjb.containsEntities.length) {
         const inheritablePropertiesKeys = await this.getProp(experimentId, parentEntityOjb.entitiesTypeKey, "inheritable", true);
         if(inheritablePropertiesKeys.length){
          let inheritablePropertiesArray = [];
          inheritablePropertiesKeys.forEach((prop) => {
          inheritablePropertiesArray = parentEntityOjb.properties.filter((p) => p.key == prop.key);
         });        
            const entitiesWithParentInheritable = this.findEntitiesToUpdate(parentEntityOjb, entitiesArray);//TODO: rucrsive fucntion to fetch all entities from trial by  key         
            if (entitiesWithParentInheritable.length){
             entitiesWithParentInheritable.forEach(entityToUpdate => {
              inheritablePropertiesArray.forEach( inheritableProp =>{
               let index = entityToUpdate.properties.findIndex(propToUpdate => propToUpdate.key == inheritableProp.key);
              if(index>-1) 
               entityToUpdate.properties[index].val = inheritableProp.val;
               else
                entityToUpdate.properties.push(inheritableProp);
              })
             });
          let res = this.mergeArrayObjects(entitiesArray, entitiesWithParentInheritable); 
             return res;
           // let locationPropertiesKeys = this.getProp(experimentId, entitiesWithParentInheritable[0].entitiesTypeKey,"type", "location");
           // locationPropertiesKeys.forEach(element => {
           //   element.val = valueToCopy;
           // });
         }
         return  'no  entities with parent to update';
        }
       }
       else return 'no inheritable properties in parent';
     
   }
   mergeArrayObjects(arr1, arr2){
     arr2.forEach((item) => {
       let index = arr1.findIndex(e => e.key == item.key)
       arr1[index] = Object.assign({},arr1[index],item);
     });
     return arr1;
  }
   async getEntitiesType(experimentId, entitiesTypekey) {
    return await this.connector.getTasksFromExperiment(
      experimentId,
      (task) => task.custom && task.custom.data && task.custom.data.key === entitiesTypekey
    );
  }
  
  findEntitiesToUpdate(parentEntity, entitiesArray) {
    let entitiesWithParentInheritable = [];
    entitiesWithParentInheritable = this.findRecursive(entitiesWithParentInheritable, parentEntity, entitiesArray);
     return entitiesWithParentInheritable;
}


findRecursive(entitiesWithParentInheritable, parentEntity, entitiesArray) {
      parentEntity.containsEntities.forEach(entityKey => {
        let foundEntity = this.findEntity(entitiesArray, entityKey);//למצוא למה לו מוצא את האובייקט
        let index = entitiesWithParentInheritable.indexOf(foundEntity.key);
        if (index < 0)
          entitiesWithParentInheritable.push(foundEntity);
        if (foundEntity.containsEntities &&foundEntity.containsEntities.length)
          return findRecursive(entitiesWithParentInheritable, foundEntity, entitiesArray);
      });
    return entitiesWithParentInheritable;
  }

async getProp(experimentId, entitiesTypeKey, fieldName, value) {
  const entitiesTypesData = await this.getEntitiesType(experimentId, entitiesTypeKey);
  console.log('getProp: entitiesTypesData[0].custom.data.properties ', entitiesTypesData[0].custom.data.properties)
  const propertiesKeysOfEntityTypes = entitiesTypesData[0].custom.data.properties.filter(
      (e) => e[fieldName] == value //for example: inheritable == true OR type == 'location'
  );
  return propertiesKeysOfEntityTypes;
}
}

module.exports = Trial;
