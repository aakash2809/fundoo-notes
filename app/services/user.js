/**
 * @module         services
 * @file           userRegistration.services.js
 * @description    This file contain all the service  
 * @author         Aakash Rajak <aakashrajak2809@gmail.com>
       
------------------------------------------------------------------------------------------*/

const userModel = require('../models/user');
const logger = require("../../config/logger");
const jwtAuth = require("../middlewares/helper");
const bycrypt = require('bcryptjs');
const resposnsCode = require("../../util/staticFile.json");
const helper = require("../middlewares/helper");
const { any } = require('joi');
var response;

require(`dotenv`).config();

class userServices {
    extractObjectFromArray = (objectInArray) => {

        var returnObj = null;
        (objectInArray < 1) ? returnObj : returnObj = {
            name: objectInArray[0].name,
            _id: objectInArray[0]._id,
            password: objectInArray[0].password
        }
        return returnObj;
    }

    /**
     * @description save request data to database using model methods
     * @param {*} registrationData holds data to be saved in json formate
     * @param {*} callback holds a function 
    */
    registerUser = (registrationData, callback) => {
        logger.info(`TRACKED_PATH: Inside services`);
        userModel.register(registrationData, (error, registrationResult) => {
            (error) ? callback(error, null) : callback(null, registrationResult);
        })
    }

    signUpUser = (signUpData, callback) => {
        userModel.checkMailExistenceInDb(signUpData, (error, mailExistenceResult) => {
            if (error) {
                error = {
                    success: false,
                    statusCode: resposnsCode.INTERNAL_SERVER_ERROR,
                    message: `internal server error ${error}`
                }
                callback(error, null)
            } else if (mailExistenceResult[0] == null) {
                var token = jwtAuth.genrateTokenForSignUp(signUpData);
                jwtAuth.sendMail(signUpData, token, (error, mailVerificationLink) => {
                    if (error) {
                        error = {
                            success: false,
                            statusCode: resposnsCode.INTERNAL_SERVER_ERROR,
                            message: "jwt error"
                        }
                        callback(error, null);
                    } else {
                        mailExistenceResult = {
                            success: true,
                            message: "Email has been sent, kindly activate your account",
                            statusCode: resposnsCode.SUCCESS,
                            data: mailVerificationLink
                        }
                        callback(null, mailExistenceResult);
                    }
                })
            } else {
                error = {
                    success: false,
                    statusCode: resposnsCode.ALREADY_EXIST,
                    message: "mail already exist"
                }
                callback(error, null)
            }
        })
    }


    /**
       * @description validate credentials and return result accordingly to database using model methods
       * @param {*} email 
       * @param {*}  callback callback funcntion
       */
    verifyEmail = (request, callback) => {
        const encodedBody = helper.getEncodedBodyFromHeader(request);
        userModel.checkMailExistenceInDb(encodedBody, (error, result) => {
            if (error) {
                error = {
                    success: false,
                    statusCode: resposnsCode.INTERNAL_SERVER_ERROR,
                    message: `internal server error ${error}`
                }
                callback(error, null);
            } else if (mailExistenceResult[0] == null) {
                result = {
                    success: false,
                    statusCode: resposnsCode.ALREADY_EXIST,
                    message: `email id already exist`
                }
                callback(null, result);
            } else {
                userModel.updateActivationStatus(encodedBody, (error, registrationResult) => {
                    if (error) {
                        error = {
                            success: false,
                            statusCode: resposnsCode.INTERNAL_SERVER_ERROR,
                            message: `internal server error ${error}`
                        }
                        callback(error, null)
                    }
                    else {
                        registrationResult = {
                            success: true,
                            statusCode: resposnsCode.SUCCESS,
                            message: `registered successfully`
                        }
                        callback(null, registrationResult);
                    };
                })
            }
        })
    }

