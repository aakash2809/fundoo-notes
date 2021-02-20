const express = require('express');
const swaggerUi = require('swagger-ui-express');
const dbconnection = require('./config/database.config');
const envConfig = require('./config/index');
const userRoute = require('./app/routes/user');
const noteRoute = require('./app/routes/note');
const labelRoute = require('./app/routes/label');
const swaggerDocument = require('./app/lib/swagger.json');
const app = express();
require("dotenv").config();
require("./config/index").set(process.env.NODE_ENV, app);
const config = require("./config/index").get();
const PORT = config.port;

// parse requests 
app.use(express.urlencoded({ extended: true }));

// parse requests of content-type - application/json 
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// listen for request
app.listen(PORT, () => {
  console.log(`CONNECT_SERVER: Connected, server started listening on port : ${PORT}`);
});

new dbconnection(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).connect();

//Initialize the route
userRoute.routeToUserController(app);
noteRoute.routeToNoteController(app);
labelRoute.routeToLabelController(app);
module.exports = app;
