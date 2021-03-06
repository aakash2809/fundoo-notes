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

const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');
const logger = require('../../config/logger');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    default: null,

  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
},
{
  timestamps: true,
  autoIndex: false,
});

userSchema.set('versionKey', false);

userSchema.pre('save', async function (next) {
  this.password = await bycrypt.hash(this.password, 10);
  this.confirmPassword = undefined;
  next();
});

logger.info('inside model');
const User = mongoose.model('User', userSchema);

class UserModel {
  /**
    * @description save request data to database
    * @param {*} registrationData holds data to be saved in json formate
    * @param {*} callback holds a function
   */
  register = (registrationData, callback) => {
    logger.info('TRACKED_PATH: Inside model');
    const userRegistration = new User(registrationData);
    userRegistration.save((error, registrationResult) => {
      if (error) {
        error = 'already registered';
        callback(error, null);
      } else {
        callback(null, registrationResult);
      }
    });
  }

  /**
   * @description find email id in database and return data associated with id
   * @param {*} signUpData holds login credentials
   * @param {*} callback holds a function
  */
  checkMailExistenceInDb = (signUpData, callback) => {
    const { email } = signUpData;
    User.find({ email: `${email}` }, (error, userExistence) => {
      (error) ? callback(error, null) : callback(null, userExistence);
    });
  }

  /**
    * @description find email id in database and validate
    * @param {*} loginCredential holds login credentials
    * @param {*} callback holds a function
   */
  getDetailOfGivenEmailId = (loginCredential, callback) => {
    const { email } = loginCredential;
    User.find({ email: `${email}` }, (error, loginResult) => {
      (error) ? callback(error, null) : callback(null, loginResult);
    });
  }

  /**
   * @description find email id in database and validate using promises
   * @param {*} email holds email id
  */
  checkEmailExistenceInDb = (email) => new Promise((resolve, reject) => {
    User.find({ email: `${email}` }, (error, emailResult) => {
      if (error) {
        return reject(error);
      }
      return resolve(emailResult);
    });
  })

  /**
   * @description find email id in database and
   * callback with user data or error
   * @param {*} email holds email id
   * @param {*} callback holds a function
  */
  forgetPassword = (email, callback) => {
    User.find(email, (error, user) => {
      (error) ? callback(error, null) : callback(null, user);
    });
  }

  /**
   * @description find email id in database and callback with user data or error
   * @param {*} resetDataholds email id
   * @param {*} callback holds a function
  */
  resetPassword = (resetData, callback) => {
    const { email } = resetData;
    const { newPassword } = resetData;
    bycrypt.hash(newPassword, 10, (error, hash) => {
      if (error) {
        error = 'New password unable to hash';
        callback(error, null);
      } else {
        User.findOneAndUpdate(
          { email },
          { password: hash }, (error, result) => {
            if (error || !result) {
              error = 'User with this email id does not exist';
              callback(error, null);
            } else {
              result = 'password updated successfully';
              callback(null, result);
            }
          },
        );
      }
    });
  }

  /**
    * @description find email id in database and callback with user data or error
    * @param {*} user contain user data
    * @param {*} callback holds a function
    */
  updateActivationStatus = (user, callback) => {
    User.findOneAndUpdate(
      { email: user.email },
      { isActivated: true }, (error, result) => {
        (error) ? callback(error, null) : callback(null, result);
      },
    );
  }
}

module.exports = new UserModel();
