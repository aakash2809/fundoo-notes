const userControllers = require(`../controllers/userControllers/user`);
class Routes {
    routeToController = (app) => {
  
      //save new user registration
    app.post('/register', userControllers.register);
    app.post('/login', userControllers.login);
    app.post('/forgotPassword',userControllers.forgotPassword);
    app.put('/resetPassword',userControllers.restPassword);
    }
  }
  
  module.exports = new Routes