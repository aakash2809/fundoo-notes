const userControllers = require(`../controllers/user`);
const jwtAuth = require("../middlewares/JwtAuth");

class UserRoutes {
  routeToUserController = (app) => {
    app.post("/register", userControllers.register);
    app.post("/login", userControllers.login);
    app.post("/forgotPassword", userControllers.forgotPassword);
    app.put(
      "/resetPassword",
      jwtAuth.verifyToken,
      userControllers.restPassword
    );
  };
}

module.exports = new UserRoutes();
