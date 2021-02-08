const userControllers = require(`../controllers/userControllers/user`);
const jwtAuth = require("../../app/middlewares/JwtAuth");
const noteController = require(`../controllers/noteControllers/note`);
class Routes {
    routeToController = (app) => {
    app.post('/register', userControllers.register);
    app.post('/login', userControllers.login);
    app.post('/forgotPassword',userControllers.forgotPassword);
    app.put('/resetPassword',jwtAuth.verifyToken ,userControllers.restPassword);

    //Create a new note
    app.post('/addNote', noteController.addNote);

    // Retrieve all notes
    app.get('/allNotes', noteController.findAllNotes);

    // Retrieve a single note with noteId
    app.get('/uniqueNote/:noteId', noteController.findNoteByNoteId);

    //Update a noteModel with noteId
    app.put('/updateNote/:noteId', noteController.updateNoteByNoteId);

    //Delete a note with noteId
     app.delete('/note/:noteId', noteController.deleteNoteByNoteId);
    }
  }
  
  module.exports = new Routes