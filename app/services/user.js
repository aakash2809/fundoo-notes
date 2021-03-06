/**
 * @module         services
 * @file           userRegistration.services.js
 * @description    This file contain all the service
 * @author         Aakash Rajak <aakashrajak2809@gmail.com>

------------------------------------------------------------------------------------------*/

const bycrypt = require('bcryptjs');
const EventEmitter = require('events');
const userModel = require('../models/user');
const logger = require('../../config/logger');
const jwtAuth = require('../middlewares/helper');
const resposnsCode = require('../../util/staticFile.json');
const helper = require('../middlewares/helper');
const publish = require('../middlewares/publisher');
const consume = require('../middlewares/consumer');

const emmiter = new EventEmitter();

emmiter.on('publish', (result, token) => {
  publish.getMessage(result, token);
});

emmiter.on('consume', (callback) => {
  consume.consumeMessage(callback);
});

class UserServices {
  /**
    * @description extract json object from array
    * @param {*} objectInArray holds data having the array
    */
  extractObjectFromArray = (objectInArray) => {
    let returnObj = null;
    (objectInArray < 1) ? returnObj : returnObj = {
      name: objectInArray[0].name,
      _id: objectInArray[0]._id,
      password: objectInArray[0].password,
    };
    return returnObj;
  }

  /**
   * @description save request data to database using model methods
   * @param {*} registrationData holds data to be saved in json formate
   * @param {*} callback holds a function
  */
  registerUser = (registrationData, callback) => {
    logger.info('TRACKED_PATH: Inside services');
    userModel.register(registrationData, async (error, registrationResult) => {
      if (error) {
        callback(error, null);
      } else {
        const verificationResponse = await this.sendVerificationLinkToUser(registrationResult.email);
        callback(null, verificationResponse);
      }
    });
  }

  /**
   * @description save request data to database using model methods
   * @param {*} email holds email id to which need to activate
  */
  sendVerificationLinkToUser = async (email) => {
    try {
      const result = await userModel.checkEmailExistenceInDb(email);
      let responseResult = '';
      if (result[0] == null) {
        responseResult = {
          success: false,
          statusCode: resposnsCode.NOT_FOUND,
          message: `user does not exist with ${email} you need to register first`,
        };
        return responseResult;
      }
      if (result[0].isActivated == false) {
        const token = jwtAuth.genrateTokenForSignUp(result[0]);
        try {
          const mailRespnse = await helper.sendMailToActivateAccount(result[0], token);
          responseResult = {
            success: true,
            statusCode: resposnsCode.SUCCESS,
            message: 'mail sent successfully to given email id',
            data: mailRespnse,
          };
          return responseResult;
        } catch (error) {
          const responseError = {
            success: false,
            statusCode: resposnsCode.INTERNAL_SERVER_ERROR,
            message: error,
          };
          return responseError;
        }
      } else {
        return responseResult = {
          success: false,
          statusCode: resposnsCode.ALREADY_EXIST,
          message: 'email is already verified',
        };
      }
    } catch (error) {
      return error;
    }
  }

  /**
     * @description validate credentials and return result accordingly to database using model methods
     * @param {*}   email
     * @param {*}   callback callback funcntion
     */
  verifyAndAtivateAccount = (request, callback) => {
    const encodedBody = helper.getEncodedBodyFromHeader(request);
    userModel.checkMailExistenceInDb(encodedBody, (error, result) => {
      if (error) {
        error = {
          success: false,
          statusCode: resposnsCode.INTERNAL_SERVER_ERROR,
          message: `internal server error ${error}`,
        };
        callback(error, null);
      } else if (result[0] == null) {
        result = {
          success: false,
          statusCode: resposnsCode.ALREADY_EXIST,
          message: 'email does not exist you need to register first',
        };
        callback(null, result);
      } else {
        userModel.updateActivationStatus(encodedBody, (error, registrationResult) => {
          if (error) {
            error = {
              success: false,
              statusCode: resposnsCode.INTERNAL_SERVER_ERROR,
              message: `internal server error ${error}`,
            };
            callback(error, null);
          } else {
            logger.info('verified successfully');
            registrationResult = {
              success: true,
              statusCode: resposnsCode.SUCCESS,
              message: 'verified successfully',
            };
            callback(null, registrationResult);
          }
        });
      }
    });
  }

