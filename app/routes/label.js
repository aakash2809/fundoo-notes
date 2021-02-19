const helper = require("../middlewares/helper");
const labelController = require(`../controllers/label`);

class LabelRoutes {
  routeToLabelController = (app) => {
    //Create a new label
    app.post('/addlabel', helper.verifyToken, labelController.addlabel);

    // Retrieve all label
    app.get('/labels', helper.verifyToken, helper.redisClient, labelController.findAllLabels);

    app.put('/updateLabel/:labelId', helper.verifyToken, labelController.updateLabelByLabelId);

    //Delete a note with labelId
    app.delete('/label/:labelId', helper.verifyToken, labelController.deleteLabelByLabelId);
  }
}

module.exports = new LabelRoutes
