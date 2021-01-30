const userControllers = require(`../controllers/userControllers/user.controllers`);
//const userLogin = require('../controllers/userLogin.controller');
class Routes {
    routeToController = (app) => {
  
      //save new user registration
    app.post('/register', userControllers.addNewRegistration);
    app.post('/login', userControllers.login);
  
    }
  }
  
  module.exports = new Routes