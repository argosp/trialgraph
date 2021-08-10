const Utils = require('../services/utils');

class Trial {
  constructor({ connector }) {
    this.connector = connector;
    this.experimentData;
    this.trial;
  }
  async getExperimentData (experimentId){
    try {
      const res =  await this.connector.getTasksFromExperiment(
        experimentId
      );
      return res;
    } catch (error) {
      return error
    }
   
  }
  async getTrial(experimentId, trialKey) {
    const res =  await this.connector.getTasksFromExperiment(
      experimentId,
      (task) => task.custom && task.custom.data && task.custom.data.key === trialKey
    );
    return res[0];
  }

  async getTrialByKey(trialKey) {//TODO check why doesnt find trial
   const filterData = (task) => task.custom && task.custom.data && task.custom.data.key === trialKey
   return this.experimentData.filter(filterData);
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
    const trial = await this.getTrial(experimentId, key); //key is trial.key

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
    updateTrialEntitis(updatedEntities){
      this.trial.custom.data[this.getCurrentEntitsNameByStatus().valueOf()] = updatedEntities;
    }
    getTrialEntitis(){
       return this.trial.custom.data[this.getCurrentEntitsNameByStatus().valueOf()];
    }
    getCurrentEntitsNameByStatus(){
      return  this.trial.custom.data.status == "design" ?  'entities':  'deployedEntities';
    }
    getEntitiesFromExperiment(){
      const filterData =
      task => task.custom
        && task.custom.data
        && task.custom.type == "device"
        && task.custom.data.state !== 'Deleted'    
      return this.experimentData.filter(filterData);
    }
    getChildEntityFromExperiment(key){
       const entities = this.getEntitiesFromExperiment();
        return entities.find((el) => el.custom.data.key === key).custom.data;
    }
    getParentAndChildObjFromTrial(entityKey, parentEntityKey){
    const entities = this.getTrialEntitis();
    let en = {};
    for (const e of entities) {
       if(e.key == entityKey)
        en.childEntity = e;
        if(e.key == parentEntityKey)
        en.parentEntity = this.getParentObj(e);
    }
      return en;
   }
 
  async updateTrialContainsEntities(args, context) {
//inheritable feature is per trial therefor -
//look only on trial entiteis and only properties that have:
// trail-set: true & inheritable: true
// will inherit to the child entity.
    const { key, experimentId, parentEntityKey, entity, uid, action } = args;
    this.experimentData = await this.getExperimentData(experimentId);
    //TODO: get trial data from same call of experiment.
    this.trial = await this.getTrial(experimentId, key);
    //TODO: get child and parent form experimnt data if doesnt exist in trial.
    //'cause in case user add the parent and child  in same session - 
    //in that case child and parent are not trial's so we cant find them in trial entities
    let {parentEntity, childEntity} = this.getParentAndChildObjFromTrial(entity.key, parentEntityKey);
    if(!childEntity) childEntity = this.getChildEntityFromExperiment(entity.key);
    if ( this.trial) {
      let updatedEntitiesResponse = await this.updateParentEntity(parentEntity, childEntity, action);
      if (!updatedEntitiesResponse.error) {
        if(action == "update"){
          //  const updatedInheritableEntitiesArray = 
          updatedEntitiesResponse = await this.updateInheritableProperties(parentEntity, updatedEntitiesResponse, experimentId);
          if (updatedEntitiesResponse.error) {
            return updatedEntitiesResponse;
          }
        }
        this.updateTrialEntitis(updatedEntitiesResponse);
        console.log("Trial entities before update in root", this.trial.custom.data.entities);
        const response = await this.connector.addUpdateTask(this.trial, uid, experimentId);
        // const response ={ data:"ok"};
        return response.data;
      } else return updatedEntitiesResponse;
    } else {
      return { error: "Trial not found." };
    }
  }

  async updateParentEntity(parentEntityOjb, entity, action) {
   let trialEntitiesArray = this.getTrialEntitis();
        const index = this.getEntityIndexFromContainsEntitiesInParent(parentEntityOjb.containsEntities, entity);
        switch (action) {
          case "update":
            {
              if (index < 0)
              {
              //add to array
                parentEntityOjb.containsEntities.push(entity.key); //not exist when index == -1
                //addNewEntityToTrialEntitiesArray if not exsit. refactor to new func
                const found = this.findEntity(trialEntitiesArray, entity.key); 
                if (!found)
                trialEntitiesArray.push(entity);
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
        return trialEntitiesArray; 
   
  }

  getParentObj(parentEntityOjb) {
    if (!parentEntityOjb.containsEntities) parentEntityOjb.containsEntities = [];
    return parentEntityOjb;

  }
  getEntityIndexFromContainsEntitiesInParent(containsEntitiesArray, entity) {
    return containsEntitiesArray.indexOf(entity.key);
  }
  async updateInheritableProperties(parentEntityOjb, entitiesArray, experimentId) {
    //NOTE: each trial holds ALL entites include the contian entites.
       if (parentEntityOjb.containsEntities.length) {
         const inheritablePropertiesKeys = await this.getProp(experimentId, parentEntityOjb.entitiesTypeKey, "inheritable", true);
         if(inheritablePropertiesKeys.length){// todo:push to array - prop that doenst exist
          let inheritablePropertiesArray = this.getInheritablePropertiesObjectsByKeys(inheritablePropertiesKeys, parentEntityOjb);        
          if(inheritablePropertiesArray.length){
          //A rucrsive fucntion to fetch all entities from trial by  key
          //TODO: when came to here form add child to parent 0
          // neet the child become a parent here
          // because this all we need to update
            const inheritorsEntities = this.getInheritorsEntities(parentEntityOjb, entitiesArray);         
            if (inheritorsEntities.length){
             const updatedInheritorsEntities =  this.updateInheritorsEntities(inheritorsEntities, inheritablePropertiesArray);
            return this.updateEntitiesArrayWithheritorsEntities(entitiesArray, updatedInheritorsEntities); 
              //TODO: always inherit location prop
            // let locationPropertiesKeys = this.getProp(experimentId,  updatedInheritorsEntities [0].entitiesTypeKey,"type", "location");
           // locationPropertiesKeys.forEach(element => {
           //   element.val = valueToCopy;
           // });
         }
         return {error:'no inheritors entities to update'};

        }
         return  {error: 'no inheritable properties in parent'};
        }
       }
        return {error:'parent has no containsEntities'};
   }
  updateEntitiesArrayWithheritorsEntities(oldEntitiesArray, updatedEntitiesArray) {
    return this.mergeArrayObjects(oldEntitiesArray, updatedEntitiesArray);
  }

  updateInheritorsEntities(inheritorsEntities, inheritablePropertiesArray) {
    inheritorsEntities.forEach(entityToUpdate => {
      inheritablePropertiesArray.forEach(inheritableProp => {
        let index = entityToUpdate.properties.findIndex(propToUpdate => propToUpdate.key == inheritableProp.key);
        if (index > -1)
          entityToUpdate.properties[index].val = inheritableProp.val;//upadte function

        else
          entityToUpdate.properties.push(inheritableProp);//add function
      });
    });
    return inheritorsEntities;
  }

   getInheritablePropertiesObjectsByKeys(inheritablePropertiesKeys, parentEntityOjb) {
    let inheritablePropertiesArray = [];
    for (const propKey  of inheritablePropertiesKeys) 
      inheritablePropertiesArray.push(parentEntityOjb.properties.filter((p) => p.key == propKey)[0]);
    return inheritablePropertiesArray;
  }

   mergeArrayObjects(arr1, arr2){
     arr2.forEach((item) => {
       let index = arr1.findIndex(e => e.key == item.key)
       arr1[index] = Object.assign({},arr1[index],item);
     });
     return arr1;
  }
   async getEntitiesType(experimentId, entitiesTypekey) {//yehudit
    return await this.connector.getTasksFromExperiment(
      experimentId,
      (task) => task.custom && task.custom.data && task.custom.data.key === entitiesTypekey
    );
  }
  
  getInheritorsEntities (parentEntity, entitiesArray) {
    let  inheritorsEntities  = [];
     inheritorsEntities  = this.findRecursive( inheritorsEntities , parentEntity, entitiesArray);
     return  inheritorsEntities ;
}

findRecursive( inheritorsEntities , parentEntity, entitiesArray) {
      parentEntity.containsEntities.forEach(entityKey => {
        let foundEntity = this.findEntity(entitiesArray, entityKey);
        let index =  inheritorsEntities .indexOf(foundEntity.key);
        if (index < 0)
           inheritorsEntities .push(foundEntity);
        if (foundEntity.containsEntities &&foundEntity.containsEntities.length)
          return findRecursive( inheritorsEntities , foundEntity, entitiesArray);
      });
    return  inheritorsEntities ;
  }

async getProp(experimentId, entitiesTypeKey, fieldName, value) {
  const entitiesTypesData = await this.getEntitiesType(experimentId, entitiesTypeKey);
  const propertiesKeysOfEntityTypes = entitiesTypesData[0].custom.data.properties.filter(
      (e) => e[fieldName] == value //for example: inheritable == true OR type == 'location'
  ).map(e => e.key);
  return propertiesKeysOfEntityTypes;
}
}

module.exports = Trial;
