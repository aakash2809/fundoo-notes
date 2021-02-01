/**
 * @module       controllers
 * @description  controllers is reponsible to accept request and send the response
 *               Controller resolve the error using the service layer by invoking its services
 * @requires    
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>
 * @since      
-----------------------------------------------------------------------------------------------*/

const logger = require("../../../config/logger");
const userServices = require("../../services/userServices/user.services");
const bycrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const userSchema = require('../../middlewares/user.schema.joi.validator');
const resposnsCode = require("../../../util/statusCodes.json")
class userControllers {

    /**
     * @description add user to database
     * @param {*} request takes greeting in json formate
     * @param {*} response sends response from server
    */
    register = (request, response) => {
        logger.info(`TRACKED_PATH: Inside controller`);
        let requestValidationResult = userSchema.validate(request.body);

        if (requestValidationResult.error) {
            logger.error(`SCHEMAERROR: Request did not match with schema `);
            response.send({
                success: false,
                status_code: resposnsCode.bad_request,
                message: requestValidationResult.error.details[0].message,
            })
            return;
        }

        const registrationDetails = {
            name: request.body.name,
            email: request.body.email,
            password: request.body.password,
            confirmPassword: request.body.confirmPassword,
        };

        if (request.body.password != request.body.confirmPassword) {
            response.send({
                success: false,
                status_code: resposnsCode.bad_request,
                message: "password does not match with confirm password",
            });
        }

        logger.info(`INVOKING: registerUser method of services`);
        userServices.registerUser(registrationDetails, (error, registrationResult) => {
            if (error) {
                response.send({
                    success: false,
                    status_code: bad_request,
                    message: error.message,
                });
                logger.error(`ERR001: registraion data did not match `);
            } else {
                response.send({
                    success: true,
                    status_code: resposnsCode.success,
                    message: 'data inserted successfully',
                    data: registrationResult
                })
                logger.info('SUCCESS001: data inserted successfully');
            }
        })
    }

    /**
   * @description add greeting to database
   * @param {*} request takes greeting in json formate
   * @param {*} response sends response from server
  */
    login = (request, response) => {
        logger.info(`TRACKED_PATH: Inside controller`);

        const loginDetails = {
            email: request.body.email,
            password: request.body.password
        };

        logger.info(`INVOKING: getLoginCredentialAndCallForValidation method of login services`);
        userServices.getLoginCredentialAndCallForValidation(loginDetails, (error, loginResult) => {
            console.log(loginResult[0]);
            if (error) {
                response.send({
                    success: false,
                    status_code: resposnsCode.bad_request,
                    message: error.message,
                });
                logger.error(`ERR001: login credentials did not match `);
            }
            else if (loginResult[0] == null) {
                response.send({
                    success: false,
                    status_code: resposnsCode.not_found,
                    message: "email id does not exist"
                });
            } else {
               bycrypt.compare(loginDetails.password, loginResult[0]._doc.password, function (err, result) {
                    if (err) {
                        response.send({
                            success: true,
                            status_code: resposnsCode.bad_request,
                            message: 'Invalid password'
                        })
                    } if (result) {
                        var token = jwt.sign({
                            username: loginResult.name,
                            userId: loginResult._id,
                        },
                            "secret", {
                            expiresIn: "24h"
                        }
                        );
                        response.send({
                            success: true,
                            status_code: resposnsCode.success,
                            message: 'login successfull',
                            data: token
                        })
                    } else {
                        console.log(result);
                        response.send({
                            success: false,
                            status_code: 200,
                            message: 'auth failed',
                        });
                    }
                });
            }
        })
    }
}

module.exports = new userControllers