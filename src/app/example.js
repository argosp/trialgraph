module.exports = `
# 	{
#     experiments{
#       id
#       name
#     }
# 	}

# 	{
#     entities {
#       id
#       name
#       type
#       properties{
#           key
#           val
#        }
#     }
# 	}

# {
#    trials(experimentId: "5f8e944bed482662174a21ff",trialSetKey:"0962fe6a-5c4e-4c5f-a8b0-e8352859682c"){
#     properties{
#       key
#        val
#     }
#      name 
#    }
#}


    
#   mutation {
#     register(input: {name:"test",username:"test", email: "test11@linnovate.net", password:"newstart11", confirmPassword:"newstart11"}){
#      token
#      uid
#    }
#   }

#  mutation {
#    login(email:"admin1@linnovate.net", password:"newstart"){
#      token
#      uid
#    }
#  }
 
#  mutation {
#    addUpdateEntitiesTypes(
#        uid: "1f596b40-77c4-11e9-84ec-4b23f2be1633",
#        id: "device1",
#        name: "device1",
#        type: "thermometer",
#      properties: [{key: "heat degrees", val: "12"}]
#        ) {
#            id
#            name
#            type
#            properties{
#                key
#                val
#             }
#        }
#    }
 
# mutation updateTrialContainsEntities {
  #     updateTrialContainsEntities(
  #       uid:"ffce-11e9-9865-5d15a8cc481c"
  #       experimentId: "60ee9c4dad6cb1431c543bc6"
  #       key: "4d08cc4e-df9d-420d-9d00-b6f620c4f802"
  #       parentEntityKey: "42c6e5fa-c802-49d1-b6d7-e5d3cc60d5ec"
  #       action:"delete"
  #       entity: {
  #            key:"fcfeab97-6bcc-4885-8d06-e5e140ee81c4",
  #           entitiesTypeKey:"242ac170-4125-4a41-b063-9ad5017ed921",
  #           properties:[{key:"ab12460b-e1e7-4608-a9a7-2b2009b2b3df",val:null}]
  #       }
                
  #     ) {
  #       entities{
  #         containsEntities
  # 				key
  #       }
  #     }
  #   }
    
#  For update all trial properties:
#  set all the field except the action field,
#  If a field not set it will be null.
#
#  For update only certain properties:
#  set the action to "update"
#  and set only the properties you want to update
#  note: if you want to update an array you must set the key of the object.
#  required fields:
#  - uid
#  - key
#  - experimentId
#  - trialSetKey
#
#  mutation {
#    addUpdateTrial(
#        uid: "1f596b40-77c4-11e9-84ec-4b23f2be1633",
#        id: "trial1",
#        name: "trial1",
#        key: "57e93bbc-f0e7-4b58-8c7d-c8cdb2223edf"
#        experimentId: "5cea62e70e6784000a0da8cd"
#        status: "design"
#        trialSetKey: "a9b6de2b-4cd8-4c7f-9e45-b3900c75cc4a"
#        numberOfEntities: 0
#        properties: [
#          { key: "276b14ba-03b1-404a-aca5-79293d2e3e45", val: "jjj" }
#          { key: "591aaec4-c1d9-47fb-9110-c595920332e2", val: "ff" }
#        ]
#        entities: [
#          {
#            key: "7e481d14-07e5-4ae7-b883-15791fd34e7f"
#            typeKey: "9505c950-e8c6-4e02-ab01-549ac881a883"
#            type: "device"
#            properties: [
#              {
#                key: "14b02077-d036-4e39-a7db-f3eee7582965"
#                val: "{\"name\":\"OSMMap\",\"coordinates\":[\"1\",\"2\"]}"
#              }
#              {
#                key: "29afa5b1-a140-4a3d-ab48-fbe65d8e58c4"
#                val: "llllllllllllllllll"
#              }
#            ]
#          }
#        ]
#        deployedEntities: []
#      ) {
#        key
#        created
#        status
#        id
#        name
#        trialSetKey
#        numberOfEntities
#        state
#        properties {
#          key
#          val
#        }
#        entities {
#          key
#          typeKey
#          type
#          properties {
#            key
#            val
#          }
#        }
#        deployedEntities {
#          key
#          typeKey
#          type
#          properties {
#            key
#            val
#          }
#        }
#      }
#    }

#  Example For update only certain properties:

#  mutation {
#    addUpdateTrial(
#        action: "update",
#        uid: "1f596b40-77c4-11e9-84ec-4b23f2be1633",
#        key: "57e93bbc-f0e7-4b58-8c7d-c8cdb2223edf"
#        experimentId: "5cea62e70e6784000a0da8cd"
#        trialSetKey: "a9b6de2b-4cd8-4c7f-9e45-b3900c75cc4a"
#        properties: [
#          { key: "276b14ba-03b1-404a-aca5-79293d2e3e45", val: "jjj" }
#        ]
#        entities: [
#          {
#            key: "7e481d14-07e5-4ae7-b883-15791fd34e7f"
#            properties: [
#              {
#                key: "14b02077-d036-4e39-a7db-f3eee7582965"
#                val: "{\"name\":\"OSMMap\",\"coordinates\":[\"1\",\"2\"]}"
#              }
#            ]
#          }
#        ]
#      ) {
#        key
#        created
#        status
#        id
#        name
#        trialSetKey
#        numberOfEntities
#        state
#        properties {
#          key
#          val
#        }
#        entities {
#          key
#          typeKey
#          type
#          properties {
#            key
#            val
#          }
#        }
#        deployedEntities {
#          key
#          typeKey
#          type
#          properties {
#            key
#            val
#          }
#        }
#      }
#    }
  
`;
