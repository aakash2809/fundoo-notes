/**
* @file          server.js
* @description   This file is an entry point for application
* @requires      {@link https://www.npmjs.com/package/swagger-ui-express|swaggerUi}
* @requires      {@link https://expressjs.com/|express }
* @requires      routes        is a reference to initialize route
* @requires      config       is a reference to get connection with configuration
* @requires      logger       is a reference to save logs in log files
* @author        Aakash Rajak <aakashrajak2809@gmail.com>
*--------------------------------------------------------------------------------------*/

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const Dbconnection = require('./config/database.config');
const swaggerDocument = require('./app/lib/swagger.json');

const app = express();
require('dotenv').config();
require('./config/index').set(process.env.NODE_ENV, app);
const config = require('./config/index').get();

const logger = require('./config/logger');
const route = require('./app/route');

app.use(cors());

// parse requests
app.use(express.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// listen for request
app.listen(config.port, () => {
  logger.info(`CONNECT_SERVER: Connected, server started listening on port : ${config.port}`);
});

new Dbconnection(config.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).connect();

// Initialize the route
route.routeToControllers(app);

module.exports = app;
