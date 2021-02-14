const jwtAuth = require("../middlewares/JwtAuth");
const noteController = require(`../controllers/note`);

class NoteRoutes {
    routeToNoteController = (app) => {
    
    //Create a new note
    app.post('/addNote',jwtAuth.verifyToken, noteController.addNote);

    // Retrieve all notes
    app.get('/allNotes',jwtAuth.verifyToken, noteController.findAllNotes);

    // Retrieve a single note with noteId
    app.get('/uniqueNote/:noteId',jwtAuth.verifyToken, noteController.findNoteByNoteId);

    //Update a noteModel with noteId
    app.put('/updateNote/:noteId',jwtAuth.verifyToken, noteController.updateNoteByNoteId);

    //Delete a note with noteId
     app.delete('/note/:noteId',jwtAuth.verifyToken, noteController.deleteNoteByNoteId);
    }
  }
  
  module.exports = new NoteRoutes
  