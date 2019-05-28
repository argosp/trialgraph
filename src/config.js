const dotenv = require('dotenv');

// const envPath = `${process.cwd()}/production/src/graphql/src/.env`;
const envPath = `${process.cwd()}/src/.env`;
console.log(envPath)
// console.log(envPath);
dotenv.config({
  path: envPath
});

module.exports = {
  port: process.env.PORT,
  rootUri: process.env.ROOT_URI,
  token: process.env.ROOT_TOKEN,
  devicesProjectId: process.env.DEVICES_PROJECT_ID
};