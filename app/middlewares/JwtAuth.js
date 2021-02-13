/**
 * @module       middlewares
 * @file         JwtAuth.js
 * @description  This file contain Helper class which having methods related to auhorization token *                creation and sending the mails to users            
 * @requires     nodemailer module for sending the mail to user
 * @requires     logger is a reference to save logs in log files
 * @requires     jsonwebtoken to create json web token
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>
------------------------------------------------------------------------------------------*/

const jwt = require("jsonwebtoken");
var nodemailer = require('nodemailer');
const logger = require("../../config/logger");
var nodemailer = require("nodemailer");
var ejs = require("ejs");
const resposnsCode = require("../../util/staticFile.json");
const envConfig    =  require('../../config/index');

class Helper {
  genrateToken = (user) => {
    return jwt.sign({
      username: user.name,
      userId: user._id,
    },
      envConfig.SECRET_KEY, {
      expiresIn: "24h"
    });
  }

  sendMail = async (user, token, callback) => {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      port: envConfig.PORT,
      secure: true, // use SSL
      auth: {
        user: envConfig.EMAIL_USER,
        pass: envConfig.EMAIL_PASS
      }
    });
   await ejs.renderFile(
      "app/views/forgotPassword.ejs",
      { name: user.name, resetLink: `${process.env.CLIENT_URL}/resetpassword/${token}` },
      (err, data) => {
        if (err) {
        } else {
          var mainOptions = {
            from: envConfig.EMAIL_USER,
            to: user.email,
            subject: 'Activate account',
            html: data
          };
          transporter.sendMail(mainOptions, (error, mailInfo) => {
            if (error) {
              callback(error, null);
            } else {
              mailInfo = `${envConfig.CLIENT_URL}/resetpassword/${token}`
              callback(null, mailInfo);
            }
          });
        }
      });
  }

  verifyToken = (request, response, next) => {
    try {
      var token = request.headers.authorization.split('Bearer ')[1];
      var decode = jwt.verify(token, envConfig.SECRET_KEY);
      request.userData = decode;
      next();
    } catch (error) {
      response.send({
        success: false,
        status_code: resposnsCode.BAD_REQUEST,
        message: "Authentication failed",
      });
    }
  }
}

module.exports = new Helper();