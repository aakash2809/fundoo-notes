const jwtAuth = require("../middlewares/JwtAuth");
const labelController = require(`../controllers/label`);

class NoteRoutes {
  routeToNoteController = (app) => {
    //Create a new note
    app.post('/addlabel', jwtAuth.verifyToken, labelController.addlabel);

    // Retrieve all notes
    app.get('/labels', jwtAuth.verifyToken, labelController.findAllLabels);

    //Update a noteModel with noteId
    app.put('/updateLabel/:labelId', jwtAuth.verifyToken, labelController.updateLabelByLabelId);

    //Delete a note with noteId
    app.delete('/label/:labelId', jwtAuth.verifyToken, labelController.deleteNoteByNoteId);
  }
}

module.exports = new NoteRoutes
