const Joi = require("joi");

const validateUserData = (userData) => {
    // let schema = Joi.object().keys({
    //     firstName: Joi.string().required().max(20).min(3),
    //     lastName: Joi.string().allow(null, ""),
    //     emailId: Joi.string().email().required()
    // });
    // return schema.validate(userData, { abortEarly: false });

    return Joi.object().keys({
        firstName: Joi.string().required().max(20).min(3),
        lastName: Joi.string().allow(null, ""),
        emailId: Joi.string().email().required(),
        password: Joi.string().min(5).required(),
        phone: Joi.string().length(10).pattern(/^\d+$/).required(),
        age: Joi.number().min(18).max(65),
        photoUrl: Joi.string(),
        gender: Joi.string().valid("male", "female", "others"),
        skills: Joi.array().items(Joi.string())
    }).validate(userData, { abortEarly: false });
}

// let schema = Joi.object().keys({
//     firstName: Joi.string().required().max(20).min(3),
//     lastName: Joi.string().allow(null, ""),
//     emailId: Joi.string().email().required()
// });

// let { error, value } = schema.validate(userData, { abortEarly: false });

module.exports = {
    validateUserData
}