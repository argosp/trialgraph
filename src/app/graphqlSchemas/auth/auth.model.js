class Auth {
    constructor({ connector }) {
        this.connector = connector
    }
    async register(name, username, email, password, confirmPassword) {
        const result = await this.connector.register(name, username, email, password, confirmPassword)
        return result;
    }
    async login(email, password) {
        const result = await this.connector.login(email, password)
        return result;
    }
}

module.exports = Auth;
