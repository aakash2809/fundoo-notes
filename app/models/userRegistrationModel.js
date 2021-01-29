const mongoose = require(`mongoose`);
const logger           = require("../../config/logger");

const userRegistrationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },   
},
{ timestamps: true}  
);

userRegistrationSchema.set('versionKey', false);

logger.info('inside model');

const userRegistrationModelInstance = mongoose.model(`userRegistration`, userRegistrationSchema);

class userRegistrationModel {

    /**
      * @description save request greeting data to database 
      * @param {*} registrationData holds data to be saved in json formate
      * @param {*} callback holds a function 
     */
    saveRegistraion = (registrationData, callback) => {
        logger.info(`TRACKED_PATH: Inside model`);

        const userRegistration = new userRegistrationModelInstance(registrationData);
        userRegistration.save((error, registrationResult) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, registrationResult);
            }
        });
    }
}

module.exports = new userRegistrationModel;
