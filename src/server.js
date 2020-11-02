const express = require('express');
const bodyParser = require('body-parser');
const { createServer } = require('http');
const graphql = require('./app');
const config = require('./config');
const cors = require('cors');
const app = express();
app.use(bodyParser.json({ limit: '100mb' }));
const httpServer = createServer(app);
const server = graphql.graphql(app);
//server.installSubscriptionHandlers(httpServer)
httpServer.listen({ port: config.port },() => {
    graphql.subscriptionServer(httpServer),
    console.log(`Apollo Server on http://localhost:${config.port}/graphql`);
});
app.use(express.static('uploads'));

//respond with json body for 404 status
app.use((req, res, next) => {
    res.status(404).json({
        error: 'not found'
    });
});


//respond with json body for internal errors
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: err.message
    });
    next(err);
});