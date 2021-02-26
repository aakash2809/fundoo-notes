const helper = require("../middlewares/helper");
const noteController = require(`../controllers/note`);

class NoteRoutes {
  routeToNoteController = (app) => {

    //Create a new note
    app.post('/addNote', helper.verifyToken, noteController.addNote);

    // Retrieve all notes
    app.get('/allNotes', helper.verifyToken, noteController.findAllNotes);
    //app.get('/allNotes', helper.verifyToken, helper.getNotesDetail, noteController.findAllNotes);

    // Retrieve a single note with noteId
    app.get('/uniqueNote/:noteId', helper.verifyToken, noteController.findNoteByNoteId);

    //Update a noteModel with noteId
    app.put('/updateNote/:noteId', helper.verifyToken, noteController.updateNoteByNoteId);

    //Update a noteModel by adding labels
    app.put('/addLabelToNote', helper.verifyToken, noteController.addLabel);

    //delete label from note
    app.put('/deleteLabelFromNote', helper.verifyToken, noteController.removeLabel);

    //Delete a note with noteId
    app.delete('/note/:noteId', helper.verifyToken, noteController.deleteNoteByNoteId);
  }
}

module.exports = new NoteRoutes
