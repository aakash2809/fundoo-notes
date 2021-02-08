/**
 * @module        middlewares\validation
 * @file          greeting.schema.js
 * @description   This file contains Joi validation object for schema validation
 * @requires      {@link https://www.npmjs.com/package/joi | joi}
 * @author        Aakash Rajak <aakashrajak2809@gmail.com>
*  @since         04/01/2021
----------------------------------------------------------------------------------------------------*/

const joi      = require('joi');

module.exports = joi.object({
    title: joi.string().required().regex(/^[A-Z]{1}[a-zA-Z ]{2,}$/),
    note: joi.string().required().regex(/^[A-Z]{1}[a-zA-Z ]{2,}$/),
});

