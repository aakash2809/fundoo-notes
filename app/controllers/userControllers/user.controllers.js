/**
 * @module       controllers
 * @description  controllers is reponsible to accept request and send the response
 *               Controller resolve the error using the service layer by invoking its services
 * @requires    
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>
 * @since      
-----------------------------------------------------------------------------------------------*/

const logger  = require("../../../config/logger");
 const userServices = require("../../services/userServices/user.services");
 const bycrypt = require('bcryptjs');
 const jwt = require("jsonwebtoken");
class userControllers {
    
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

        userServices.saveRegistrationData(registrationDetails, (error, registrationResult) => {
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
      // console.log(error);
      // console.log(loginResult.data);
      const a = loginResult;
      
        if (error) {
            response.send({
                success: false,
                status_code: 400,
                message: error.message,
            });
            logger.error(`ERR001: login credentials did not match `);
        }
       else if( loginResult == null ){
        response.send({
            success: false,
            status_code: 404,
            message: "email id does not exist"
        }); 
        }  
        
        else {          
         bycrypt.compare(loginDetails.password,loginResult.password,function(err,result){
            console.log(err);
             if(err){
                console.log(err);
                response.send({
                    success: true,
                    status_code: 400,
                    message: 'Invalid password'
                })
             }
             if(result){
              var token =  jwt.sign({
                  username:loginResult.name,
                  userId:loginResult._id,
                }, 
                "secret", {
                    expiresIn:"1h"
                }
                );
                console.log(result);
                response.send({
                success: true,
                status_code: 200,
                message: 'login successfull',
                data: token
            })
             }
             else{ 
                console.log(result);
                response.send({
                success: false,
                status_code: 200,
                message: 'auth failed',
                
            })
            }
         });

        }
    })
    
}


}

module.exports = new userControllers