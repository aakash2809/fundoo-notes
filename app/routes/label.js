const jwtAuth = require("../middlewares/JwtAuth");
const labelController = require(`../controllers/label`);

class LabelRoutes {
  routeToNoteController = (app) => {
    //Create a new label
    app.post('/addlabel', jwtAuth.verifyToken, labelController.addlabel);

    // Retrieve all label
    app.get('/labels', jwtAuth.verifyToken, labelController.findAllLabels);

    //Update a labelModel with labelId
    app.put('/updateLabel/:labelId', jwtAuth.verifyToken, labelController.updateLabelByLabelId);

    //Delete a note with labelId
    app.delete('/label/:labelId', jwtAuth.verifyToken, labelController.deleteLabelByLabelId);
  }
}

module.exports = new LabelRoutes
