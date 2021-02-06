/**
 * @module         services
 * @file           userRegistration.services.js
 * @description    This file contain all the service  
 * @author         Aakash Rajak <aakashrajak2809@gmail.com>
       
------------------------------------------------------------------------------------------*/

const userModel = require('../../models/userModel');
const logger = require("../../../config/logger");
const jwtAuth = require("../../middlewares/JwtAuth");
const bycrypt = require('bcryptjs');
const resposnsCode = require("../../../util/staticFile.json");

require(`dotenv`).config();

class userServices {
    convertArrayToJsonObject = (loginResult) => {
        var returnObj = null;
        (loginResult < 1) ? returnObj : returnObj = {
            username: loginResult[0].username,
            userId: loginResult[0]._id,
            password: loginResult[0].password
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

    /**
     * @description validate credentials and return result accordingly to database using model methods
     * @param {*} loginCredentials holds data to be saved in json formate
     * @param {*} callback holds a function 
    */
    getLoginCredentialAndCallForValidation = (loginCredentials, callback) => {
        logger.info(`TRACKED_PATH: Inside services`);
        userModel.validateLoginCredentialAndReturnResult(loginCredentials, (error, loginResult) => {
            loginResult = this.convertArrayToJsonObject(loginResult);
            if (error) {
                callback(error, null)
            }
            else if (loginResult == null) {
                loginResult = {
                    success: false,
                    status_code: resposnsCode.NOT_FOUND,
                    message: "email id does not exist"
                }
                callback(null, loginResult);
            } else {
                bycrypt.compare(loginCredentials.password, loginResult.password, function (error, result) {
                    if (error) {
                        error = {
                            success: true,
                            status_code: resposnsCode.BAD_REQUEST,
                            message: 'Invalid password'
                        }
                        callback(error, null);
                    }
                    if (result) {
                        var token = jwtAuth.genrateToken(loginResult);
                        loginResult = {
                            success: true,
                            status_code: resposnsCode.SUCCESS,
                            message: 'login successfull',
                            data: token
                        }
                        logger.info(` token genrated: ${token}`);
                        callback(null, loginResult);
                    } else {
                        error = {
                            success: false,
                            status_code: resposnsCode.UNAUTHORIZED,
                            message: 'Invalid password',
                        }
                        callback(error, null);
                    }
                });
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
            } else {
                var token = jwtAuth.genrateToken(result);
                userModel.saveForgotPasswordLinkTODb(result, token, (error, resultData) => {
                    if (error) {
                        callback(error, null);

                    } else {
                        jwtAuth.sendMail(result, token, (error, resetPasswordLink) => {
                            if (error) {
                                callback(error, null);
                            } else {
                                resultData = { link: resetPasswordLink, message: resultData }
                                callback(null, resultData);
                            }
                        })
                    }
                })
            }
        })
    }

    /**
     * @description call the  of resetpassword fuction of model
     * @param {*} restData having the user mail id and password to be reset
     * @param {*}  callback callback funcntion
     */
    resetPass = (restData, callback) => {
        userModel.resetPassword(restData, (error, Result) => {
            (error) ? callback(error, null) : callback(null, Result)
        })
    }

}

module.exports = new userServices