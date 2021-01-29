/**
 * @module       controllers
 * @description  controllers is reponsible to accept request and send the response
 *               Controller resolve the error using the service layer by invoking its services
 * @requires    
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>
 * @since      
-----------------------------------------------------------------------------------------------*/

const logger           = require("../../config/logger");
const registrationServices = require(`../services/userRegistration.services`);

class userRegistrationController {
    
    /**
     * @description add greeting to database
     * @param {*} request takes greeting in json formate
     * @param {*} response sends response from server
    */
    addNewRegistration = (request, response) => {
        logger.info(`TRACKED_PATH: Inside controller`);

        const registrationDetails = {
            name: request.body.name,
            email: request.body.email,
            password: request.body.password
        };

        logger.info(`INVOKING: saveData method of services`);

        registrationServices.saveRegistrationData(registrationDetails, (error, resitrationResult) => {
            console.log(error);
            if (error) {
                response.send({
                    success: false,
                    status_code: 400,
                    message: error.message,
                });
                logger.error(`ERR001: registraion data did not match `);
            } else {
                response.send({
                    success: true,
                    status_code: 200,
                    message: 'data inserted successfully',
                    data: resitrationResult
                })
                logger.info('SUCCESS001: data inserted successfully');
            }
        })
        
    }


}

module.exports = new userRegistrationController