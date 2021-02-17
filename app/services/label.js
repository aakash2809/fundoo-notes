/**
 * @module         services
 * @file           note.js
 * @description    This file contain all the service method for notes
 * @requires       noteModel  is refrence to invoke methods of noteModel.js     
 * @author         Aakash Rajak <aakashrajak2809@gmail.com>        
------------------------------------------------------------------------------------------*/
const labelModel = require("../models/label");
const logger = require("../../config/logger");

class LabelServices {

  /**
   * @description save request data to database using model methods
   * @param {*}  holds data to be saved in json formate
   * @param {*} callback holds a function
   */
  savelabelData = async (labelData) => {
    try {
      const result = await labelModel.saveLabel(labelData);
      return result;
    } catch (error) {
      return error;
    }
  }


  /**
   * @description retrive all note  data from database using model's mothod
   * @param {*} callback holds a function
   */
  /*  retrieveAllLabel = (userId, callback) => {
     logger.info(`TRACKED_PATH: Inside services`);
     labelModel.getAllLabels(userId, (error, labelResult) => {
       error ? callback(error, null) : callback(null, labelResult);
     });
   };
  */
  retrieveAllLabel = async (userId) => {
    logger.info(`TRACKED_PATH: Inside services`);
    try {
      const result = await labelModel.getAllLabels(userId);
      return result;
    } catch (error) {
      return error;
    }
  }

  /**
   * @description remove note  data from database using model's mothod
   * @param {*}  holds _id that is note id
   * @param {*} callback holds a function
   */
  /*  removeNoteById = (labelId, callback) => {
     logger.info(`TRACKED_PATH: Inside services`);
     labelModel.deleteLabelByLabelId(labelId, (error, labelResult) => {
       error ? callback(error, null) : callback(null, labelResult);
     });
   }; */

  removeNoteById = async (labelId) => {
    logger.info(`TRACKED_PATH: Inside services`);
    try {
      const result = await labelModel.deleteLabelByLabelId(labelId);
      console.log("service layer ", result)
      return result;
    } catch (error) {
      console.log("service layer error", error)
      return error;
    }
  }
  /**
   * @description update note  data existed in database, using model's mothod
   * @param {*} labelId holds _id that is note  id
   * @param {*} dataToReplace takes data to be upadated in json formate
   * @param {*} callback holds a function
   */


  updateNoteById = async (labelId, dataToReplace) => {
    logger.info(`TRACKED_PATH: Inside services`);
    try {
      const result = await labelModel.updateLabelByLabelId(labelId, dataToReplace);
      console.log("service layer ", result)
      return result;
    } catch (error) {
      console.log("service layer error", error)

      return error;
    }
  }

}

module.exports = new LabelServices();
