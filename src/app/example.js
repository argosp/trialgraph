module.exports =  `
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
#    addUpdateDevice(
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
 
#  mutation {
#    addUpdateTrial(
#        uid: "1f596b40-77c4-11e9-84ec-4b23f2be1633",
#        id: "trial1",
#        name: "trial1",
#        begin: "2019-05-26"
#        end: "2019-06-26",
#        experimentId: "5cea62e70e6784000a0da8cd"
#        devices: ["device1"]) {
#           id
#           name
#           begin
#           end
#           devices{
#               id
#               name
#               type
#               properties{
#                   key
#                   val
#                }
#            }
#        }
#    }
  
`;