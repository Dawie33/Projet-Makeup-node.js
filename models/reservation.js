const Joi = require('joi');

const schema = Joi.object().keys({
    name: Joi.string().required(),
    first_name: Joi.string().required(),
    prestation: Joi.string().required(),
    date: Joi.string().required(),
    adress:Joi.string().required(),
    people_number: Joi.string().email().required(),
    description: Joi.string().required(),
});

module.exports = schema;