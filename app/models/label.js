/**
 * @module       models
 * @file         labelModel.js
 * @description  This module is used for creating the schema and comunicate with mongodb
 *               through mongoose
 * @requires     {@link http://mongoosejs.com/|mongoose} 
 * @requires     logger is a reference to save logs in log files
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>
------------------------------------------------------------------------------------------*/

const mongoose = require(`mongoose`);
const logger = require("../../config/logger");

// defining mongodb schema for label
const LabelSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
},
  {
    timestamps: true
  });

LabelSchema.set("versionKey", false);

logger.info("inside model");
const Label = mongoose.model('Label', LabelSchema);

class LabelModel {
  /**
   * @description save request label data to database
   * @param {*} labelData holds data to be saved in json formate
   */
  saveLabel = (labelData) => {
    return new Promise((resolve, reject) => {
      const label = new Label(labelData);
      label.save((error, labelResult) => {
        if (error) {
          return reject(error)
        } else {
          return resolve(labelResult)
        }
      })
    })
  }

  /**
   * @description retrive all label data from database
   */
  getAllLabels = (userId, callback) => {
    logger.info(`TRACKED_PATH: Inside model`);
    Label.find({ userId: userId }, (error, labelData) => {
      error ? callback(error, null) : callback(null, labelData);
    });
  };

  /**
   * @description remove label data from database
   * @param {*}labelData holds _id that is label  id
   */
  deleteLabelByLabelId = (labelId) => {
    return new Promise((resolve, reject) => {
      Label.findByIdAndDelete(labelId, (error, labelResult) => {
        if (error) {
          return reject(error)
        } else {
          return resolve(labelResult)
        }
      })
    })
  }

  /**
   * @description update label data existed in database
   * @param {*} labelId holds _id that is label id
   * @param {*} dataToUpdate takes data to be upadated in json formate
   */
  updateLabelByLabelId = (labelId, dataToUpdate) => {
    return new Promise((resolve, reject) => {
      Label.findByIdAndUpdate(labelId, dataToUpdate, { new: true, }, (error, labelResult) => {
        if (error) {
          return reject(error)
        } else {
          return resolve(labelResult)
        }
      })
    })
  }
}

module.exports = new LabelModel();
