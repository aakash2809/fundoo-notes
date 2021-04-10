const helper = require("../middlewares/helper");
const noteController = require(`../controllers/note`);

class NoteRoutes {
  routeToNoteController = (app) => {

    //Create a new note
    app.post('/addNote', helper.verifyToken, noteController.addNote);

    // Retrieve all notes
    app.get('/allNotes', helper.verifyToken, noteController.findAllNotes);

    // Retrieve a single note with noteId
    app.get('/uniqueNote/:noteId', helper.verifyToken, noteController.findNoteByNoteId);

    //Update a noteModel with noteId
    app.put('/updateNote/:noteId', helper.verifyToken, noteController.updateNoteByNoteId);

    //Update a noteModel by adding labels
    app.put('/addLabelToNote', helper.verifyToken, noteController.addLabel);

    //Update a noteModel by adding users
    app.put('/addUserToNote', helper.verifyToken, noteController.addUserToNote);

    //delete label from note
    app.put('/deleteLabelFromNote', helper.verifyToken, noteController.removeLabel);

    //delete User from note
    app.put('/deleteUserFromNote', helper.verifyToken, noteController.removeUser);

    //Delete a note with noteId
    app.delete('/notes/deleteforever/:noteId', helper.verifyToken, noteController.deleteNoteByNoteId);

    // delete note by setting isdeleted flag true
    app.put("/notes/delete/:noteId", helper.verifyToken, noteController.deleteNote);

    // Archive note by setting isarchived flag true
    app.put("/notes/archive/:noteId", helper.verifyToken, noteController.archiveNote);

    // UnArchive note by setting isarchived flag false
    app.put("/notes/unarchive/:noteId", helper.verifyToken, noteController.unArchiveNote);

    // restore note by setting isdeleted flag false
    app.put("/notes/restore/:noteId", helper.verifyToken, noteController.restoreNote);

    // delete note forever
    //app.delete("/notes/deleteforever/:noteId", helper.verifyToken, noteController.deleteForever);

  }
}

module.exports = new NoteRoutes
