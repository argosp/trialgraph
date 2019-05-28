const mongoose = require('mongoose');
const config = require('./config');
mongoose.connect(config.mongo.url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log(`open connection to ${config.mongo.url}`);
});
db.on('connected', function() {
  console.log(`connected connection to ${config.mongo.url}`);
});
db.on('disconnected', function (ref) {
  connected = false;
  console.log(`disconnected connection. to ${config.mongo.url}`);
});

module.exports = db;