  /**
   * @description validate credentials and return result accordingly to database using model methods
   * @param {*} loginCredentials holds data to be saved in json formate
   * @param {*} callback holds a function
  */
  validateAndLogin = (loginCredentials, callback) => {
    const { email } = loginCredentials;
    const KEY = `LOGIN_${email}`;
    logger.info('TRACKED_PATH: Inside services');
    helper.getResponseFromRedis(KEY, (error, dataFromRedis) => {
      if (error) {
        error = {
          success: false,
          statusCode: resposnsCode.INTERNAL_SERVER_ERROR,
          message: error,
        };
        callback(error, null);
      } else if (!dataFromRedis) {
        userModel.getDetailOfGivenEmailId(loginCredentials, (error, loginResult) => {
          let loginFilteredResult = this.extractObjectFromArray(loginResult);
          if (error) {
            error = {
              success: false,
              statusCode: resposnsCode.INTERNAL_SERVER_ERROR,
              message: error,
            };
            callback(error, null);
          } else if (loginFilteredResult == null) {
            loginFilteredResult = {
              success: false,
              statusCode: resposnsCode.NOT_FOUND,
              message: 'email id does not exist',
            };
            callback(null, loginFilteredResult);
          } else {
            bycrypt.compare(loginCredentials.password, loginFilteredResult.password, (error, result) => {
              if (error) {
                error = {
                  success: false,
                  statusCode: resposnsCode.BAD_REQUEST,
                  message: 'Invalid password',
                };
                callback(error, null);
              } else if (result) {
                const token = jwtAuth.genrateToken(loginFilteredResult);
                logger.info(` token genrated: ${token}`);
                loginFilteredResult = {
                  success: true,
                  statusCode: resposnsCode.SUCCESS,
                  message: 'login successfull',
                  data: token,
                  user: loginResult,
                };

                helper.setDataToRedis(KEY, loginFilteredResult),
                  logger.info('response comming from mongodb');
                callback(null, loginFilteredResult);
              } else {
                error = {
                  success: false,
                  statusCode: resposnsCode.BAD_REQUEST,
                  message: 'Invalid password',
                };
                callback(error, null);
              }
            });
          }
        });
      } else {
        logger.info('response comming from redis');
        dataFromRedis = {
          success: true,
          statusCode: resposnsCode.SUCCESS,
          message: 'login successfull',
          data: dataFromRedis.data,
        };
        callback(null, dataFromRedis);
      }
    });
  }

  /**
   * @description validate credentials and return result accordingly to database using model methods
   * @param {*} email
   * @param {*}  callback callback funcntion
   */
  getEmail = (email, callback) => {
    logger.info('TRACKED_PATH: Inside services getEmail');
    userModel.forgetPassword(email, (error, result) => {
      if (error) {
        callback(error, null);
      } else if (result.length < 1) {
        result = {
          message: 'User with this email id does not exist',
          status: resposnsCode.NOT_FOUND,
          data: null,
        };
        callback(null, result);
      } else {
        const extracteResult = result[0];
        const token = jwtAuth.genrateToken(extracteResult);
        emmiter.emit('publish', extracteResult, token);

        emmiter.emit('consume', (error, message) => {
          if (error) {
            logger.info('error after consuming');
            callback(
              new Error('Some error occurred while consuming message'),
              null,
            );
          } else {
            logger.info('mail sent sussefully');
            message = {
              data: message,
              message: 'token genrated and mail successfully sent',
              status: resposnsCode.SUCCESS,
            };
            callback(null, message);
          }
        });
      }
    });
  }

  /**
   * @description call the  of resetpassword fuction of model
   * @param {*} resetData having the user mail id and password to be reset
   * @param {*}  callback callback funcntion
   */
  resetPass = (resetData, callback) => {
    userModel.resetPassword(resetData, (error, result) => {
      (error)
        ? callback(error, null) : (
          this.validateAndLogin(resetData),
          callback(null, result));
    });
  }
}

module.exports = new UserServices();
