/**
 * @module       controllers
 * @description  controllers is reponsible to accept request and send the response
 *               Controller resolve the error using the service layer by invoking its services
 * @requires     noteServices is a refernce for invoking the services of service layer
 * @requires     logger           is a reference to save logs in log files
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>
-----------------------------------------------------------------------------------------------*/

const logger = require('../../config/logger');

const noteServices = require('../services/note');
const resposnsCode = require('../../util/staticFile.json');
const helper = require('../middlewares/helper');
const inputValidator = require('../middlewares/inputValiation');

class NoteController {
  /**
   * @description add note to database
   * @param {*} request takes note in json formate
   * @param {*} response sends response from server
   */
  addNote = (request, response) => {
    logger.info('TRACKED_PATH: Inside controller');
    const encodedBody = helper.getEncodedBodyFromHeader(request);
    const noteDetails = {
      title: request.body.title,
      description: request.body.description,
      userId: encodedBody.userId,
    };
    logger.info('INVOKING: saveData method of services');
    noteServices.saveNoteData(noteDetails, (error, noteResult) => {
      if (error) {
        logger.error(`ERR001: getting Error to save ${error.message}`);
        response.send({
          success: false,
          status_code: resposnsCode.BAD_REQUEST,
          message: error.message,
        });
      } else {
        logger.info('Note inserted successfully');
        response.send({
          success: true,
          status_code: resposnsCode.SUCCESS,
          message: 'Note inserted successfully',
          data: noteResult,
        });
        logger.info('SUCCESS001: note inserted successfully');
      }
    });
  };

  /**
   * @description Retrieve and return all greetings from the database.
   * @param {*} request does not take any parameter
   * @param {*} response sends response from server
   */
  findAllNotes = (request, response) => {
    logger.info('TRACKED_PATH: Inside controller');
    const start = new Date();
    const encodedBody = helper.getEncodedBodyFromHeader(request);
    noteServices.retrieveAllNotes(encodedBody.userId, (error, noteResult) => {
      if (error) {
        logger.error(`Some error occurred while retrieving notes ${error.message}`);
        response.send({
          success: error.success,
          status_code: error.statusCode,
          message: error.message,
        });
      } else {
        logger.info('SUCCESS002:All notes has been retrieved');
        response.send({
          success: noteResult.success,
          status_code: noteResult.statusCode,
          message: noteResult.message,
          data: noteResult.data,
        });
        logger.info('Request took:', new Date() - start, 'ms');
      }
    });
  };

