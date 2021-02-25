/**
 * @module         services
 * @file           label.js
 * @description    This file contain all the service method for label
 * @requires       labelModel is refrence to invoke methods of labelModel.js     
 * @author         Aakash Rajak <aakashrajak2809@gmail.com>        
------------------------------------------------------------------------------------------*/

const labelModel = require("../models/label");
const logger = require("../../config/logger");
const resposnsCode = require("../../util/staticFile.json");
const helper = require("../middlewares/helper");

class LabelServices {

  /**
   * @description save request data to database using model methods
   * @param {*}  holds data to be saved in json formate
   */
  savelabelData = async (labelData) => {
    try {
      return await labelModel.saveLabel(labelData);
    } catch (error) {
      return error;
    }
  }

  /**
   * @description retrive all label data from database using model's mothod
   * @param {*} userId holds a userId
   */
  retrieveAllLabel = async (userId) => {
    logger.info(`TRACKED_PATH: Inside services`);
    try {
      const result = await labelModel.getAllLabels(userId);
      helper.setLabelToCache(userId, result);
      //helper.setNoteToCache(`LABEL_${userId}`, noteResult),
      return result;
    } catch (error) {
      return error;
    }
  }

  /**
   * @description remove label from database using model's mothod
   * @param {*}  holds _id that is label id
   */
  removeLabelByLabelId = async (labelId, userId) => {
    logger.info(`TRACKED_PATH: Inside services`);
    try {
      const result = await labelModel.deleteLabelByLabelId(labelId);
      let responseResult = "";
      if (result == null) {
        responseResult = {
          success: false,
          statusCode: resposnsCode.NOT_FOUND,
          message: `Label not found with ${labelId}`
        }
        return responseResult;
      } else {
        responseResult = {
          success: true,
          statusCode: resposnsCode.SUCCESS,
          message: 'Label deleted successfully!'
        }
        this.retrieveAllLabel(userId);
        return responseResult;
      }
    } catch (error) {
      return error;
    }
  }

  /**
   * @description update label data existed in database, using model's mothod
   * @param {*} labelId holds _id that is label id
   * @param {*} dataToReplace takes data to be upadated in json formate
   */
  updateLabelByLabelId = async (labelId, dataToReplace, userId) => {
    logger.info(`TRACKED_PATH: Inside services`);
    try {
      const result = await labelModel.updateLabelByLabelId(labelId, dataToReplace);
      console
      let responseResult = "";
      if (result == null) {
        responseResult = {
          success: false,
          statusCode: resposnsCode.NOT_FOUND,
          message: `Label not found with ${labelId}`
        }

        return responseResult;
      } else {
        responseResult = {
          success: true,
          statusCode: resposnsCode.SUCCESS,
          message: 'Label updated successfully!'
        }
        this.retrieveAllLabel(userId);
        return responseResult;
      }
    } catch (error) {
      return error;
    }
  }
}

module.exports = new LabelServices();
