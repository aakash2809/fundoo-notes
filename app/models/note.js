/**
 * @module       models
 * @file         noteModel.js
 * @description  This module is used for creating the schema and comunicate with mongodb
 *               through mongoose
 * @requires     {@link http://mongoosejs.com/|mongoose}
 * @requires     logger is a reference to save logs in log files
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>
------------------------------------------------------------------------------------------*/

const mongoose = require('mongoose');
const logger = require('../../config/logger');

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
      ref: 'User',
    },
    labelId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Label',
    }],
    isArchived: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '#FFFFFF',
    },
    image: {
      type: String,
    },
    collaborator: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
  },
);

noteSchema.set('versionKey', false);

logger.info('inside model');
const Note = mongoose.model('Note', noteSchema);

class NoteModel {
  /**
   * @description save request note data to database
   * @param {*} noteData holds data to be saved in json formate
   * @param {*} callback holds a function
   */
  saveNote = (noteData, callback) => {
    logger.info('TRACKED_PATH: Inside model');
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
    logger.info('TRACKED_PATH: Inside model');
    Note.find({ userId }, (error, noteData) => {
      error ? callback(error, null) : callback(null, noteData);
    });
  };

  /**
   * @description retrive one note data from database
   * @param {*} greetingID holds _id that is note id
   * @param {*} callback holds a function
   */
  getNoteByNoteId = (noteId, callback) => {
    logger.info('TRACKED_PATH: Inside model');
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
    logger.info('TRACKED_PATH: Inside model');
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
    logger.info('TRACKED_PATH: Inside model');
    Note.findByIdAndUpdate(
      noteId,
      dataToUpdate,
      { new: true },
      (error, noteResult) => {
        error ? callback(error, null) : callback(null, noteResult);
      },
    );
  }

  /**
    * @description update note  data existed in database by adding existing
    * label in label collection
    * @param {*}requireDataToaddLabel takes data to be upadated in json formate
    * @param {*} callback holds a function
    */
  addLabel = (requireDataToaddLabel, callback) => {
    const { labelId } = requireDataToaddLabel;
    const { noteId } = requireDataToaddLabel;
    Note.findByIdAndUpdate(
      noteId,
      { $push: { labelId } },
      { new: true },
      callback,
    );
  }

  /**
  * @description update note  data existed in database by adding existing
  * user in user collection
  * @param {*}requireDataToaddUser takes data to be upadated in json formate
  * @param {*} callback holds a function
  */
  addUser = (requireDataToaddUser, callback) => {
    const { userId } = requireDataToaddUser;
    const { noteId } = requireDataToaddUser;
    Note.findByIdAndUpdate(
      noteId,
      { $push: { collaborator: userId } },
      { new: true },
      callback,
    );
  }

  /**
     * @description update note  data existed in database by deleting
     * label from note asociated with given noteId
     * @param {*}requireDataToaddLabel takes data to be upadated in json formate
     * @param {*} callback holds a function
     */
  removeLabel = (requireDataToaddLabel, callback) => {
    const { labelId } = requireDataToaddLabel;
    const { noteId } = requireDataToaddLabel;
    Note.findByIdAndUpdate(
      noteId,
      { $pull: { labelId } },
      { new: true },
      callback,
    );
  }

  /**
   * @description update note  data existed in database by deleting
   * label from note asociated with given noteId
   * @param {*}requireDataToaddUser takes data to be upadated in json formate
   * @param {*} callback holds a function
   */
  removeUser = (requireDataToaddUser, callback) => {
    const { userId } = requireDataToaddUser;
    const { noteId } = requireDataToaddUser;
    Note.findByIdAndUpdate(
      noteId,
      { $pull: { collaborator: userId } },
      { new: true },
      callback,
    );
  }

  /**
   * @description remove note temporary by setting isdeleted flag true
   * @param {*} noteID
   * @param {*} callback
   */
  removeNote = (noteID, callback) => {
    Note.findByIdAndUpdate(
      noteID, { isDeleted: true }, { new: true },
      callback,
    );
  };

  /**
   * @description  by setting isarchived flag true
   * @param {*} noteID
   * @param {*} callback
   */
  archiveNote = (noteID, callback) => {
    Note.findByIdAndUpdate(
      noteID, { isArchived: true }, { new: true },
      callback,
    );
  };

  /**
    * @description  setting isArchived flag false
    * @param {*} noteID
    * @param {*} callback
    */
  unArchiveNote = (noteID, callback) => {
    Note.findByIdAndUpdate(
      noteID, { isArchived: false }, { new: true },
      callback,
    );
  };

  /**
     * @description  setting isDeleted flag false
     * @param {*} noteID
     * @param {*} callback
     */
  restoreNote = (noteID, callback) => {
    Note.findByIdAndUpdate(
      noteID, { isDeleted: false }, { new: true },
      callback,
    );
  };

  /**
   * @param {*} data
   * @param {*} callback
   * @description : addCollaborator will add the collaborator into note
   */
  addCollaborator = async (data, callback) => {
    const result = await Note.findByIdAndUpdate(data.noteId, {
      $addToSet: {
        collaborator: data.userToCollabrate,
      },
    });
    callback(null, result);
  };

  /**
    * @description : this function remove the collaborator from the note.
    * @param {*} data require to remove collaborator
    */
  removeCollaborator = (data) => {
    return new Promise((resolve, reject) => {
      Note.findByIdAndUpdate(data.noteId,
        { $pull: { collaborator: data.collaboratorId } }
      )
        .then((user) =>
          resolve(user))
        .catch((err) =>
          reject(err));
    });
  }

  /**
    * @description update note data existed in database by updating color
    * field
    * @param {*}requireDataToaddColor takes data to be upadated in json formate
    * @param {*} callback holds a function
    */
  addColor = (requireDataToaddColor, callback) => {
    const noteColor = requireDataToaddColor.color;
    const { noteId } = requireDataToaddColor;

    const updateColor = { color: noteColor };
    Note.findByIdAndUpdate(
      noteId,
      updateColor,
      { new: true },
      callback,
    );
  }

  /**
    * @description save the image by noteId
    * @param imageDetail contains image noteId and image location
    */
  saveImage = async (imageDetail) => {
    try {
      const result = await Note.findOneAndUpdate(
        {
          _id: imageDetail.noteId,
        },
        {
          $set: {
            image: imageDetail.image,
          },
        },
      );
      return result;
    } catch (err) {
      logger.info('Something went wrong', err);
      return err;
    }
  }
}

module.exports = new NoteModel();
