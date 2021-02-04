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
                    status_code: resposnsCode.not_found,
                    message: "email id does not exist"
                }
                callback(null, loginResult);
            } else {
                bycrypt.compare(loginCredentials.password, loginResult.password, function (err, result) {
                    if (err) {
                        loginResult = {
                            success: true,
                            status_code: resposnsCode.bad_request,
                            message: 'Invalid password'
                        }
                        callback(null, loginResult);
                    }
                    if (result) {
                        var token = jwtAuth.genrateToken(loginResult);
                        loginResult = {
                            success: true,
                            status_code: resposnsCode.success,
                            message: 'login successfull',
                            data: token
                        }
                        logger.info(` token genrated: ${token}`);
                        callback(null, loginResult);
                    } else {
                        loginResult = {
                            success: false,
                            status_code: resposnsCode.unauthorized,
                            message: 'Invalid password',
                        }
                        callback(null, loginResult);
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
}

module.exports = new userServices