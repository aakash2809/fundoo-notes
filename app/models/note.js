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
const Label = require("../models/label");

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
      ref: "User",
    },
    labelId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Label",
    }],
    isArchived: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    collaborator: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }]
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
   *@param {*} userId will contain user Object id 
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
   * @param {*} greetingID holds _id that is note id
   * @param {*} callback holds a function
   */
  getNoteByNoteId = (noteId, callback) => {
    logger.info(`TRACKED_PATH: Inside model`);
    Note.findById(noteId, (error, noteResult) => {
      error ? callback(error, null) : (
        callback(null, noteResult));
    });
  };

  /**
   * @description remove note data from database
   * @param {*} noteData holds _id that is note  id
   * @param {*} callback holds a function
   */
  deleteNoteByNoteId = (noteData, callback) => {
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
  updateNoteByNoteId = (noteId, dataToUpdate, callback) => {
    logger.info(`TRACKED_PATH: Inside model`);
    Note.findByIdAndUpdate(
      noteId,
      dataToUpdate,
      { new: true },
      (error, noteResult) => {
        error ? callback(error, null) : callback(null, noteResult);
      }
    );
  }

  /**
    * @description update note  data existed in database by adding existing 
    * label in label collection
    * @param {*}requireDataToaddLabel takes data to be upadated in json formate
    * @param {*} callback holds a function
    */
  addLabel = (requireDataToaddLabel, callback) => {
    const labelId = requireDataToaddLabel.labelId
    const noteId = requireDataToaddLabel.noteId;
    Note.findByIdAndUpdate(
      noteId,
      { $push: { labelId: labelId } },
      { new: true },
      callback)
  }

  /**
  * @description update note  data existed in database by adding existing 
  * user in user collection
  * @param {*}requireDataToaddUser takes data to be upadated in json formate
  * @param {*} callback holds a function
  */
  addUser = (requireDataToaddUser, callback) => {
    const userId = requireDataToaddUser.userId
    const noteId = requireDataToaddUser.noteId;
    Note.findByIdAndUpdate(
      noteId,
      { $push: { collaborator: userId } },
      { new: true },
      callback)
  }

  /**
     * @description update note  data existed in database by deleting 
     * label from note asociated with given noteId
     * @param {*}requireDataToaddLabel takes data to be upadated in json formate
     * @param {*} callback holds a function
     */
  removeLabel = (requireDataToaddLabel, callback) => {
    const labelId = requireDataToaddLabel.labelId
    const noteId = requireDataToaddLabel.noteId;
    Note.findByIdAndUpdate(
      noteId,
      { $pull: { labelId: labelId } },
      { new: true },
      callback);
  }

  /**
   * @description update note  data existed in database by deleting 
   * label from note asociated with given noteId
   * @param {*}requireDataToaddUser takes data to be upadated in json formate
   * @param {*} callback holds a function
   */
  removeUser = (requireDataToaddUser, callback) => {
    const userId = requireDataToaddUser.userId
    const noteId = requireDataToaddUser.noteId;
    Note.findByIdAndUpdate(
      noteId,
      { $pull: { collaborator: userId } },
      { new: true },
      callback);
  }

  /**
     * @description delte note forever from db by id
     * @param {*} noteID
     * @param {*} callback
     */
  deleteNoteById = (noteID, callback) => {
    Note.findById(noteID, (error, data) => {
      if (error) return callback(error, null);
      else {
        logger.info("Note found");
        Note.findByIdAndRemove(noteID, callback);
        return callback(null, data);
      }
    });
  };

  /**
   * @description remove note temporary by setting isdeleted flag true
   * @param {*} noteID
   * @param {*} callback
   */
  removeNote = (noteID, callback) => {
    Note.findByIdAndUpdate(
      noteID, { isDeleted: true }, { new: true },
      callback
    );
  };
}

module.exports = new NoteModel();
