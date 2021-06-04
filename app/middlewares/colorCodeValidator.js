/**
 * @module        middlewares\colorCodeValidation
 * @file          colorCodeValidation.js
 * @description   This file contains Joi validation object for schema validation
 * @requires      {@link https://www.npmjs.com/package/joi | joi}
 * @author        Aakash Rajak <aakashrajak2809@gmail.com>
----------------------------------------------------------------------------------------------------*/

const joi = require('joi');

module.exports = joi.object({
    color: joi.string().regex(/^#[A-Fa-f0-9]{6}$/),
    noteId: joi.string()
});
