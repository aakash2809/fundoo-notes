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
var nodemailer = require("nodemailer");
var ejs = require("ejs");
const resposnsCode = require("../../util/staticFile.json");
const redis = require("redis");
const client = redis.createClient();
require("dotenv").config();
var atob = require("atob");
var key = "";

class Helper {
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

  getEncodedBodyFromHeader = (request) => {
    var token = request.headers.authorization.split("Bearer ")[1];
    var encodedBody = JSON.parse(atob(token.split(".")[1]));
    return encodedBody;
  }

  seRedisforlabel = (result) => {
    client.setex("label", 120, JSON.stringify(result));
  }

  setRedisfornote = (result) => {
    client.setex("note", 120, JSON.stringify(result));
  }

  setRedisForLogin = (result) => {
    client.setex("login", 120, JSON.stringify(result));
  }

  redislabelClient = (request, response, next) => {
    var start = new Date();
    client.get("label", (error, redisData) => {
      if (error || redisData == null) {
        next();
      } else {
        response.send(JSON.parse(redisData));
        console.log("labels Comming from redis");
        console.log('Request took:', new Date() - start, 'ms');
      }
    })
  }

  redisNoteClient = (request, response, next) => {
    var start = new Date();
    client.get("note", (error, redisData) => {
      if (error || redisData == null) {
        next();
      } else {
        response.send(JSON.parse(redisData));
        console.log("notes Comming from redis");
        console.log('Request took:', new Date() - start, 'ms');
      }
    })
  }

  redisClientForLogin = (request, response, next) => {
    var start = new Date();
    client.get("login", (error, redisData) => {
      if (error || redisData == null) {
        next();
      } else {
        response.send(JSON.parse(redisData));
        console.log("data Comming from redis");
      }
    })
    console.log('Request took:', new Date() - start, 'ms');
  }
}

module.exports = new Helper();
