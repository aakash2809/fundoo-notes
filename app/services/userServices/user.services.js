/**
 * @module         services
 * @file           userRegistration.services.js
 * @description    This file contain all the service  
 * @author         Aakash Rajak <aakashrajak2809@gmail.com>
       
------------------------------------------------------------------------------------------*/

const userModel = require('../../models/userModel');
const logger        = require("../../../config/logger");

class userServices {

    /**
     * @description save request data to database using model methods
     * @param {*} registrationData holds data to be saved in json formate
     * @param {*} callback holds a function 
    */
    saveRegistrationData = (registrationData, callback) => {
        logger.info(`TRACKED_PATH: Inside services`);

        userModel.saveNewRegistration(registrationData, (error, registrationResult) => {
            if (error) {
                callback(error, null)
            } else {
                callback(null, registrationResult);
            }
        })
    } 
    
    /**
     * @description validate credention and return result accordingly to database using model methods
     * @param {*} loginCredentials holds data to be saved in json formate
     * @param {*} callback holds a function 
    */
   getLoginCredentialAndCallForValidation = (loginCredentials, callback) => {
    logger.info(`TRACKED_PATH: Inside services`);
   
     userModel.validateLoginCredentialAndReturnResult(loginCredentials, (error, loginResult) => {
         if (error) {
             callback(error, null)
         } else {
             callback(null, loginResult);
         }
     })
 }    

}

module.exports = new userServices