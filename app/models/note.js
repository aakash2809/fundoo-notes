/**
 * @module       models
 * @file         noteModel.js
 * @description  This module is used for creating the schema and comunicate with mongodb
 *               through mongoose
 * @requires     {@link http://mongoosejs.com/|mongoose} 
 * @requires     logger is a reference to save logs in log files
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>
------------------------------------------------------------------------------------------*/

const mongoose = require(`mongoose`);
const logger = require("../../config/logger");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.set("versionKey", false);

logger.info("inside model");
const Note = mongoose.model(`Note`, noteSchema);

class NoteModel {
  /**
   * @description save request note data to database
   * @param {*} noteData holds data to be saved in json formate
   * @param {*} callback holds a function
   */
  saveNote = (noteData, callback) => {
    logger.info(`TRACKED_PATH: Inside model`);
    const note = new Note(noteData);
    note.save((error, noteResult) => {
      error ? callback(error, null) : callback(null, noteResult);
    });
  };

  /**
   * @description retrive all note data from database
   * @param {*} callback holds a function
   */
  getAllNotes = (userId, callback) => {
    logger.info(`TRACKED_PATH: Inside model`);
    Note.find({ userId: userId }, (error, noteData) => {
      error ? callback(error, null) : callback(null, noteData);
    });
  };

  /**
   * @description retrive one note data from database
   *
   * @param {*} greetingID holds _id that is note id
   * @param {*} callback holds a function
   */
  getNoteByNoteId = (noteId, callback) => {
    logger.info(`TRACKED_PATH: Inside model`);

    Note.findById(noteId, (error, noteResult) => {
      error ? callback(error, null) : callback(null, noteResult);
    });
  };

  /**
   * @description remove note data from database
   * @param {*} greetingId holds _id that is note  id
   * @param {*} callback holds a function
   */
  deleteNoteByNoteId(noteData, callback) {
    logger.info(`TRACKED_PATH: Inside model`);
    Note.findByIdAndDelete(noteData, (error, noteResult) => {
      error ? callback(error, null) : callback(null, noteResult);
    });
  }

  /**
   * @description update note  data existed in database
   * @param {*} noteId holds _id that is note  id
   * @param {*} dataToUpdate takes data to be upadated in json formate
   * @param {*} callback holds a function
   */
  updateNoteByNoteId(noteId, dataToUpdate, callback) {
    logger.info(`TRACKED_PATH: Inside model`);
    Note.findByIdAndUpdate(
      noteId,
      dataToUpdate,
      {
        new: true,
      },
      (error, noteResult) => {
        error ? callback(error, null) : callback(null, noteResult);
      }
    );
  }
}

module.exports = new NoteModel();