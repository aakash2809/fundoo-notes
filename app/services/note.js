/**
 * @module         services
 * @file           note.js
 * @description    This file contain all the service method for notes
 * @requires       noteModel  is refrence to invoke methods of noteModel.js     
 * @author         Aakash Rajak <aakashrajak2809@gmail.com>        
------------------------------------------------------------------------------------------*/
const noteModel = require("../models/note");
const logger = require("../../config/logger");
const helper = require("../middlewares/helper");
const resposnsCode = require("../../util/staticFile.json");

class NoteServices {

  /**
   * @description save request data to database using model methods
   * @param {*} noteData holds data to be saved in json formate
   * @param {*} callback holds a function
   */
  saveNoteData = (noteData, callback) => {
    logger.info(`TRACKED_PATH: Inside services`);
    noteModel.saveNote(noteData, (error, noteResult) => {
      error ? callback(error, null) : callback(null, noteResult);
    });
  };

  /**
   * @description retrive all note  data from database using model's mothod
   * @param {*} callback holds a function
   * @param {*} callback holds a function
   * 
   */
  retrieveAllNotes = (userId, callback) => {
    logger.info(`TRACKED_PATH: Inside services`);
    const KEY = `NOTE_${userId}`
    helper.getResponseFromRedis(KEY, (error, dataFromRedis) => {
      if (error) {
        error = {
          success: false,
          statusCode: resposnsCode.INTERNAL_SERVER_ERROR,
          message: error
        }
        callback(error, null)
      } else if (!dataFromRedis) {
        noteModel.getAllNotes(userId, (error, noteResult) => {
          error
            ? (error = {
              success: false,
              statusCode: resposnsCode.INTERNAL_SERVER_ERROR,
              message: error
            }, callback(error, null)) : (
              helper.setDataToRedis(KEY, noteResult),
              console.log("comming from mongodb"),
              noteResult = {
                success: true,
                statusCode: resposnsCode.SUCCESS,
                message: 'Notes of current account has been retrieved',
                data: noteResult
              },
              callback(null, noteResult));
        });
      } else {
        console.log("comming from redis");
        dataFromRedis = {
          success: true,
          statusCode: resposnsCode.SUCCESS,
          message: 'Notes of current account has been retrieved',
          data: dataFromRedis
        }
        callback(null, dataFromRedis);
      }
    })
  };

  /**
   * @description retrive one note  data from database using model's mothod
   * @param {*} noteID holds _id that is note id
   * @param {*} callback holds a function
   */
  retrieveNoteById = (noteID, callback) => {
    logger.info(`TRACKED_PATH: Inside services`);
    noteModel.getNoteByNoteId(noteID, (error, noteResult) => {
      error ? callback(error, null) : callback(null, noteResult);
    });
  };

  /**
   * @description remove note  data from database using model's mothod
   * @param {*} noteId holds _id that is note id
   * @param {*}  userId holds user Object id
   * @param {*} callback holds a function
   */
  removeNoteById = (userId, noteId, callback) => {
    logger.info(`TRACKED_PATH: Inside services`);
    noteModel.deleteNoteByNoteId(noteId, (error, noteResult) => {
      error
        ? callback(error, null) : (
          this.retrieveAllNotes(userId),
          callback(null, noteResult));
    });
  };

  /**
   * @description update note  data existed in database, using model's mothod
   * @param {*} noteId holds _id that is note  id
   * @param {*} dataToReplace takes data to be upadated in json formate
   * @param {*} callback holds a function
   */
  updateNoteById = (userId, noteId, dataToReplace, callback) => {
    logger.info(`TRACKED_PATH: Inside services`);
    noteModel.updateNoteByNoteId(noteId, dataToReplace, (error, noteResult) => {
      error ? callback(error, null) : (
        this.retrieveAllNotes(userId),
        callback(null, noteResult));
    });
  }

