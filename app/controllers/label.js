/**
 * @module       controllers
 * @description  controllers is reponsible to accept request and send the response
 *               Controller resolve the error using the service layer by invoking its services
 * @requires     Services is a refernce for invoking the services of service layer
 * @requires     logger  is a reference to save logs in log files
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>
-----------------------------------------------------------------------------------------------*/

const logger = require("../../config/logger");
const labelServices = require(`../services/label`);
const resposnsCode = require("../../util/staticFile.json");
const Validator = require("../middlewares/inputValiation");
const helper = require("../middlewares/helper");

class LabelController {

  /**
   * @description add label to database
   * @param {*} request takes label in json formate
   * @param {*} response sends response from server
   */
  addlabel = async (request, response) => {
    try {
      logger.info(`TRACKED_PATH: Inside controller`);
      const encodedBody = helper.getEncodedBodyFromHeader(request);

      let validatedRequestResult = Validator.validateLabel(request.body);

      if (validatedRequestResult.error) {
        logger.error(`SCHEMAERROR: Request did not match with schema`);
        response.send({
          success: false,
          status_code: resposnsCode.BAD_REQUEST,
          message: validatedRequestResult.error.details[0].message,
        });
        return;
      }

      const labelDetails = {
        label: request.body.label,
        userId: encodedBody.userId,
      };

      logger.info(`INVOKING: save method of services`);
      const result = await labelServices.savelabelData(labelDetails);
      response.send({
        success: true,
        status_code: resposnsCode.SUCCESS,
        message: "Label inserted successfully",
        data: result,
      });
      logger.info("SUCCESS001: Label inserted successfully");
    } catch (e) {
      response.send({
        success: false,
        status_code: resposnsCode.BAD_REQUEST,
        message: "error",
      });
      logger.error(`ERR001: Label data did not match `);
    }
  }

  /**
   * @description Retrieve and return all greetings from the database.
   * @param {*} request does not take any parameter
   * @param {*} response sends response from server
   */
  findAllLabels = (request, response) => {
    logger.info(`TRACKED_PATH: Inside controller`);
    var start = new Date();
    const encodedBody = helper.getEncodedBodyFromHeader(request);

    labelServices.retrieveAllLabel(encodedBody.userId, (error, labelResult) => {
      if (error) {
        response.send({
          success: error.success,
          status_code: error.statusCode,
          message: error.message
        });
        logger.error(`ERR002: Some error occurred while retrieving label.`);
      } else {
        response.send({
          success: labelResult.success,
          status_code: labelResult.statusCode,
          message: labelResult.message,
          data: labelResult.data,
        });
        logger.info("SUCCESS002:All data has been retrieved");
        logger.info('Request took:', new Date() - start, 'ms');
      }
    });
  };


  /**
   * @description update label by _id
   * @param {*} request takes _id that is greetingID
   * @param {*} response sends response from server
   */
  updateLabelByLabelId = async (request, response) => {
    logger.info(`TRACKED_PATH: Inside controller`);
    try {
      const encodedBody = helper.getEncodedBodyFromHeader(request);
      const result = await labelServices.updateLabelByLabelId(request.params.labelId, { label: request.body.label }, encodedBody.userId);
      response.send({
        success: result.success,
        status_code: result.statusCode,
        message: result.message,
      });
    } catch (error) {
      logger.error(`ERR004: Label  not found with id ${request.params.labelId}`);
      response.send({
        success: false,
        status_code: resposnsCode.INTERNAL_SERVER_ERROR,
        message: `Internal server error`,
      });
    }
  };

  /**
   * @description delete label  by _id that is noteId
   * @param {*} request takes _id that is noteId
   * @param {*} response sends response from server
   */
  deleteLabelByLabelId = async (request, response) => {
    logger.info(`TRACKED_PATH: Inside controller`);
    try {
      const encodedBody = helper.getEncodedBodyFromHeader(request);
      const result = await labelServices.removeLabelByLabelId(request.params.labelId, encodedBody.userId);
      response.send({
        success: result.success,
        status_code: result.statusCode,
        message: result.message,
      });
    } catch (error) {
      response.send({
        success: false,
        status_code: resposnsCode.INTERNAL_SERVER_ERROR,
        message: `Internal server error`,
      });
      logger.error(`ERR005: Label not found with id ${request.params.labelId}`);
    }
  };
}

module.exports = new LabelController();
