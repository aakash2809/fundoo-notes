const userControllers = require(`../controllers/userControllers/user`);
const jwtAuth = require("../middlewares/JwtAuth");

class UserRoutes {
  routeToController = (app) => {
    app.post('/register', userControllers.register);
    app.post('/login', userControllers.login);
    app.post('/forgotPassword', userControllers.forgotPassword);
    app.put('/resetPassword', jwtAuth.verifyToken, userControllers.restPassword);
  }
}

module.exports = new UserRoutes