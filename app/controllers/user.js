/**
 * @module       controllers
 * @description  controllers is reponsible to accept request and send the response
 *               Controller resolve the error using the service layer by invoking its services
 * @requires
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>
-----------------------------------------------------------------------------------------------*/

const logger = require('../../config/logger');
const userServices = require('../services/user');
const Validator = require('../middlewares/inputValiation');
const resposnsCode = require('../../util/staticFile.json');

class UserControllers {
  /**
   * @description add user to database
   * @param {*} request in json formate
   * @param {*} response sends response from server
   */
  register = (request, response) => {
    logger.info('TRACKED_PATH: Inside controller');
    const validatedRequestResult = Validator.validateUser(request.body);
    if (validatedRequestResult.error) {
      logger.error('SCHEMAERROR: Request did not match with schema');
      response.send({
        success: false,
        status_code: resposnsCode.BAD_REQUEST,
        message: validatedRequestResult.error.details[0].message,
      });
      return;
    }

    const registrationDetails = {
      name: request.body.name,
      lastName: request.body.lastName,
      email: request.body.email,
      password: request.body.password,
      confirmPassword: request.body.confirmPassword,
    };

    if (request.body.password != request.body.confirmPassword) {
      response.send({
        success: false,
        status_code: resposnsCode.BAD_REQUEST,
        message: 'password does not match with confirm password',
      });
      return;
    }

    logger.info('INVOKING: registerUser method of services');
    userServices.registerUser(
      registrationDetails,
      (error, registrationResult) => {
        error
          ? (logger.error(error), response.send({
            success: false,
            status_code: resposnsCode.BAD_REQUEST,
            message: error,
          }))
          : (logger.info('SUCCESS001: User registered successfully'), response.send({
            success: registrationResult.success,
            status_code: registrationResult.statusCode,
            message: registrationResult.message,
            data: registrationResult.data,
          }));
      },
    );
  };

  /**
   * @description login to database
   * @param {*} request
   * @param {*} response
   */
  login = (request, response) => {
    logger.info('TRACKED_PATH: Inside controller');
    const start = new Date();
    const loginDetails = {
      email: request.body.email,
      password: request.body.password,
    };
    logger.info(
      'INVOKING: getLoginCredentialAndCallForValidation method of login services',
    );
    userServices.validateAndLogin(
      loginDetails,
      (error, loginResult) => {
        error
          ? (logger.error('getting error in login', error.message), response.send({
            success: error.success,
            statusCode: error.statusCode,
            message: error.message,
          }))
          : (logger.info(loginResult.message), response.send({
            success: loginResult.success,
            statusCode: loginResult.statusCode,
            message: loginResult.message,
            token: loginResult.data,
          }));
      },
    );
    logger.info('Request took:', new Date() - start, 'ms');
  };

  /**
   * @description forgot password
   * @param {*} request
   * @param {*} response
   */
  forgotPassword = (request, response) => {
    const { email } = request.body;
    logger.info('INVOKING: getEmail method of login services');
    userServices.getEmail({ email }, (error, result) => {
      try {
        if (error) {
          logger.error(`getting error ${error}`);
          return response.send({
            success: false,
            statusCode: resposnsCode.INTERNAL_SERVER_ERROR,
            message: 'internal server error',
          });
        }
        logger.info(result.message);
        return response.send({
          success: true,
          statusCode: result.status,
          message: result.message,
          data: result.data,
        });
      } catch (error) {
        logger.error(`getting error ${error}`);
        return error;
      }
    });
  };

  /**
   * @description reset password
   * @param {*} request will contain new password to be updated
   * @param {*} response give response after updating password
   */
  restPassword = (request, response) => userServices.resetPass(request.body, (error, result) => {
    error
      ? (logger.error(error), response.send({
        success: false,
        statusCode: resposnsCode.BAD_REQUEST,
        message: error,
      }))
      : (logger.info(result.message), response.send({
        success: true,
        status_code: resposnsCode.SUCCESS,
        message: result,
      }));
  });

  /**
    * @description activate email account
    * @param {*} request
    * @param {*} response
    */
  activateAccount = (request, response) => {
    logger.info('INVOKING: getEmail method of login services');
    userServices.verifyAndAtivateAccount(request, (error, result) => {
      error
        ? (logger.error('error in activation mail', error.message), response.send({
          success: error.success,
          status_code: error.statusCode,
          message: error.message,
        }))
        : (logger.info(result.message), response.send({
          success: result.success,
          statusCode: result.statusCode,
          message: result.message,
          data: result.data,
        }));
    });
  };
}

module.exports = new UserControllers();
