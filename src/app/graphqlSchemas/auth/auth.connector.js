const request = require('async-request');
const config = require('../../../config');
class AuthConnector {
    constructor(req){
        this.req = req
    }
    async register(name,username,email,password,confirmPassword){
        try{
            const url =  `${config.cbrootUri}/api/register`
            const options={ method: 'POST', data: { name, username, email, password, confirmPassword } }
            const result = await request(url, options);
            return JSON.parse(result.body);
        }catch(error){
            error = JSON.parse(error);
            return new Error(error);
        }
    }
    async login(email, password){
        try{
            let url, options, result;
            url = `${config.cbrootUri}/api/login`
            options={ method: 'POST', data: { email, password } }
            result = await request(url, options)
            if(result.body === 'Unauthorized') 
                return { error: 'Unauthorized'}
            const body = JSON.parse(result.body);

            url  = `${config.cbrootUri}/api/users/me`
            options = options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${body.token}`
                },
            }
            result = await request(url, options);
            const me = JSON.parse(result.body);
            body.uid = me.uid
            return {
                token: body.token,
                uid: me.uid
            }

        }catch(error){
            return new Error(error);
        }
    }
}
module.exports.AuthConnector = AuthConnector;