  /**
   * @description Retrieve and return note associated with _id ,from the database.
   * @param {*} request takes _id that is greetingID
   * @param {*} response sends response from server
   */
  findNoteByNoteId = (request, response) => {
    logger.info('TRACKED_PATH: Inside controller');
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
            `ERR003: Note not found with id ${request.params.noteId}`,
          );
        } else {
          response.send({
            success: true,
            status_code: resposnsCode.SUCCESS,
            message: 'data retrived',
            data: noteResult,
          });
          logger.info('SUCCESS003: Data retrieved');
        }
      },
    );
  };

  /**
   * @description update note by _id
   * @param {*} request takes _id that is greetingID
   * @param {*} response sends response from server
   */
  updateNoteByNoteId = (request, response) => {
    logger.info('TRACKED_PATH: Inside controller');
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
            `ERR004: Note  not found with id ${request.params.noteId}`,
          );
        } else {
          response.send({
            success: true,
            status_code: resposnsCode.SUCCESS,
            message: 'Note has been updated',
            updated_data: noteResult,
          });
          logger.info('SUCCESS004: Note has been updated');
        }
      },
    );
  };

  /**
   * @description delete note  by _id that is noteId
   * @param {*} request takes _id that is noteId
   * @param {*} response sends response from server
   */
  deleteNoteByNoteId = (request, response) => {
    logger.info('TRACKED_PATH: Inside controller');
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
          message: 'Note deleted successfully!',
        });
        logger.info('SUCCESS004: Note deleted successfully!');
      }
    });
  }

  /**
   * @description add label to note by noteId and labelId
   * @param {*} request having noteId and labelId in its body
   * @param {*} response sends response from server
   */
  addLabel = (request, response) => {
    const requireDataToaddLabel = {
      noteId: request.body.noteId,
      labelId: request.body.labelId,
    };
    noteServices.updateNoteByAddingLabel(requireDataToaddLabel, (error, noteResult) => {
      if (error) {
        logger.error(`getting error ${error.message}`);
        response.send({
          success: error.success,
          status_code: error.status_code,
          message: error.message,
        });
      } else {
        logger.info('SUCCESS004: Note has been updated');
        response.send({
          success: noteResult.success,
          status_code: noteResult.status_code,
          message: noteResult.message,
          updated_data: noteResult.updated_data,
        });
      }
    });
  }

  /**
  * @description add user to note by noteId and userId
  * @param {*} request having noteId and userId in its body
  * @param {*} response sends response from server
  */
  addUserToNote = (request, response) => {
    const requireDataToaddUser = {
      noteId: request.body.noteId,
      userId: request.body.userId,
    };

    noteServices.updateNoteByAddingUser(requireDataToaddUser, (error, noteResult) => {
      if (error) {
        logger.error(`getting error ${error.message}`);
        response.send({
          success: error.success,
          status_code: error.status_code,
          message: error.message,
        });
      } else {
        logger.info('SUCCESS004: Note has been updated');
        response.send({
          success: noteResult.success,
          status_code: noteResult.status_code,
          message: noteResult.message,
          updated_data: noteResult.updated_data,
        });
      }
    });
  }

  /**
    * @description remove a label from note by noteId and labelId
    * @param {*} request having noteId and labelId in its body
    * @param {*} response sends response from server
    */
  removeLabel = (request, response) => {
    const requireDataToDeleteLabel = {
      noteId: request.body.noteId,
      labelId: request.body.labelId,
    };

    noteServices.updateNoteByRemovingLabel(requireDataToDeleteLabel, (error, noteResult) => {
      if (error) {
        logger.error(`getting error ${error.message}`);
        response.send({
          success: error.success,
          status_code: error.status_code,
          message: error.message,
        });
      } else {
        response.send({
          success: noteResult.success,
          status_code: noteResult.status_code,
          message: noteResult.message,
          updated_data: noteResult.updated_data,
        });
        logger.info('SUCCESS004: Note has been updated');
      }
    });
  }

  /**
    * @description remove a label from note by noteId and userlId
    * @param {*} request having noteId and userId in its body
    * @param {*} response sends response from server
    */
  removeUser = (request, response) => {
    const requireDataToDeleteUser = {
      noteId: request.body.noteId,
      userId: request.body.userId,
    };

    noteServices.updateNoteByRemovingUser(requireDataToDeleteUser, (error, noteResult) => {
      if (error) {
        logger.error(`getting error ${error.message}`);
        response.send({
          success: error.success,
          status_code: error.status_code,
          message: error.message,
        });
      } else {
        response.send({
          success: noteResult.success,
          status_code: noteResult.status_code,
          message: noteResult.message,
          updated_data: noteResult.updated_data,
        });
        logger.info('SUCCESS004: Note has been updated');
      }
    });
  }

  /**
   * @message delete note with id whitch is setting isDeleted value true
   * @method removeNote is service class method
   * @param response is used to send the response
   */
  deleteNote = (req, res) => {
    const noteID = req.params.noteId;
    const encodedBody = helper.getEncodedBodyFromHeader(req);
    const { userId } = encodedBody;
    try {
      noteServices.removeNote(userId, noteID, (error, data) => (
        error
          ? (logger.error(`note not found with id ${noteID}`),
            res.send({
              status_code: resposnsCode.NOT_FOUND,
              message: `note not found with id ${noteID}`,
            }))
          : logger.info('note deleted successfully!'),
        res.send({
          status_code: resposnsCode.SUCCESS,
          message: 'note deleted successfully!',
        })
      ));
    } catch (error) {
      return (
        error.kind === 'ObjectId' || error.title === 'NotFound'
          ? (logger.error(`could not found note with id${noteID}`),
            res.send({
              status_code: resposnsCode.NOT_FOUND,
              message: `note not found with id ${noteID}`,
            }))
          : logger.error(`Could not delete note with id ${noteID}`),
        res.send({
          status_code: resposnsCode.INTERNAL_SERVER_ERROR,
          message: `Could not delete note with id ${noteID}`,
        })
      );
    }
  }

  archiveNote = (req, res) => {
    const noteID = req.params.noteId;
    const encodedBody = helper.getEncodedBodyFromHeader(req);
    const { userId } = encodedBody;
    try {
      noteServices.archiveNoteData(userId, noteID, (error, data) => (
        error
          ? (logger.warn(`note not found with id ${noteID}`),
            res.send({
              status_code: resposnsCode.NOT_FOUND,
              message: `note not found with id ${noteID}`,
            }))
          : logger.info('note archived successfully!'),
        res.send({
          status_code: resposnsCode.SUCCESS,
          message: 'note archived successfully!',
        })
      ));
    } catch (error) {
      return (
        error.kind === 'ObjectId' || error.title === 'NotFound'
          ? (logger.error(`could not found note with id${noteID}`),
            res.send({
              status_code: resposnsCode.NOT_FOUND,
              message: `note not found with id ${noteID}`,
            }))
          : logger.error(`Could not delete note with id ${noteID}`),
        res.send({
          status_code: resposnsCode.INTERNAL_SERVER_ERROR,
          message: `Could not delete note with id ${noteID}`,
        })
      );
    }
  }

  unArchiveNote = (req, res) => {
    const noteID = req.params.noteId;
    const encodedBody = helper.getEncodedBodyFromHeader(req);
    const { userId } = encodedBody;
    try {
      noteServices.unArchiveNoteData(userId, noteID, (error, data) => (
        error
          ? (logger.warn(`note not found with id ${noteID}`),
            res.send({
              status_code: resposnsCode.NOT_FOUND,
              message: `note not found with id ${noteID}`,
            }))
          : logger.info('note UnArchived successfully!'),
        res.send({
          status_code: resposnsCode.SUCCESS,
          message: 'note UnArchived successfully!',
        })
      ));
    } catch (error) {
      return (
        error.kind === 'ObjectId' || error.title === 'NotFound'
          ? (logger.error(`could not found note with id${noteID}`),
            res.send({
              status_code: resposnsCode.NOT_FOUND,
              message: `note not found with id ${noteID}`,
            }))
          : logger.error(`Could not delete note with id ${noteID}`),
        res.send({
          status_code: resposnsCode.INTERNAL_SERVER_ERROR,
          message: `Could not delete note with id ${noteID}`,
        })
      );
    }
  }

  restoreNote = (req, res) => {
    const noteID = req.params.noteId;
    const encodedBody = helper.getEncodedBodyFromHeader(req);
    const { userId } = encodedBody;
    try {
      noteServices.restoreNoteData(userId, noteID, (error, data) => (
        error
          ? (logger.warn(`Note not found with id ${noteID}`),
            res.send({
              status_code: resposnsCode.NOT_FOUND,
              message: `Note not found with id ${noteID}`,
            }))
          : logger.info('Note restored successfully!'),
        res.send({
          status_code: resposnsCode.SUCCESS,
          message: 'Note restored successfully!',
        })
      ));
    } catch (error) {
      return (
        error.kind === 'ObjectId' || error.title === 'NotFound'
          ? (logger.error(`could not found note with id${noteID}`),
            res.send({
              status_code: resposnsCode.NOT_FOUND,
              message: `Note not found with id ${noteID}`,
            }))
          : logger.error(`Could not delete note with id ${noteID}`),
        res.send({
          status_code: resposnsCode.INTERNAL_SERVER_ERROR,
          message: `Could not delete note with id ${noteID}`,
        })
      );
    }
  }

  /**
    * @description : addCollaborator will add the Collaborator in the note
    */
  addCollaborator = (req, res) => {
    try {
      const encodedBody = helper.getEncodedBodyFromHeader(req);
      const data = {
        userToCollabrate: req.body.userToCollabrate,
        noteId: req.body.noteId,
        userId: encodedBody.userId,
      };
      noteServices.addCollaborator(data, (err, data) => {
        if (err) {
          logger.error(`getting error ${err}`);
          return res.status(400).send({
            success: false,
            message: 'Unable To Collaborate note',
            err,
          });
        } else {
          logger.info('Collaboratation successfull');
          return res.status(200).send({
            success: true,
            message: 'Collaboratation successfull.',
            data,
          });
        }
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: 'There is some internal error from server',
      });
    }
  };

  /**
   * @description add color to note by noteId and color
   * @param {*} request having noteId and color in its body
   * @param {*} response sends response from server
   */
  noteColor = (request, response) => {
    const validatedRequestResult = inputValidator.validateColorCode(request.body);
    if (validatedRequestResult.error) {
      logger.error('SCHEMAERROR: Request did not match with schema');
      response.send({
        success: false,
        status_code: resposnsCode.BAD_REQUEST,
        message: validatedRequestResult.error.details[0].message,
      });
      return;
    }
    const requireDataToaddColor = {
      noteId: request.body.noteId,
      color: request.body.color,
    };

    noteServices.addColorToNote(requireDataToaddColor, (error, noteResult) => {
      if (error) {
        logger.error(`getting error ${error}`);
        response.send({
          success: error.success,
          status_code: error.status_code,
          message: error.message,
        });
      } else {
        logger.info(`SUCCESS004: Note has been updated ${noteResult.message}`);
        response.send({
          success: noteResult.success,
          status_code: noteResult.status_code,
          message: noteResult.message,
        });
      }
    });
  }

  /**
   * @description : removeCollaborator is used to remove Collaborator from
    * @param {*} response sends response from server
   */
  removeCollaborator = (req, res) => {
    try {
      const encodedBody = helper.getEncodedBodyFromHeader(req);
      const data = {
        collaboratorId: req.body.collaboratorId,
        noteId: req.body.noteId,
        userId: encodedBody.userId,
      };
      noteServices.removeCollaborator(data).then(() => {
        logger.info('collaborator removed from note succesfully');
        res.status(200).send({
          success: true,
          message: 'collaborator removed from note succesfully',
        });
      }).catch((err) => {
        logger.error('Failed to remove collaborator', err);
        res.status(500).send({
          success: false,
          message: 'Failed to remove collaborator',
          err,
        });
      });
    } catch (err) {
      logger.error('Failed to remove collaborator', err);
      res.status(500).send({
        success: false,
        message: 'There is some internal error from server',
      });
    }
  }

  /**
   * @description save the image to db
   * @param {*} req having noteId and file detail
   * @param {*} res sends response from server
   */
  uploadImage = async (req, res) => {
    const response = {};
    let imageDetail = {
      noteId: req.body.noteId,
      image: req.file,
    };
    const validatedRequestResult = inputValidator.validateSearchTitle(imageDetail);
    if (validatedRequestResult.error) {
      logger.error('SCHEMAERROR: Request did not match with schema');
      res.send({
        success: false,
        status_code: resposnsCode.BAD_REQUEST,
        message: validatedRequestResult.error.details[0].message,
      });
      return;
    }
    try {
      imageDetail = {
        noteId: req.body.noteId,
        image: req.file.locaton,
      };
      await noteServices.uploadImage(imageDetail);
      logger.info('file uploaded Successfully...');
      response.status = true;
      response.message = 'file uploaded Successfully...!';
      return res.status(200).send(response);
    } catch (error) {
      logger.error('there is some error to upload...', error);
      response.status = false;
      response.message = 'there is some error to upload...!';
      return res.status(500).send(response);
    }
  }

  /**
  * @description search note by title
  * @param {*} req contains the title by which searching has to be done
  * @param {*} res sends response from server
  */
  searchNote = async (req, res) => {
    const response = {};
    const encodedBody = helper.getEncodedBodyFromHeader(req);
    let searchDetail = {
      title: req.body.title,
      userId: encodedBody.userId,
    };
    const validatedRequestResult = inputValidator.validateSearchTitle(searchDetail);
    if (validatedRequestResult.error) {
      logger.error('SCHEMAERROR: Request did not match with schema');
      res.send({
        success: false,
        status_code: resposnsCode.BAD_REQUEST,
        message: validatedRequestResult.error.details[0].message,
      });
      return;
    }
    try {
      searchDetail = {
        title: req.body.title,
        userId: encodedBody.userId,
      };
      let searchResult = await noteServices.serachNote(searchDetail);
      if ((searchResult.length) < 1) {
        logger.error('you do not have any note having with this title');
        return res.status(404).send({
          success: false,
          message: 'you do not have any note having with this title',
        });
      } else {
        logger.info('you do not have any note having with this title');
        return res.status(200).send({
          success: true,
          message: 'note found with given title',
          data: searchResult,
        });
      }
    } catch (error) {
      logger.error('there is some error to search Note...', error);
      response.status = false;
      response.message = 'there is some error to search Note...', error;
      return res.status(500).send(response);
    }
  }
}

module.exports = new NoteController();
