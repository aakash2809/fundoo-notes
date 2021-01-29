const mongoose = require(`mongoose`);
const logger   = require("../../config/logger");
const bycrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
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

userSchema.set('versionKey', false);

userSchema.pre("save", async function(next){
    this.password = await bycrypt.hash(this.password, 10);
    console.log(`${this.password}`);
    next();
})

logger.info('inside model');

const userRegistrationModelInstance = mongoose.model(`userRegistration`, userSchema);

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
