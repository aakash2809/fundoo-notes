/**
 * @module        middlewares\inputValidation
 * @file          inputValidation.js
 * @description   This file contains Joi validation object for schema validation
 * @requires      {@link https://www.npmjs.com/package/joi | joi}
 * @author        Aakash Rajak <aakashrajak2809@gmail.com>
----------------------------------------------------------------------------------------------------*/
const joi = require('joi');

class Validator {
  /**
   * @description validate userDetail by described joi rules
   * @param userDetail having all user detail which is to be validated
   */
  validateUser = (userDetail) => {
    const userValidationRule = joi.object({
      name: joi.string().required().regex(/^[A-Z]{1}[a-zA-Z ]{2,}$/),
      lastName: joi.string(),
      email: joi.string().required(),
      password: joi.string().required().regex(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[\\~\\?\\.\\+\\-\\~\\!\\@\\#\\$\\%\\^\\&\\*\\_])[a-zA-Z0-9\\~\\?\\.\\+\\-\\~\\!\\@\\#\\$\\%\\^\\&\\*\\_]{8,}$/),
      confirmPassword: joi.string().required(),
    });
    return userValidationRule.validate(userDetail);
  }

  /**
   * @description validate lable Detail by described joi rules
   * @param lableData having all lable detail which is to be validated
   */
  validateLabel = (lableData) => {
    const lableRules = joi.object({
      label: joi.string().required(),
    });
    return lableRules.validate(lableData);
  }

  /**
   * @description validate note Detail by described joi rules
   * @param noteData having all note detail which is to be validated
   */
  validateColorCode = (noteData) => {
    const noteColorRules = joi.object({
      color: joi.string().regex(/^#[A-Fa-f0-9]{6}$/),
      noteId: joi.string(),
    });
    return noteColorRules.validate(noteData);
  }

  /**
  * @description validate note Detail for uploading image by described joi rules
  * @param noteData having all note detail which is to be validated
  */
  validateImageUploadData = (noteData) => {
    const imageUploadRules = joi.object({
      noteId: joi.string().required(),
      image: joi.required(),
    });
    return imageUploadRules.validate(noteData);
  }

  /**
    * @description validate note Detail for search note by title joi rules
    * @param searchDetail  having all search detail which is to be validated
    */
  validateImageUploadData = (searchDetail) => {
    const searchRules = joi.object({
      title: joi.string().required(),
      userId: joi.string().required(),
    });
    return searchRules.validate(searchDetail);
  }
}

module.exports = new Validator();
