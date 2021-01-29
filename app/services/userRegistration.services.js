/**
 * @module         services
 * @file           greeting.services.js
 * @description    This file contain all the service method for greetings
 * @requires       greetingModel  is refrence to invoke methods of greetingModel.js     
 * @author         Aakash Rajak <aakashrajak2809@gmail.com>
 * @since          24/12/2020          
------------------------------------------------------------------------------------------*/

const registrationModel = require('../models/userRegistrationModel');
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