/**
 * @module       controllers
 * @description  controllers is reponsible to accept request and send the response
 *               Controller resolve the error using the service layer by invoking its services   
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>    
-----------------------------------------------------------------------------------------------*/

const logger           = require("../../config/logger");
//    = require(`../services/userLogin.services`);
 // loginServices = require('../services/userLogin.services')
 loginServices = require('../services/userLogin.services')
class UserLoginController {
    
    /**
     * @description add greeting to database
     * @param {*} request takes greeting in json formate
     * @param {*} response sends response from server
    */
    login = (request, response) => {
        logger.info(`TRACKED_PATH: Inside controller`);
        console.log("controller");
        const loginDetails = {
            email: request.body.email,
            password: request.body.password
        };

        logger.info(`INVOKING: getLoginCredentialAndCallForValidation method of login services`);

        loginServices.getLoginCredentialAndCallForValidation(loginDetails, (error, loginResult) => {
            //console.log(error);
            if (error || loginResult === null) {
                response.send({
                    success: false,
                    status_code: 400,
                    message: 'invalid credentials',
                });
                logger.error(`ERR001: login credentials did not match `);
            } else {

                response.send({
                    success: true,
                    status_code: 200,
                    message: 'login successfull',
                    data: loginResult
                })
                logger.info('SUCCESS001: login successfull');
            }
        })
        
    }


}

module.exports = new UserLoginController