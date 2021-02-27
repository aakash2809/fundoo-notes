/**
 * @module       controllers
 * @description  controllers is reponsible to accept request and send the response
 *               Controller resolve the error using the service layer by invoking its services
 * @requires    
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>
 * @since       
-----------------------------------------------------------------------------------------------*/

const logger = require("../../config/logger");
const userServices = require("../services/user");
const userValidator = require("../middlewares/userValidator");
const resposnsCode = require("../../util/staticFile.json");
const helper = require("../middlewares/helper");

class UserControllers {
  /**
   * @description add user to database
   * @param {*} request in json formate
   * @param {*} response sends response from server
   */
  register = (request, response) => {
    logger.info(`TRACKED_PATH: Inside controller`);
    let validatedRequestResult = userValidator.validate(request.body);
    if (validatedRequestResult.error) {
      logger.error(`SCHEMAERROR: Request did not match with schema`);
      response.send({
        success: false,
        status_code: resposnsCode.BAD_REQUEST,
        message: validatedRequestResult.error.details[0].message,
      });
      return;
    }

    const registrationDetails = {
      name: request.body.name,
      email: request.body.email,
      password: request.body.password,
      confirmPassword: request.body.confirmPassword,
    };

    if (request.body.password != request.body.confirmPassword) {
      response.send({
        success: false,
        status_code: resposnsCode.BAD_REQUEST,
        message: "password does not match with confirm password",
      });
      return;
    }

    logger.info(`INVOKING: registerUser method of services`);
    userServices.registerUser(
      registrationDetails,
      (error, registrationResult) => {
        error
          ? response.send({
            success: false,
            status_code: resposnsCode.BAD_REQUEST,
            message: error,
          })
          : response.send({
            success: true,
            status_code: resposnsCode.SUCCESS,
            message: "Registered successfully",
            data: registrationResult,
          });
        logger.info("SUCCESS001: User registered successfully");
      }
    );
  };

  /**
   * @description login to database
   * @param {*} request
   * @param {*} response
   */
  login = (request, response) => {
    logger.info(`TRACKED_PATH: Inside controller`);
    var start = new Date();
    const loginDetails = {
      email: request.body.email,
      password: request.body.password,
    };
    logger.info(
      `INVOKING: getLoginCredentialAndCallForValidation method of login services`
    );
    userServices.validateAndLogin(
      loginDetails,
      (error, loginResult) => {
        error
          ? response.send({
            success: error.success,
            statusCode: error.statusCode,
            message: error.message,
          })
          : response.send({
            success: loginResult.success,
            statusCode: loginResult.statusCode,
            message: loginResult.message,
            token: loginResult.data,
          });
      }
    );
    console.log('Request took:', new Date() - start, 'ms');
  };

  /**
   * @description forgot password
   * @param {*} request
   * @param {*} response
   */
  forgotPassword = (request, response) => {
    const { email } = request.body;
    logger.info(`INVOKING: getEmail method of login services`);
    userServices.getEmail({ email }, (error, result) => {
      error
        ? response.send({
          success: false,
          statusCode: resposnsCode.INTERNAL_SERVER_ERROR,
          message: "internal server error",
        })
        : response.send({
          success: true,
          statusCode: result.status,
          message: result.message,
          data: result.data,
        });
    });
  };

  /**
   * @description reset password
   * @param {*} request
   * @param {*} response
   */
  restPassword = (request, response) => {
    var newPassword = request.body;
    userServices.resetPass(newPassword, (error, result) => {
      error
        ? response.send({
          success: false,
          statusCode: resposnsCode.BAD_REQUEST,
          message: error,
        })
        : response.send({
          success: true,
          status_code: resposnsCode.SUCCESS,
          message: result,
        });
    });
  };


  signUp = (request, response) => {
    logger.info(`TRACKED_PATH: Inside controller`);

    let validatedRequestResult = userValidator.validate(request.body);
    if (validatedRequestResult.error) {
      logger.error(`SCHEMAERROR: Request did not match with schema`);
      response.send({
        success: false,
        status_code: resposnsCode.BAD_REQUEST,
        message: validatedRequestResult.error.details[0].message,
      });
      return;
    }

    const signUpDetail = {
      name: request.body.name,
      email: request.body.email,
      password: request.body.password,
      confirmPassword: request.body.confirmPassword,
    };

    if (request.body.password != request.body.confirmPassword) {
      response.send({
        success: false,
        status_code: resposnsCode.BAD_REQUEST,
        message: "password does not match with confirm password",
      });
      return;
    }

    logger.info(`INVOKING: registerUser method of services`);
    console.log("controller:", signUpDetail);
    userServices.signUpUser(
      signUpDetail,
      (error, registrationResult) => {
        error
          ? response.send({
            success: error.success,
            status_code: error.statusCode,
            message: error.message,
          })
          : response.send({
            success: registrationResult.success,
            status_code: registrationResult.statusCode,
            message: registrationResult.message,
            token: registrationResult.data,
          });
        logger.info("SUCCESS001: User registered successfully");
      }
    );


  }

  /**
     * @description Verify email account
     * @param {*} request
     * @param {*} response
     */
  activateAccount = (request, response) => {
    logger.info(`INVOKING: getEmail method of login services`);
    userServices.verifyEmail(request, (error, result) => {
      error
        ? response.send({
          success: error.success,
          status_code: error.statusCode,
          message: error.message,
        })
        : response.send({
          success: result.success,
          statusCode: result.statusCode,
          message: result.message
        });
    });
  };


}

module.exports = new UserControllers();
