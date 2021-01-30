const userRegistration = require(`../controllers/userRegistration.controllers`);
const userLogin = require('../controllers/userLogin.controller');
class Routes {
    routeToController = (app) => {
  
      //save new user registration
    app.post('/register', userRegistration.addNewRegistration);
    app.post('/login', userLogin.login);
  
    }
  }
  
  module.exports = new Routes