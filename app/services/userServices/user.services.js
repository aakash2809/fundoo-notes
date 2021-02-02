/**
 * @module         services
 * @file           userRegistration.services.js
 * @description    This file contain all the service  
 * @author         Aakash Rajak <aakashrajak2809@gmail.com>
       
------------------------------------------------------------------------------------------*/

const userModel = require('../../models/userModel');
const logger = require("../../../config/logger");
const jwtAuth = require("../../middlewares/JwtAuth")
const bycrypt = require('bcryptjs');
const resposnsCode = require("../../../util/statusCodes.json")

class userServices {
    /**
     * @description save request data to database using model methods
     * @param {*} registrationData holds data to be saved in json formate
     * @param {*} callback holds a function 
    */
    registerUser = (registrationData, callback) => {
        logger.info(`TRACKED_PATH: Inside services`);
        userModel.register(registrationData, (error, registrationResult) => {
            if (error) {
                callback(error, null)
            } else {
                callback(null, registrationResult);
            }
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
            if (error) {
                callback(error, null)
            }
            else if (loginResult[0] == null) {
                loginResult = {
                    success: false,
                    status_code: resposnsCode.not_found,
                    message: "email id does not exist"
                }
                callback(null, loginResult);
            } else {
                bycrypt.compare(loginCredentials.password, loginResult[0]._doc.password, function (err, result) {
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
                        callback(null, loginResult);
                    } else {
                        loginResult = {
                            success: false,
                            status_code: 200,
                            message: 'Invalid password',
                        }
                        callback(null, loginResult);
                    }
                });
            }
        })
    }

}

module.exports = new userServices