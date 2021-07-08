module.exports = `
# 	{
#     experiments{
#       id
#       name
#     }
# 	}

# 	{
#     devices {
#       id
#       name
#       type
#       properties{
#           key
#           val
#        }
#     }
# 	}


# 	{
#     trials(experimentId: "5cea62e70e6784000a0da8cd"){
#       id
#       name
#       begin
#       end
#       devices{
#           id
#           name
#           type
#           properties{
#               key
#               val
#            }
#        }
#     }
# 	}
    
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
#        numberOfDevices: 0
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
#        numberOfDevices
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
#        numberOfDevices
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
