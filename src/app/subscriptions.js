const PubSub = require('graphql-subscriptions').PubSub;
const DEVICES_UPDATED = 'DEVICES_UPDATED';
const TRIALS_UPDATED = 'TRIALS_UPDATED';
module.exports = { pubsub: new PubSub(), DEVICES_UPDATED, TRIALS_UPDATED }
