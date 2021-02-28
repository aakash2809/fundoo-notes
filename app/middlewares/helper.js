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
var nodemailer = require("nodemailer");
const logger = require("../../config/logger");
var ejs = require("ejs");
const resposnsCode = require("../../util/staticFile.json");
const redis = require("redis");
const client = redis.createClient();
require("dotenv").config();
var atob = require("atob");
const { isRef } = require("joi");

class Helper {
  /**
   * @description it genrate the token
   */
  genrateToken = (user) => {
    return jwt.sign(
      {
        username: user.name,
        userId: user._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );
  };

  /**
 * @description it genrate the token
 */
  genrateTokenForSignUp = (user) => {
    return jwt.sign(
      {
        username: user.name,
        userId: user.email,
        password: user.password
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );
  };

  /**
   * @description this function sending mail for reset password 
   */
  sendMail = async (user, token, callback) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      port: process.env.PORT,
      secure: true, // use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await ejs.renderFile(
      "app/views/forgotPassword.ejs",
      {
        name: user.name,
        resetLink: `${process.env.CLIENT_URL}/resetpassword/${token}`,
      },
      (err, data) => {
        if (err) {
        } else {
          var mainOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Activate account",
            html: data,
          };
          transporter.sendMail(mainOptions, (error, mailInfo) => {
            if (error) {
              callback(error, null);
            } else {
              mailInfo = `${process.env.CLIENT_URL}/resetpassword/${token}`;
              callback(null, mailInfo);
            }
          });
        }
      }
    );
  };

  /**
  * @description this function sending mail to activate the Account
  */
  sendMailToActivateAccount = (user, token) => {
    return new Promise((resolve, reject) => {
      let transporter = nodemailer.createTransport({
        //settings
        service: "gmail",
        port: process.env.PORT,
        secure: true, // use SSL
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }

      });
      ejs.renderFile("app/views/activateEmail.ejs", {
        name: user.name,
        resetLink: `${process.env.CLIENT_URL}/ActivateAccount/${token}`,
      }, function (err, data) {
        if (err) {

        } else {
          var mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Activate account",
            html: data
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              reject(error);
            }
            else {
              info = `${process.env.CLIENT_URL}/ActivateAccount/${token}`
              resolve(info);
            }
          })
        }
      });
    })
  }

  /**
   * @description this function verify the token 
   */
  verifyToken = (request, response, next) => {
    try {
      var token = request.headers.authorization.split("Bearer ")[1];
      var decode = jwt.verify(token, process.env.SECRET_KEY);
      request.userData = decode;
      next();
    } catch (error) {
      response.send({
        success: false,
        status_code: resposnsCode.BAD_REQUEST,
        message: "Authentication failed",
      });
    }
  };

  /**
   * @description this function return encodedbody from given token 
   */
  getEncodedBodyFromHeader = (request) => {
    var token = request.headers.authorization.split("Bearer ")[1];
    var encodedBody = JSON.parse(atob(token.split(".")[1]));
    return encodedBody;
  }

  /**
   * @description retrive all label data from database
   */
  setDataToRedis = (KEY, data) => {
    client.setex(KEY, 120, JSON.stringify(data));
  }

  getResponseFromRedis = (KEY, callback) => {
    client.get(KEY, (error, redisData) => {
      (error)
        ? (logger.info("error in retriving data from redis", error),
          callback(error, null)) :
        (logger.info("Does not got error but data can be null"),
          callback(null, JSON.parse(redisData)));
    })
  }
}

module.exports = new Helper();
