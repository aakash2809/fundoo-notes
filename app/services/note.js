/**
 * @module         services
 * @file           note.js
 * @description    This file contain all the service method for notes
 * @requires       noteModel  is refrence to invoke methods of noteModel.js     
 * @author         Aakash Rajak <aakashrajak2809@gmail.com>        
------------------------------------------------------------------------------------------*/
const noteModel = require("../models/note");
const logger = require("../../config/logger");
const helper = require("../middlewares/helper")

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
   */
  retrieveAllNotes = (userId, callback) => {
    logger.info(`TRACKED_PATH: Inside services`);
    noteModel.getAllNotes(userId, (error, noteResult) => {
      // error ? callback(error, null) : callback(null, noteResult);
      if (error) {
        callback(error, null);
      } else {
        helper.setRedisForLabel(userId, noteResult);
        callback(null, noteResult);
      }
    });
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
   * @param {*} callback holds a function
   */
  removeNoteById = (noteId, callback) => {
    logger.info(`TRACKED_PATH: Inside services`);
    noteModel.deleteNoteByNoteId(noteId, (error, noteResult) => {
      error ? callback(error, null) : callback(null, noteResult);
    });
  };

  /**
   * @description update note  data existed in database, using model's mothod
   * @param {*} noteId holds _id that is note  id
   * @param {*} dataToReplace takes data to be upadated in json formate
   * @param {*} callback holds a function
   */
  updateNoteById = (noteId, dataToReplace, callback) => {
    logger.info(`TRACKED_PATH: Inside services`);
    noteModel.updateNoteByNoteId(noteId, dataToReplace, (error, noteResult) => {
      error ? callback(error, null) : callback(null, noteResult);
    });
  };
}

module.exports = new NoteServices();
