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
const labelModel = require("../models/label");
var atob = require("atob");

class LabelController {

  /**
   * @description add label to database
   * @param {*} request takes label in json formate
   * @param {*} response sends response from server
   */
  addlabel = async (request, response) => {
    try {
      logger.info(`TRACKED_PATH: Inside controller`);
      console.log(request.body);
      var token = request.headers.authorization.split("Bearer ")[1];
      var encodedBody = JSON.parse(atob(token.split(".")[1]));

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
  findAllLabels = async (request, response) => {
    logger.info(`TRACKED_PATH: Inside controller`);
    try {
      var token = request.headers.authorization.split("Bearer ")[1];
      var encodedBody = JSON.parse(atob(token.split(".")[1]));

      const result = await labelServices.retrieveAllLabel(encodedBody.userId);

      response.send({
        success: true,
        status_code: resposnsCode.SUCCESS,
        message: "label of current account has been retrieved",
        data: result,
      });
      logger.info("SUCCESS002:All label has been retrieved");
    } catch (error) {
      response.send({
        success: false,
        status_code: resposnsCode.INTERNAL_SERVER_ERROR,
        message: `Some error occurred while retrieving label.`,
      });
      logger.error(`ERR002: Some error occurred while retrieving label.`);
    }
  };

  /**
   * @description update label by _id
   * @param {*} request takes _id that is greetingID
   * @param {*} response sends response from server
   */
  updateLabelByLabelId = async (request, response) => {
    logger.info(`TRACKED_PATH: Inside controller`);
    try {
      const result = await labelServices.updateNoteById(request.params.labelId, { label: request.body.label });
      response.send({
        success: true,
        status_code: resposnsCode.SUCCESS,
        message: "Label has been updated",
        updated_data: result,
      });
      logger.info("SUCCESS004: Label has been updated");

    } catch (error) {
      response.send({
        success: false,
        status_code: resposnsCode.NOT_FOUND,
        message: `Label not found with id ${request.params.labelId}`,
      });
      logger.error(`ERR004: Label  not found with id ${request.params.labelId}`);
    }
  };

  /**
   * @description delete label  by _id that is noteId
   * @param {*} request takes _id that is noteId
   * @param {*} response sends response from server
   */
  deleteNoteByNoteId = async (request, response) => {
    logger.info(`TRACKED_PATH: Inside controller`);
    try {
      const result = await labelServices.removeNoteById(request.params.labelId);
      response.send({
        success: true,
        status_code: resposnsCode.SUCCESS,
        message: "Label deleted successfully!",
      });
      logger.info("SUCCESS004: Label deleted successfully!");
    } catch (error) {
      response.send({
        success: false,
        status_code: resposnsCode.NOT_FOUND,
        message: `Label not found with id ${request.params.labelId}`,
      });
      logger.error(`ERR005: Label not found with id ${request.params.labelId}`);
    }
  };
}

module.exports = new LabelController();
