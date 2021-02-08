/**
 * @module       controllers
 * @description  controllers is reponsible to accept request and send the response
 *               Controller resolve the error using the service layer by invoking its services
 * @requires    
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>
 * @since       
-----------------------------------------------------------------------------------------------*/

const logger = require("../../../config/logger");
const userServices = require("../../services/userServices/user");
const userSchema = require('../../middlewares/validator');
const resposnsCode = require("../../../util/staticFile.json");

class UserControllers {

    /**
     * @description add user to database
     * @param {*} request in json formate
     * @param {*} response sends response from server
    */
    register = (request, response) => {
        console.log(request.body)
        logger.info(`TRACKED_PATH: Inside controller`);
        let requestValidationResult = userSchema.validate(request.body);

        if (requestValidationResult.error) {
            logger.error(`SCHEMAERROR: Request did not match with schema`);
            response.send({
                success: false,
                status_code: resposnsCode.BAD_REQUEST,
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
                status_code: resposnsCode.BAD_REQUEST,
                message: error,
            }) : response.send({
                success: true,
                status_code: resposnsCode.SUCCESS,
                message: 'Registered successfully',
                data: registrationResult
            })
            logger.info('SUCCESS001: data inserted successfully');
        })
    }

    /**
     * @description login to database
     * @param {*} request 
     * @param {*} response 
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
                success: error.success,
                statusCode: error.status_code,
                message: error.message,
            }) : response.send({
                success: loginResult.success,
                statusCode: resposnsCode.SUCCESS,
                message: loginResult.message,
            });
        })
    }

    /**
     * @description forgot password 
     * @param {*} request 
     * @param {*} response 
     */
    forgotPassword = (request, response) => {
        const { email } = request.body;
        logger.info(`INVOKING: getEmail method of login services`);
        userServices.getEmail({ email }, (error, result) => {
            (error) ? response.send({
                success: false,
                status_code: resposnsCode.BAD_REQUEST,
                message: error.message,
            }) : response.send({
                success: true,
                status_code: resposnsCode.SUCCESS,
                data: result,
            });
        })
    }

    /**
     * @description reset password 
     * @param {*} request 
     * @param {*} response 
     */
    restPassword = (request, response) => {
        var newPassword = request.body;
        userServices.resetPass(newPassword, (error, result) => {
            (error) ? response.send({
                success: false,
                status_code: resposnsCode.BAD_REQUEST,
                message: error
            }) : response.send({
                success: true,
                status_code: resposnsCode.SUCCESS,
                message: result,
            });
        })
    }
}

module.exports = new UserControllers