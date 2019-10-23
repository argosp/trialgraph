class Auth {
  constructor({ connector }) {
    this.connector = connector;
  }

  async register(name, username, email, password, confirmPassword) {
    return this.connector.register(name, username, email, password, confirmPassword);
  }

  async login(email, password) {
    return this.connector.login(email, password);
  }

  async getUser(uid) {
    return this.connector.getUser(uid);
  }
}

module.exports = Auth;
