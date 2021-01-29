/**
 * @module         services
 * @file           userRegistration.services.js
 * @description    This file contain all the service  
 * @author         Aakash Rajak <aakashrajak2809@gmail.com>
       
------------------------------------------------------------------------------------------*/

const registrationModel = require('../models/userModel');
const logger        = require("../../config/logger");

class registrationServices {

    /**
     * @description save request data to database using model methods
     * @param {*} registrationData holds data to be saved in json formate
     * @param {*} callback holds a function 
    */
    saveRegistrationData = (registrationData, callback) => {
        logger.info(`TRACKED_PATH: Inside services`);

        registrationModel.saveRegistraion(registrationData, (error, registrationResult) => {
            if (error) {
                callback(error, null)
            } else {
                callback(null, registrationResult);
            }
        })
    }    
}

module.exports = new registrationServices