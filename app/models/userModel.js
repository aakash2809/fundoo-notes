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
    confirmPassword: {
        type: String,
    },
},
{ timestamps: true}  
);

userSchema.set('versionKey', false);

userSchema.pre("save", async function(next){
    this.password = await bycrypt.hash(this.password, 10);
    this.confirmPassword = undefined;
    next();
})

logger.info('inside model');

const userModelInstance = mongoose.model(`userRegistration`, userSchema);

class UserModel {

    /**
      * @description save request greeting data to database 
      * @param {*} registrationData holds data to be saved in json formate
      * @param {*} callback holds a function 
     */
    saveNewRegistration = (registrationData, callback) => {
        logger.info(`TRACKED_PATH: Inside model`);

        const userRegistration = new userModelInstance(registrationData);
        userRegistration.save((error, registrationResult) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, registrationResult);
            }
        });
    }

validateLoginCredentialAndReturnResult = (loginCredential, callback) => {
        logger.info(`TRACKED_PATH: Inside model`);
    
        userModelInstance.find(loginCredential, (error, loginResult) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, loginResult);
            }
        });
   
    }
}

module.exports = new UserModel;
