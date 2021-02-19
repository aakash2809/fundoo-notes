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

    /**
     * @description validate credentials and return result accordingly to database using model methods
     * @param {*} loginCredentials holds data to be saved in json formate
     * @param {*} callback holds a function 
    */
    getLoginCredentialAndCallForValidation = (loginCredentials, callback) => {
        logger.info(`TRACKED_PATH: Inside services`);
        userModel.validateLoginCredentialAndReturnResult(loginCredentials, (error, loginResult) => {
            loginResult = this.extractObjectFromArray(loginResult);
            if (error) {
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
                bycrypt.compare(loginCredentials.password, loginResult.password, function (error, result) {
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
            (error) ? callback(error, null) : callback(null, result)
        })
    }
}

module.exports = new userServices