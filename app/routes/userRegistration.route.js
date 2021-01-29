const userRegistration = require(`../controllers/userRegistration.controllers`);
class Routes {
    routeToController = (app) => {
  
      //save new user registration
    app.post('/register', userRegistration.addNewRegistration);
  
    }
  }
  
  module.exports = new Routes