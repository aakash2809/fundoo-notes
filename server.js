const express = require('express');
const swaggerUi = require('swagger-ui-express');
const dbconnection = require('./config/database.config');
const userRoute = require('./app/routes/user');
const noteRoute = require('./app/routes/note');
const labelRoute = require('./app/routes/label');
const swaggerDocument = require('./app/lib/swagger.json');
const app = express();
require("dotenv").config();
require("./config/index").set(process.env.NODE_ENV, app);
const config = require("./config/index").get();
const cors = require('cors');
const logger = require("./config/logger");

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

new dbconnection(config.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).connect();

//Initialize the route
userRoute.routeToUserController(app);
noteRoute.routeToNoteController(app);
labelRoute.routeToLabelController(app);
module.exports = app;
