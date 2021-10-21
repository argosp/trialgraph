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
  #           updateTrialContainsEntities(
  #             uid:"ffce-11e9-9865-5d15a8cc481c"
  #             experimentId: "60fffc76ad6cb104d8543fd7"
  #             key: "7fc9243f-0153-4d6e-8add-633bda58a27e"
  #             parentEntityKey:"a39cc9f7-fa8c-440c-9231-24f3af81d021"
  #             action:"update"
  #            entity: {
  #             key: "57c65124-30f0-48ea-be3b-1150170891fd",
  #             properties: [
  #               {
  #                 key: "5dd5b984-6971-4db8-be07-4df5bc8b6b64",
  #                 val: ""
  #                      Some default child of parentA
  #                      "",
  #               },
  #               {
  #                 key: "b24723e4-af1b-41b1-8d6e-13d8514da76b",
  #                 val: null,
  #               },
  #             ],
  #             entitiesTypeKey: "be7ff051-e499-44b0-b29a-75c923987210",
  #           }            
  #           ) {
  #             entities{
  #               containsEntities
  #       				key
  #               properties{
  #                  val
  # 									key
  #               }
  #             }
  #           deployedEntities{
  #             containsEntities
  #             key
  #           }
  #          	status
  #           }
  #         }
    
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