    /**
     * @description validate credentials and return result accordingly to database using model methods
     * @param {*} loginCredentials holds data to be saved in json formate
     * @param {*} callback holds a function 
    */
    validateAndLogin = (loginCredentials, callback) => {
        const email = loginCredentials.email;
        const KEY = `LOGIN_${email}`
        logger.info(`TRACKED_PATH: Inside services`);
        helper.getResponseFromRedis(KEY, (error, dataFromRedis) => {
            if (error) {
                error = {
                    success: false,
                    statusCode: resposnsCode.INTERNAL_SERVER_ERROR,
                    message: error
                }
                callback(error, null)
            } else if (!dataFromRedis) {
                userModel.getDetailOfGivenEmailId(loginCredentials, (error, loginResult) => {
                    loginResult = this.extractObjectFromArray(loginResult);
                    if (error) {
                        error = {
                            success: false,
                            statusCode: resposnsCode.INTERNAL_SERVER_ERROR,
                            message: error
                        }
                        callback(error, null)
                    }
                    else if (loginResult == null) {
                        loginResult = {
                            success: false,
                            statusCode: resposnsCode.NOT_FOUND,
                            message: "email id does not exist"
                        }
                        callback(null, loginResult);
                    } else {
                        bycrypt.compare(loginCredentials.password, loginResult.password, (error, result) => {
                            if (error) {
                                error = {
                                    success: true,
                                    statusCode: resposnsCode.BAD_REQUEST,
                                    message: 'Invalid password'
                                }
                                callback(error, null);
                            }
                            else if (result) {
                                var token = jwtAuth.genrateToken(loginResult);
                                loginResult = {
                                    success: true,
                                    statusCode: resposnsCode.SUCCESS,
                                    message: 'login successfull',
                                    data: token
                                }
                                logger.info(` token genrated: ${token}`);
                                helper.setDataToRedis(KEY, loginResult),
                                    console.log("response comming from mongodb");
                                callback(null, loginResult);
                            } else {
                                error = {
                                    success: false,
                                    statusCode: resposnsCode.BAD_REQUEST,
                                    message: 'Invalid password',
                                }
                                callback(error, null);
                            }
                        });
                    }
                });
            } else {
                console.log("response comming from redis");
                dataFromRedis = {
                    success: true,
                    statusCode: resposnsCode.SUCCESS,
                    message: 'login successfull',
                    data: dataFromRedis.data
                }
                callback(null, dataFromRedis);
            }
        })
    }

    /**
     * @description validate credentials and return result accordingly to database using model methods
     * @param {*} email 
     * @param {*}  callback callback funcntion
     */
    getEmail = (email, callback) => {
        logger.info(`TRACKED_PATH: Inside services getEmail`);
        userModel.forgetPassword(email, (error, result) => {
            if (error) {
                callback(error, null);
            }
            else if (result.length < 1) {
                result = { message: "User with this email id does not exist", status: resposnsCode.NOT_FOUND, data: null }
                callback(null, result);
            }
            else {
                result = result[0];
                var token = jwtAuth.genrateToken(result);
                jwtAuth.sendMail(result, token, (error, resetPasswordLink) => {
                    if (error) {
                        callback(error, null);
                    } else {
                        result = { data: resetPasswordLink, message: "token genrated and mail successfully sent", status: resposnsCode.SUCCESS };
                        callback(null, result);
                    }
                })
            }
        })
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
        })
    }

    saveJwtResponse = (responseData) => {
        console.log("jwt save", responseData);
        response = responseData;
    }

    jwt = async (result, token) => {
        try {

            return await jwtAuth.sendMail(result, token, (error, resetPasswordLink) => {
                console.log(resetPasswordLink);
                if (error) {
                    return jwtResponse = {
                        success: false,
                        statusCode: resposnsCode.SUCCESS,
                        message: 'jwt error',
                    }
                    //this.saveJwtResponse(jwtResponse);
                } else {
                    jwtResponse = {
                        success: true,
                        statusCode: resposnsCode.SUCCESS,
                        message: 'token genrated and mail successfully sent',
                        data: resetPasswordLink
                    }
                    console.log(jwtResponse);
                    // this.saveJwtResponse(jwtResponse);
                    return jwtResponse;
                }
            })
        } catch (error) {
            return error;
        }
    }


    sendVerificationLinkToUser = async (email) => {
        try {
            console.log(email);
            const result = await userModel.checkEmailExistenceInDb(email);
            console.log(result);
            let responseResult = "";
            if (result[0] == null) {
                responseResult = {
                    success: false,
                    statusCode: resposnsCode.NOT_FOUND,
                    message: `user does not exist with ${email} you need to register first`
                }
                return responseResult;
            } else {
                if (result[0].isActivated == false) {
                    var token = jwtAuth.genrateTokenForSignUp(result[0]);

                    var re = await this.jwt(result[0], token);
                    console.log(re);
                    return re;
                } else {
                    return responseResult = {
                        success: true,
                        statusCode: resposnsCode.ALREADY_EXIST,
                        message: 'email is already verified'
                    }
                }
            }
        } catch (error) {
            return error;
        }
    }

}

module.exports = new userServices