/**
 * @module        middlewares\validation
 * @file         js
 * @description   This file contains Joi validation object for schema validation
 * @requires      {@link https://www.npmjs.com/package/joi | joi}
 * @author        Aakash Rajak <aakashrajak2809@gmail.com>
*  @since        
----------------------------------------------------------------------------------------------------*/

const joi = require('joi');

module.exports = joi.object({
    label: joi.string().required()
});