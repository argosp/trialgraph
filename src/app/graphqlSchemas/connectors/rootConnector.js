const request = require('async-request');
const axios = require('axios');
const config = require('../../../config');

class RootConnector {
  constructor(token) {
    this.token = token;
  }

  async register(name, username, email, password, confirmPassword) {
    try {
      const url = `${config.rootUri}/api/register`;
      const options = { method: 'POST', data: { name, username, email, password, confirmPassword } };
      const result = await request(url, options);

      let token;
      try {
        if (typeof result.body === 'string') token = JSON.parse(result.body).token;
      } catch (err) {
        return Promise.reject(new Error('registration failed'));
      }

      let uid;
      try {
        uid = await this.getUid(token);
      } catch (err) {
        return Promise.reject(err);
      }

      return {
        token,
        uid,
      };
    } catch (error) {
      error = JSON.parse(error);
      return new Error(error);
    }
  }

  async login(email, password) {
    try {
      let url; let options; let
        result;
      url = `${config.rootUri}/api/login`;
      options = { method: 'POST', data: { email, password } };
      result = await request(url, options);

      let token;
      try {
        if (typeof result.body === 'string') token = JSON.parse(result.body).token;
      } catch (err) {
        return Promise.reject(new Error('registration failed'));
      }

      let uid;
      try {
        uid = await this.getUid(token);
      } catch (err) {
        return Promise.reject(err);
      }

      return {
        token,
        uid,
      };
    } catch (error) {
      return new Error(error);
    }
  }

  async getTasksFromExperiment(experimentId, filter) {
    if (this.token === null || this.token === undefined) return Promise.reject(new Error('unauthorized'));
    const url = `${config.rootUri}/api/projects/${experimentId}/tasks`;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
    };
    const result = await axios(url, options);
    let data;
    const error = new Error('Ooops. Something went wrong and we coudnt fetch the data');

    try {
      data = result.data;
    } catch (err) {
      return Promise.reject(error);
    }
    if (data == null || !Array.isArray(data)) {
      return Promise.reject(error);
    }

    return filter ? data.filter(filter) : data;
  }

  async getTasks(filter) {
    try {
      if (this.token === null || this.token === undefined) return Promise.reject(new Error('unauthorized'));
      const url = `${config.rootUri}/api/tasks`;
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      };
      const result = await request(url, options);
      const data = JSON.parse(result.body);
      if (data === null || data === undefined || !Array.isArray(data)) {
        return [{ error: 'Ooops. Something went wrong and we coudnt fetch the data' }];
      }
      return data.filter(filter);
    } catch (error) {
    }
  }

  async getAllProjects() {
    try {
      if (this.token === null || this.token === undefined) return Promise.reject(new Error('unauthorized'));
      const url = `${config.rootUri}/api/projects`;
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      };
      const result = await axios(url, options);
      const { data } = result;
      if (data === null || data === undefined || !Array.isArray(data)) {
        return [{ error: 'Ooops. Something went wrong and we coudnt fetch the data' }];
      }
      return data.filter(experiment => experiment.recycled === undefined);
    } catch (error) {
      error = JSON.parse(error);
      return new Error(error);
    }
  }

  async addUpdateProject(data, uid) {
    data.color = '0097A7';
    try {
      if (this.token === null || this.token === undefined) {
        return Promise.reject(new Error('unauthorized'));
      }
      const url = `${config.rootUri}/api/hook?entity=project&uid=${uid}`;
      const options = {
        method: 'POST',
        data,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      };
      const result = await axios(url, options);
      if (result === null || result === undefined) {
        return [{ error: `Ooops. Something went wrong while trying to addUpdate a ${data.type}` }];
      }
      return result;
    } catch (error) { }
  }

  async addUpdateTask(data, uid, experimentId) {
    try {
      if (this.token === null || this.token === undefined) {
        return Promise.reject(new Error('unauthorized'));
      }
      const url = `${config.rootUri}/api/hook?entity=task&uid=${uid}&project=${experimentId}`;
      const options = {
        method: 'POST',
        data,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      };
      const result = await axios(url, options);
      if (result === null || result === undefined) {
        return [{ error: `Ooops. Something went wrong while trying to addUpdate a ${data.type}` }];
      }
      return result;
    } catch (error) { }
  }

  async getUid(token) {
    const url = `${config.rootUri}/api/users/me`;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const result = await request(url, options);
    let uid;
    try {
      uid = JSON.parse(result.body).uid;
    } catch (err) {
      throw new Error('cannot get uid');
    }

    return uid;
  }
}

module.exports = RootConnector;
