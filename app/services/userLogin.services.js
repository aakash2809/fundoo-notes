/**
 * @module         services
 * @file           userLogin.services.js
 * @description    This file contain all the service of login  
 * @author         Aakash Rajak <aakashrajak2809@gmail.com>
       
------------------------------------------------------------------------------------------*/

const userModel = require('../models/userModel');
const logger        = require("../../config/logger");

class LoginServices {

    /**
     * @description validate credention and return result accordingly to database using model methods
     * @param {*} loginCredentials holds data to be saved in json formate
     * @param {*} callback holds a function 
    */
    getLoginCredentialAndCallForValidation = (loginCredentials, callback) => {
       // logger.info(`TRACKED_PATH: Inside services`);
        console.log(loginCredentials);
        userModel.validateLoginCredentialAndReturnResult(loginCredentials, (error, loginResult) => {
            if (error) {
                callback(error, null)
            } else {
                callback(null, loginResult);
            }
        })
    }    
}

module.exports = new LoginServices