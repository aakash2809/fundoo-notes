/**
 * @module       controllers
 * @description  controllers is reponsible to accept request and send the response
 *               Controller resolve the error using the service layer by invoking its services
 * @requires     greetingServices is a refernce for invoking the services of service layer
 * @requires     greetingSchema   is a reference for the joi validation
 * @requires     logger           is a reference to save logs in log files
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>
 * @since        24/12/2020
-----------------------------------------------------------------------------------------------*/

const logger = require("../../../config/logger");
const noteServices = require(`../../services/noteServices/note`);
const noteSchemaValidator   = require('../../middlewares/noteValidator');
const resposnsCode = require("../../../util/staticFile.json");

class NoteController {
    /**
     * @description add note to database
     * @param {*} request takes note in json formate
     * @param {*} response sends response from server
    */
    addNote = (request, response) => {
        logger.info(`TRACKED_PATH: Inside controller`);
        let requestValidationResult = noteSchemaValidator.validate(request.body)
        if (requestValidationResult.error) {
            logger.error(`SCHEMAERROR: Request did not match with schema `);
            response.send({
                success: false,
                status_code: resposnsCode.BAD_REQUEST,
                message: requestValidationResult.error.details[0].message,
            })
            return;
        }

        const noteDetails = {
            title: request.body.title,
            note: request.body.note
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
                    message: 'Note inserted successfully',
                    data: noteResult
                })
                logger.info('SUCCESS001: note inserted successfully');
            }
        })
    };


    /**
     * @description Retrieve and return all greetings from the database.
     * @param {*} request does not take any parameter
     * @param {*} response sends response from server
    */
    findAllNotes = (request, response) => {
        logger.info(`TRACKED_PATH: Inside controller`);

        noteServices.retrieveAllNotes((error, noteResult) => {
            if (error) {
                response.send({
                    success: false,
                    status_code: 500,
                    message: error.message || `Some error occurred while retrieving note.`
                });
                logger.error(`ERR002: Some error occurred while retrieving notes.`);
            } else {
                response.send({
                    success: true,
                    status_code: resposnsCode.SUCCESS,
                    message: ' data has been retrieved',
                    data: noteResult
                })

                logger.info('SUCCESS002:All data has been retrieved');
            }
        })
    };

    /**
     * @description Retrieve and return note associated with _id ,from the database.
     * @param {*} request takes _id that is greetingID
     * @param {*} response sends response from server
    */
    findNoteByNoteId = (request, response) => {
        logger.info(`TRACKED_PATH: Inside controller`);
        noteServices.retrieveNoteById(request.params.noteId, (error, noteResult) => {
            if (noteResult === null) {
                response.send({
                    success: false,
                    status_code: resposnsCode.NOT_FOUND,
                    message: `Note not found with id ${request.params.noteId}`
                });

                logger.error(`ERR003: Note not found with id ${request.params.noteId}`);
            } else {
                response.send({
                    success: true,
                    status_code: resposnsCode.SUCCESS,
                    message: 'data retrived',
                    data: noteResult
                });

                logger.info('SUCCESS003: Data retrieved');
            }
        })
    };

    /**
     * @description update note by _id
     * @param {*} request takes _id that is greetingID
     * @param {*} response sends response from server
    */
    updateNoteByNoteId = (request, response) => {
        logger.info(`TRACKED_PATH: Inside controller`, 'info.log');

        let schemaValidationResult = noteSchemaValidator.validate(request.body)
        if (schemaValidationResult.error) {
            logger.error(`SCHEMAERROR: Request did not match with schema `);
            response.send({
                success: false,
                status_code: resposnsCode.BAD_REQUEST,
                message: schemaValidationResult.error.details[0].message,
            })
            return;
        }

        noteServices.updateNoteById(request.params.noteId, {
            title: request.body.title,
            note: request.body.note
        },
            (error, noteResult) => {
                if (error) {
                    response.send({
                        success: false,
                        status_code: resposnsCode.NOT_FOUND,
                        message: `Note not found with id ${request.params.noteId}`
                    });
                    logger.error(`ERR004: Note  not found with id ${request.params.noteId}`);
                } else {
                    response.send({
                        success: true,
                        status_code: resposnsCode.SUCCESS,
                        message: 'Data has been updated',
                        updated_data: noteResult
                    });
                    logger.info('SUCCESS004: Data has been updated');
                }
            });
    };

    /**
     * @description delete note  by _id that is noteId
     * @param {*} request takes _id that is noteId
     * @param {*} response sends response from server
    */
    deleteNoteByNoteId = (request, response) => {
        logger.info(`TRACKED_PATH: Inside controller`);
        noteServices.removeNoteById(request.params.noteId, (error, noteResult) => {
            if (noteResult === null) {
                response.send({
                    success: false,
                    status_code: resposnsCode.NOT_FOUND,
                    message: `Note not found with id ${request.params.noteId}`
                });
                logger.error(`ERR005: Note not found with id ${request.params.noteId}`);
            } else {
                response.send({
                    success: true,
                    status_code: resposnsCode.SUCCESS,
                    message: 'Note deleted successfully!'
                });
                logger.info('SUCCESS004: Note deleted successfully!');
            }
        })
    }
}

module.exports = new NoteController