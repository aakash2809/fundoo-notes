/**
* @file          routes.js
* @description   This file contains all routes availbe for application
* @author        Aakash Rajak <aakashrajak2809@gmail.com>
*--------------------------------------------------------------------------------------*/

const helper = require('./middlewares/helper');
const labelController = require('./controllers/label');
const noteController = require('./controllers/note');
const userControllers = require('./controllers/user');
const upload = require('../config/s3config');

class Routes {
  routeToControllers = (app) => {
    /** *********************************************************************************
         * @description routes for lables
      ********************************************************************************** */
    // Create a new label
    app.post('/addlabel', helper.verifyToken, labelController.addlabel);

    // Retrieve all label
    app.get('/labels', helper.verifyToken, labelController.findAllLabels);

    // Update label by lavelId
    app.put('/updateLabel/:labelId', helper.verifyToken, labelController.updateLabelByLabelId);

    // Delete a note with labelId
    app.delete('/label/:labelId', helper.verifyToken, labelController.deleteLabelByLabelId);

    /** *********************************************************************************
        * @description routes for notes
        ********************************************************************************** */
    // Create a new note
    app.post('/addNote', helper.verifyToken, noteController.addNote);

    // Retrieve all notes
    app.get('/allNotes', helper.verifyToken, noteController.findAllNotes);

    // Retrieve a single note with noteId
    app.get('/uniqueNote/:noteId', helper.verifyToken, noteController.findNoteByNoteId);

    // Update a noteModel with noteId
    app.put('/updateNote/:noteId', helper.verifyToken, noteController.updateNoteByNoteId);

    // Update a noteModel by adding labels
    app.put('/addLabelToNote', helper.verifyToken, noteController.addLabel);

    // Update a noteModel by adding users
    app.put('/addUserToNote', helper.verifyToken, noteController.addUserToNote);

    // delete label from note
    app.put('/deleteLabelFromNote', helper.verifyToken, noteController.removeLabel);

    // delete User from note
    app.put('/deleteUserFromNote', helper.verifyToken, noteController.removeUser);

    // Delete a note with noteId
    app.delete('/notes/deleteforever/:noteId', helper.verifyToken, noteController.deleteNoteByNoteId);

    // delete note by setting isdeleted flag true
    app.put('/notes/delete/:noteId', helper.verifyToken, noteController.deleteNote);

    // Archive note by setting isarchived flag true
    app.put('/notes/archive/:noteId', helper.verifyToken, noteController.archiveNote);

    // UnArchive note by setting isarchived flag false
    app.put('/notes/unarchive/:noteId', helper.verifyToken, noteController.unArchiveNote);

    // restore note by setting isdeleted flag false
    app.put('/notes/restore/:noteId', helper.verifyToken, noteController.restoreNote);

    // add color to note
    app.post('/noteColor', helper.verifyToken, noteController.noteColor);

    // upload image to note
    app.post('/uploadImage', helper.verifyToken, upload.single('image'), noteController.uploadImage);

    // add collaborator
    app.post('/addCollaborator', helper.verifyToken, noteController.addCollaborator);

    // remove collaborator
    app.delete('/removeCollaborator', helper.verifyToken, noteController.removeCollaborator);

    // Search a note from db
    app.post('/searchNote', helper.verifyToken, noteController.searchNote);

    // get paginated notes from db
    app.get('/NotesPagination', helper.verifyToken, noteController.paginatenNotes);

    /** *********************************************************************************
      * @description routes for user
      ********************************************************************************** */
    app.post('/register', userControllers.register);
    app.post('/activateEmail', userControllers.activateAccount);
    app.post('/login', userControllers.login);
    app.post('/forgotPassword', userControllers.forgotPassword);
    app.put('/resetPassword', helper.verifyToken, userControllers.restPassword);
  }
}

module.exports = new Routes();
