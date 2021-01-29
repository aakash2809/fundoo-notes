
require(`dotenv`).config();
const dbconnection = require('./config/database.config');
const express      = require('express')
const app          = express();
const PORT         = process.env.PORT || 3000;
const route        = require(`./app/routes/userRegistration.route`);
const swaggerUi    = require('swagger-ui-express');
const swaggerDocument = require('./app/lib/swagger.json');

//parse requests 
app.use(express.urlencoded({ extended: true }));

//parse requests of content-type - application/json
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//listen for request
app.listen(PORT, () => {
    console.log(`CONNECT_SERVER: Connected, server started listening on port : ${PORT}`);
  });

  new dbconnection(process.env.MONGODB_URL,{useNewUrlParser: true},{ useUnifiedTopology: true }).connect();

//Initialize the route
route.routeToController(app);