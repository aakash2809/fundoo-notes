const helper = require("../middlewares/helper");
const noteController = require(`../controllers/note`);

class NoteRoutes {
  routeToNoteController = (app) => {

    //Create a new note
    app.post('/addNote', helper.verifyToken, noteController.addNote);

    // Retrieve all notes
    app.get('/allNotes', helper.verifyToken, helper.redisClient, noteController.findAllNotes);

    // Retrieve a single note with noteId
    app.get('/uniqueNote/:noteId', helper.verifyToken, noteController.findNoteByNoteId);

    //Update a noteModel with noteId
    app.put('/updateNote/:noteId', helper.verifyToken, noteController.updateNoteByNoteId);

    //Delete a note with noteId
    app.delete('/note/:noteId', helper.verifyToken, noteController.deleteNoteByNoteId);
  }
}

module.exports = new NoteRoutes
