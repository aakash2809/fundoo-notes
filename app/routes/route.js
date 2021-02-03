const userControllers = require(`../controllers/userControllers/user.controllers`);
class Routes {
    routeToController = (app) => {
  
      //save new user registration
    app.post('/register', userControllers.register);
    app.post('/login', userControllers.login);
    app.put('/forgotPassword', userControllers.forgotPassword);
    }
  }
  
  module.exports = new Routes