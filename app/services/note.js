/**
 * @module         services
 * @file           note.js
 * @description    This file contain all the service method for notes
 * @requires       noteModel  is refrence to invoke methods of noteModel.js
 * @author         Aakash Rajak <aakashrajak2809@gmail.com>
------------------------------------------------------------------------------------------*/
const noteModel = require('../models/note');
const logger = require('../../config/logger');
const helper = require('../middlewares/helper');
const resposnsCode = require('../../util/staticFile.json');

class NoteServices {
  /**
      * @description update redis
      * @param userId holds a user's Id
      */
  updateRedis = (userId) => {
    const KEY = `NOTE_${userId}`;
    noteModel.getAllNotes(userId, (error, noteResult) => {
      error
        ? logger.info('got error')
        : helper.setDataToRedis(KEY, noteResult);
    });
  }

  /**
   * @description save request data to database using model methods
   * @param {*} noteData holds data to be saved in json formate
   * @param {*} callback holds a function
   */
  saveNoteData = (noteData, callback) => {
    logger.info('TRACKED_PATH: Inside services');
    noteModel.saveNote(noteData, (error, noteResult) => {
      if (error) {
        callback(error, null);
      } else {
        this.updateRedis(noteData.userId);
        callback(null, noteResult);
      }
    });
  };

  /**
   * @description retrive all note  data from database using model's mothod
   * @param {*} callback holds a function
   * @param {*} callback holds a function
   *
   */
  retrieveAllNotes = (userId, callback) => {
    logger.info('TRACKED_PATH: Inside services');
    const KEY = `NOTE_${userId}`;
    helper.getResponseFromRedis(KEY, (error, dataFromRedis) => {
      if (error) {
        error = {
          success: false,
          statusCode: resposnsCode.INTERNAL_SERVER_ERROR,
          message: error,
        };
        callback(error, null);
      } else if (!dataFromRedis) {
        noteModel.getAllNotes(userId, (error, noteResult) => {
          error
            ? (error = {
              success: false,
              statusCode: resposnsCode.INTERNAL_SERVER_ERROR,
              message: error,
            }, callback(error, null)) : (
              helper.setDataToRedis(KEY, noteResult),
              logger.info('comming from mongodb'),
              noteResult = {
                success: true,
                statusCode: resposnsCode.SUCCESS,
                message: 'Notes of current account has been retrieved',
                data: noteResult,
              },
              callback(null, noteResult));
        });
      } else {
        logger.info('comming from redis');
        dataFromRedis = {
          success: true,
          statusCode: resposnsCode.SUCCESS,
          message: 'Notes of current account has been retrieved',
          data: dataFromRedis,
        };
        callback(null, dataFromRedis);
      }
    });
  };

  /**
   * @description retrive one note  data from database using model's mothod
   * @param {*} noteID holds _id that is note id
   * @param {*} callback holds a function
   */
  retrieveNoteById = (noteID, callback) => {
    logger.info('TRACKED_PATH: Inside services');
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
    logger.info('TRACKED_PATH: Inside services');
    noteModel.deleteNoteByNoteId(noteId, (error, noteResult) => {
      if (error) {
        callback(error, null);
      } else {
        this.updateRedis(userId);
        callback(null, noteResult);
      }
    });
  };

  /**
   * @description update note  data existed in database, using model's mothod
   * @param {*} noteId holds _id that is note  id
   * @param {*} dataToReplace takes data to be upadated in json formate
   * @param {*} callback holds a function
   */
  updateNoteById = (userId, noteId, dataToReplace, callback) => {
    logger.info('TRACKED_PATH: Inside services');
    noteModel.updateNoteByNoteId(noteId, dataToReplace, (error, noteResult) => {
      if (error) {
        callback(error, null);
      } else {
        this.updateRedis(userId);
        callback(null, noteResult);
      }
    });
  }

