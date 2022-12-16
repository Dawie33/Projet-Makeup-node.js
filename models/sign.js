const Joi = require('joi');

const schema = Joi.object().keys({
    first_name: Joi.string().required(),
    name: Joi.string().required(),
    adresse: Joi.string().required(),
    telephone:Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    repassword: Joi.string().required().valid(Joi.ref('password')),
});

module.exports = schema;