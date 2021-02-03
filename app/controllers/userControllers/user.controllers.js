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
const userSchema = require('../../middlewares/validator');
const resposnsCode = require("../../../util/statusCodes.json");

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
            logger.error(`SCHEMAERROR: Request did not match with schema`);
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
            (error) ? response.send({
                success: false,
                status_code: resposnsCode.bad_request,
                message: error,
            }) : response.send({
                success: true,
                status_code: resposnsCode.success,
                message: 'data inserted successfully',
                data: registrationResult
            })
            logger.info('SUCCESS001: data inserted successfully');
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
            (error) ? response.send({
                success: false,
                status_code: resposnsCode.bad_request,
                message: error.message,
            }) : response.send({
                success: loginResult.success,
                status_code: loginResult.status_code,
                message: loginResult.message,
            });
        })
    }
}

forgotPassword = (request, response) => {
   const {email} = request.body;
   logger.info(`INVOKING: getEmail method of login services`)
   console.log({email});
   userServices.getEmail({email}, (error, loginResult) => {
    (error) ? response.send({
        success: false,
        status_code: resposnsCode.bad_request,
        message: error.message,
    }) : response.send({
        success: loginResult.success,
        status_code: loginResult.status_code,
        message: loginResult,
    });
})
}
module.exports = new userControllers