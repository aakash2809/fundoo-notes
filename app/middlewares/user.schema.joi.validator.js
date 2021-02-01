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
    name: joi.string().required().regex(/^[A-Z]{1}[a-zA-Z ]{2,}$/),
    email: joi.string().required(),
    password:joi.string().required().regex(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[\\~\\?\\.\\+\\-\\~\\!\\@\\#\\$\\%\\^\\&\\*\\_])[a-zA-Z0-9\\~\\?\\.\\+\\-\\~\\!\\@\\#\\$\\%\\^\\&\\*\\_]{8,}$/),
    confirmPassword: joi.string().required()
});

