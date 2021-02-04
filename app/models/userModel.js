/**
 * @module       models
 * @file         userModel.js
 * @description  This module is used for creating the schema and comunicate with mongodb
 *               through mongoose
 * @requires     {@link http://mongoosejs.com/|mongoose} 
 * @requires     bcryptjs module for encryption of password
 * @requires     logger is a reference to save logs in log files
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>
------------------------------------------------------------------------------------------*/

const mongoose = require(`mongoose`);
const logger = require("../../config/logger");
const bycrypt = require('bcryptjs');
require(`dotenv`).config();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
    },
    resetLink: {
        type: String,
        default: 'resetlink'
    }
},
    { timestamps: true }
);

userSchema.set('versionKey', false);

userSchema.pre("save", async function (next) {
    this.password = await bycrypt.hash(this.password, 10);
    this.confirmPassword = undefined;
    next();
})

logger.info('inside model');
const User = mongoose.model(`User`, userSchema);

class UserModel {
    /**
      * @description save request data to database 
      * @param {*} registrationData holds data to be saved in json formate
      * @param {*} callback holds a function 
     */
    register = (registrationData, callback) => {
        logger.info(`TRACKED_PATH: Inside model`);
        const userRegistration = new User(registrationData);
        userRegistration.save((error, registrationResult) => {
            (error) ? callback(error, null) : callback(null, registrationResult);
        })
    }

    /**
      * @description find email id in database and validate
      * @param {*} loginCredential holds login credentials
      * @param {*} callback holds a function 
     */
    validateLoginCredentialAndReturnResult = (loginCredential, callback) => {
        const email = loginCredential.email;
        User.find({ email: `${email}` }, (error, loginResult) => {
            (error) ? callback(error, null) : callback(null, loginResult);
        });
    }

     /**
      * @description find email id in database and 
      * callback with user data or error
      * @param {*} email holds email id
      * @param {*} callback holds a function 
     */
    forgetPassword = (email, callback) => {
        User.findOne(email, (error, user) => {
            if (error || !user) {
                 error = "User with this email id does not exist"
                callback(error, null);
            } else {
                callback(null, user);
            }
        });
    }

     /**
      * @description find email id in database and callback with user data or error
      * @param {*} email holds email id
      * @param {*} callback holds a function 
     */
    saveForgotPasswordLinkTODb = (user, token, callback) => {
       var email = user.email;
        User.findOneAndUpdate({email: email},  
            {resetLink:token}, null, (error, success) => {
            if (error) {
                error = "reset password link error"
                callback(error, null)
            } else {
                success = "reset link updated";
                callback(null, success);
            }
        })
    }
}

module.exports = new UserModel;