  /**
   * @description update note  data existed in database, using model's mothod
    * by adding new label Object Id to Note
    * @param {*} requireDataToaddLabel takes data to be upadated in json formate
    * @param {*} callback holds a function
    */
  updateNoteByAddingLabel = (requireDataToaddLabel, callback) => {
    const noteId = requireDataToaddLabel.noteId;
    noteModel.addLabel(requireDataToaddLabel, (error, noteResult) => {
      if (error) {
        error = {
          success: false,
          status_code: resposnsCode.INTERNAL_SERVER_ERROR,
          message: `Internal server error : ${error} `,
        }
        callback(error, null);
      }
      else if (!noteResult) {
        error = {
          success: false,
          status_code: resposnsCode.NOT_FOUND,
          message: `No note availabe associated with : ${noteId} `,
        }
        callback(error, null);
      }
      else {
        noteResult = {
          success: true,
          status_code: resposnsCode.SUCCESS,
          message: `Label successfully added to Note`,
          updated_data: noteResult,
        }
        callback(null, noteResult)
      }
    });
  }

  /**
   * @description update note  data existed in database, using model's mothod
    * by adding new label Object Id to Note
    * @param {*} requireDataToaddUser takes data to be upadated in json formate
    * @param {*} callback holds a function
    */
  updateNoteByAddingUser = (requireDataToaddUser, callback) => {
    const noteId = requireDataToaddUser.noteId;
    noteModel.addUser(requireDataToaddUser, (error, noteResult) => {
      if (error) {
        error = {
          success: false,
          status_code: resposnsCode.INTERNAL_SERVER_ERROR,
          message: `Internal server error : ${error} `,
        }
        callback(error, null);
      }
      else if (!noteResult) {
        error = {
          success: false,
          status_code: resposnsCode.NOT_FOUND,
          message: `No note availabe associated with : ${noteId} `,
        }
        callback(error, null);
      }
      else {
        noteResult = {
          success: true,
          status_code: resposnsCode.SUCCESS,
          message: `User successfully added to Note`,
          updated_data: noteResult,
        }
        callback(null, noteResult)
      }
    });
  }

  /**
  * @description update note  data existed in database, using model's mothod
  * by deleting label Object Id from Note
  * @param {*} requireDataToaddLabeltakes data to be upadated in json formate
  * @param {*} callback holds a function
  */
  updateNoteByRemovingLabel = (requireDataToaddLabel, callback) => {
    noteModel.removeLabel(requireDataToaddLabel, (error, noteResult) => {
      if (error) {
        error = {
          success: false,
          status_code: resposnsCode.INTERNAL_SERVER_ERROR,
          message: `Internal server error : ${error} `,
        }
        callback(error, null);
      }
      else if (!noteResult) {
        error = {
          success: false,
          status_code: resposnsCode.NOT_FOUND,
          message: `No note availabe associated with : ${noteId} `,
        }
        callback(error, null);
      }
      else {
        noteResult = {
          success: true,
          status_code: resposnsCode.SUCCESS,
          message: `Label successfully removed from Note associated with given Id`,
          updated_data: noteResult,
        }
        callback(null, noteResult)
      }
    })
  }

  /**
  * @description update note  data existed in database, using model's mothod
  * by deleting User Object Id from Note
  * @param {*} requireDataToaddUser takes data to be upadated in json formate
  * @param {*} callback holds a function
  */
  updateNoteByRemovingUser = (requireDataToaddUser, callback) => {
    noteModel.removeUser(requireDataToaddUser, (error, noteResult) => {
      if (error) {
        error = {
          success: false,
          status_code: resposnsCode.INTERNAL_SERVER_ERROR,
          message: `Internal server error : ${error} `,
        }
        callback(error, null);
      }
      else if (!noteResult) {
        error = {
          success: false,
          status_code: resposnsCode.NOT_FOUND,
          message: `No note availabe associated with : ${userId} `,
        }
        callback(error, null);
      }
      else {
        noteResult = {
          success: true,
          status_code: resposnsCode.SUCCESS,
          message: `User successfully removed from Note associated with given Id`,
          updated_data: noteResult,
        }
        callback(null, noteResult)
      }
    })
  }
}

module.exports = new NoteServices();