  /**
   * @description update note data existed in database, using model's mothod
    * by adding new label Object Id to Note
    * @param {*} requireDataToaddLabel takes data to be upadated in json formate
    * @param {*} callback holds a function
    */
  updateNoteByAddingLabel = (requireDataToaddLabel, callback) => {
    const { noteId } = requireDataToaddLabel;
    noteModel.addLabel(requireDataToaddLabel, (error, noteResult) => {
      if (error) {
        error = {
          success: false,
          status_code: resposnsCode.NOT_FOUND,
          message: `No note availabe associated with : ${noteId}`,
        };
        callback(error, null);
      } else if (!noteResult) {
        error = {
          success: false,
          status_code: resposnsCode.NOT_FOUND,
          message: `No note availabe associated with : ${noteId}`,
        };
        callback(error, null);
      } else {
        noteResult = {
          success: true,
          status_code: resposnsCode.SUCCESS,
          message: 'Label successfully added to Note',
          updated_data: noteResult,
        };
        callback(null, noteResult);
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
    const { noteId } = requireDataToaddUser;
    noteModel.addUser(requireDataToaddUser, (error, noteResult) => {
      if (error) {
        error = {
          success: false,
          status_code: resposnsCode.INTERNAL_SERVER_ERROR,
          message: `No note availabe associated with : ${noteId}`,
        };
        callback(error, null);
      } else if (!noteResult) {
        error = {
          success: false,
          status_code: resposnsCode.NOT_FOUND,
          message: `No note availabe associated with : ${noteId}`,
        };
        callback(error, null);
      } else {
        noteResult = {
          success: true,
          status_code: resposnsCode.SUCCESS,
          message: 'User successfully added to Note',
          updated_data: noteResult,
        };
        callback(null, noteResult);
      }
    });
  }

  /**
  * @description update note  data existed in database, using model's mothod
  * by deleting label Object Id from Note
  * @param {*} requireDataToaddLabel takes data to be upadated in json formate
  * @param {*} callback holds a function
  */
  updateNoteByRemovingLabel = (requireDataToaddLabel, callback) => {
    const { noteId } = requireDataToaddLabel;
    noteModel.removeLabel(requireDataToaddLabel, (error, noteResult) => {
      if (error) {
        error = {
          success: false,
          status_code: resposnsCode.INTERNAL_SERVER_ERROR,
          message: `No note availabe associated with : ${noteId}`,
        };
        callback(error, null);
      } else if (!noteResult) {
        error = {
          success: false,
          status_code: resposnsCode.NOT_FOUND,
          message: `No note availabe associated with : ${noteId}`,
        };
        callback(error, null);
      } else {
        noteResult = {
          success: true,
          status_code: resposnsCode.SUCCESS,
          message: 'Label successfully removed from Note associated with given Id',
          updated_data: noteResult,
        };
        callback(null, noteResult);
      }
    });
  }

  /**
  * @description update note  data existed in database, using model's mothod
  * by deleting User Object Id from Note
  * @param {*} requireDataToaddUser takes data to be upadated in json formate
  * @param {*} callback holds a function
  */
  updateNoteByRemovingUser = (requireDataToaddUser, callback) => {
    const { noteId } = requireDataToaddUser;
    noteModel.removeUser(requireDataToaddUser, (error, noteResult) => {
      if (error) {
        error = {
          success: false,
          status_code: resposnsCode.INTERNAL_SERVER_ERROR,
          message: `No note availabe associated with : ${noteId}`,
        };
        callback(error, null);
      } else if (!noteResult) {
        error = {
          success: false,
          status_code: resposnsCode.NOT_FOUND,
          message: `No note availabe associated with : ${noteId}`,
        };
        callback(error, null);
      } else {
        noteResult = {
          success: true,
          status_code: resposnsCode.SUCCESS,
          message: 'User successfully removed from Note associated with given Id',
          updated_data: noteResult,
        };
        callback(null, noteResult);
      }
    });
  }

  /**
   * @description Delete Note by id and return response to controller
   * @method removeNote is used to remove Note by ID
   * @param callback is the callback for controller
   */
  removeNote = (userId, noteID, callback) => noteModel.removeNote(noteID, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      this.updateRedis(userId);
      callback(null, result);
    }
  });

  /**
     * @description archive Note by id and return response to controller
     * @method archiveNote is used to remove Note by ID
     * @param callback is the callback for controller
     */
  archiveNoteData = (userId, noteID, callback) => noteModel.archiveNote(noteID, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      this.updateRedis(userId);
      callback(null, result);
    }
  });

  /**
     * @description unarchive Note by id and return response to controller
     * @method UnArchiveNote
     * @param callback is the callback for controller
     */
  unArchiveNoteData = (userId, noteID, callback) => noteModel.unArchiveNote(noteID, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      this.updateRedis(userId);
      callback(null, result);
    }
  });

  /**
     * @description unarchive Note by id and return response to controller
     * @method restoreNoteData restore tempararty deleted data
     * @param callback is the callback for controller
     */
  restoreNoteData = (userId, noteID, callback) => noteModel.restoreNote(noteID, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      this.updateRedis(userId);
      callback(null, result);
    }
  });

  /**
   * @description : addCollaborator will add the collaborator by taking data from controller
  * @param {*} data contins detail for collabrtion
  * @param {*} callback
  */
  addCollaborator = (data, callback) => {
    noteModel.addCollaborator(data, (err, result) => {
      if (result) {
        (err) ? callback(err, null) : callback(null, helper.collabNotification(data));
      } else {
        callback('Please check your email id again.');
      }
    });
  };

  /**
   * @description : removeCollaborator is used to remove the Collaborator from the existing note,
   * @param data require to remove collaborator
   */
  removeCollaborator = (data) => {
    return new Promise((resolve, reject) => {
      const result = noteModel.removeCollaborator(data);
      result.then((data) => resolve({ data }))
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
  * @description update note  data existed in database, using model's mothod
   * by adding new color Object Id to Note
   * @param {*} requireDataToaddColor takes data to be upadated in json formate
   * @param {*} callback holds a function.
   */
  addColorToNote = (requireDataToaddColor, callback) => {
    const { noteId } = requireDataToaddColor;
    noteModel.addColor(requireDataToaddColor, (error, noteResult) => {
      if (error) {
        error = {
          success: false,
          status_code: resposnsCode.NOT_FOUND,
          message: `No note availabe associated with : ${noteId}`,
        };
        callback(error, null);
      } else if (!noteResult) {
        error = {
          success: false,
          status_code: resposnsCode.NOT_FOUND,
          message: `No note availabe associated with : ${noteId}`,
        };
        callback(error, null);
      } else {
        noteResult = {
          success: true,
          status_code: resposnsCode.SUCCESS,
          message: 'color successfully added to Note',
          updated_data: noteResult,
        };
        callback(null, noteResult);
      }
    });
  }

  /**
    * @description call the method of note model and serve response to controller
    * @param imageDetail contains note id and image
    */
  uploadImage = (imageDetail) => new Promise((resolve, reject) => {
    noteModel.saveImage(imageDetail).then((data) => {
      resolve({ data });
    }).catch((err) => {
      reject(err);
    });
  })

  /**
  * @description call the method of note model and serve response to controller
  * @param imageDetail contains note id and image
  */
  serachNote = (searchDetail) => new Promise((resolve, reject) => {
    noteModel.getNotes(searchDetail).then((result) => {
      resolve(result);
    }).catch((err) => {
      reject(err);
    });
  });

  /**
    * @description call the method of note model and serve response to controller
    * @param paginationInput contains note page and limit
    */
  paginatenNotes = async (paginationInput) => {
    try {
      const paginationResult = await noteModel.getPaginatedNotes(paginationInput);
      return paginationResult;
    } catch (err) {
      return err;
    }
  }
}

module.exports = new NoteServices();
