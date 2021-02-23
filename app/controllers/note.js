/**
 * @module       controllers
 * @description  controllers is reponsible to accept request and send the response
 *               Controller resolve the error using the service layer by invoking its services
 * @requires     noteServices is a refernce for invoking the services of service layer
 * @requires     logger           is a reference to save logs in log files
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>
-----------------------------------------------------------------------------------------------*/

const logger = require("../../config/logger");
const noteServices = require(`../services/note`);
const resposnsCode = require("../../util/staticFile.json");
var atob = require("atob");
const helper = require("../middlewares/helper");

class NoteController {
  /**
   * @description add note to database
   * @param {*} request takes note in json formate
   * @param {*} response sends response from server
   */
  addNote = (request, response) => {
    logger.info(`TRACKED_PATH: Inside controller`);
    console.log(request.body);
    const encodedBody = helper.getEncodedBodyFromHeader(request);

    const noteDetails = {
      title: request.body.title,
      description: request.body.description,
      userId: encodedBody.userId,
    };

    logger.info(`INVOKING: saveData method of services`);
    noteServices.saveNoteData(noteDetails, (error, noteResult) => {
      if (error) {
        response.send({
          success: false,
          status_code: resposnsCode.BAD_REQUEST,
          message: error.message,
        });
        logger.error(`ERR001: Note data did not match `);
      } else {
        response.send({
          success: true,
          status_code: resposnsCode.SUCCESS,
          message: "Note inserted successfully",
          data: noteResult,
        });
        logger.info("SUCCESS001: note inserted successfully");
      }
    });
  };

  /**
   * @description Retrieve and return all greetings from the database.
   * @param {*} request does not take any parameter
   * @param {*} response sends response from server
   */
  findAllNotes = (request, response) => {
    logger.info(`TRACKED_PATH: Inside controller`);
    var start = new Date();
    const encodedBody = helper.getEncodedBodyFromHeader(request);

    noteServices.retrieveAllNotes(encodedBody.userId, (error, noteResult) => {
      if (error) {
        response.send({
          success: false,
          status_code: resposnsCode.INTERNAL_SERVER_ERROR,
          message:
            error.message || `Some error occurred while retrieving note.`,
        });
        logger.error(`ERR002: Some error occurred while retrieving notes.`);
      } else {
        response.send({
          success: true,
          status_code: resposnsCode.SUCCESS,
          message: "Notes of current account has been retrieved",
          data: noteResult,
        });
        console.log('Request took:', new Date() - start, 'ms');
        logger.info("SUCCESS002:All data has been retrieved");
      }
    });
  };

  /**
   * @description Retrieve and return note associated with _id ,from the database.
   * @param {*} request takes _id that is greetingID
   * @param {*} response sends response from server
   */
  findNoteByNoteId = (request, response) => {
    logger.info(`TRACKED_PATH: Inside controller`);
    noteServices.retrieveNoteById(
      request.params.noteId,
      (error, noteResult) => {
        if (noteResult === null) {
          response.send({
            success: false,
            status_code: resposnsCode.NOT_FOUND,
            message: `Note not found with id ${request.params.noteId}`,
          });
          logger.error(
            `ERR003: Note not found with id ${request.params.noteId}`
          );
        } else {
          response.send({
            success: true,
            status_code: resposnsCode.SUCCESS,
            message: "data retrived",
            data: noteResult,
          });

          logger.info("SUCCESS003: Data retrieved");
        }
      }
    );
  };

  /**
   * @description update note by _id
   * @param {*} request takes _id that is greetingID
   * @param {*} response sends response from server
   */
  updateNoteByNoteId = (request, response) => {
    logger.info(`TRACKED_PATH: Inside controller`);
    const encodedBody = helper.getEncodedBodyFromHeader(request);
    noteServices.updateNoteById(
      encodedBody.userId,
      request.params.noteId,
      {
        title: request.body.title,
        description: request.body.description,
      },
      (error, noteResult) => {
        if (error) {
          response.send({
            success: false,
            status_code: resposnsCode.NOT_FOUND,
            message: `Note not found with id ${request.params.noteId}`,
          });
          logger.error(
            `ERR004: Note  not found with id ${request.params.noteId}`
          );
        } else {
          response.send({
            success: true,
            status_code: resposnsCode.SUCCESS,
            message: "Note has been updated",
            updated_data: noteResult,
          });
          logger.info("SUCCESS004: Note has been updated");
        }
      }
    );
  };

  /**
   * @description delete note  by _id that is noteId
   * @param {*} request takes _id that is noteId
   * @param {*} response sends response from server
   */
  deleteNoteByNoteId = (request, response) => {
    logger.info(`TRACKED_PATH: Inside controller`);
    const encodedBody = helper.getEncodedBodyFromHeader(request);
    noteServices.removeNoteById(encodedBody.userId, request.params.noteId, (error, noteResult) => {
      if (noteResult === null) {
        response.send({
          success: false,
          status_code: resposnsCode.NOT_FOUND,
          message: `Note not found with id ${request.params.noteId}`,
        });
        logger.error(`ERR005: Note not found with id ${request.params.noteId}`);
      } else {
        response.send({
          success: true,
          status_code: resposnsCode.SUCCESS,
          message: "Note deleted successfully!",
        });
        logger.info("SUCCESS004: Note deleted successfully!");
      }
    });
  }

  addLabel = (request, response) => {
    const requireDataToaddLabel = {
      noteId: request.body.noteId,
      labelId: request.body.labelId,
    }
    console.log(requireDataToaddLabel);
    noteServices.updateNoteByAddingLabel(requireDataToaddLabel, (error, noteResult) => {
      //console.log("controller result", error);
      if (error) {
        response.send({
          success: false,
          status_code: resposnsCode.NOT_FOUND,
          message: error
        });
        logger.error(
          `ERR004: Note  not found with id `
        );
      } else {
        response.send({
          success: true,
          status_code: resposnsCode.SUCCESS,
          message: "Note has been updated",
          updated_data: noteResult,
        });
        logger.info("SUCCESS004: Note has been updated");
      }
    });
  }
}

module.exports = new NoteController();
