const userControllers = require(`../controllers/user`);
const helper = require("../middlewares/helper");

class UserRoutes {
  routeToUserController = (app) => {
    app.post("/register", userControllers.register);
    app.post("/login", helper.redisClientForLogin, userControllers.login);
    app.post("/forgotPassword", userControllers.forgotPassword);
    app.put(
      "/resetPassword",
      helper.verifyToken,
      userControllers.restPassword
    );
  };
}

module.exports = new UserRoutes();
