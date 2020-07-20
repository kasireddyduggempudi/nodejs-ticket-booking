const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const userSchema = new mongoose.Schema({
    name: {type: String, require: true},
    gender: {type: String, required: true, minlength: 1, maxlength: 1},
    email: {type: String, required: true, unique: true},
    role: {type: String, default: "USER"},
    password:{type: String, required: true, minlength: 6, maxlength: 10}
})

function validateUser(user){
    // schema for required input from user

    /* this is old version code for version: 14.x.x
    const schema = {
        name: Joi.string().required(),
        gender: Joi.string().min(1).max(1).required(),
        email: Joi.string().email().required(),
        role: Joi.string().required(),
        password: Joi.string().min(6).max(10).required()
    }
    return Joi.validate(user, schema);
    
    this won't work now*/

    // new version code, version: 17.x.x
    const schema = Joi.object({
        name: Joi.string().required(),
        gender: Joi.string().min(1).max(1).required(),
        email: Joi.string().email({minDomainSegments: 2}).required(),
        //role: Joi.string().valid("USER", "ADMIN"),
        password: Joi.string().min(6).max(10).required() 
    });

    // this schema won't allow user to have keys other than defined here, and values also should cope up with these rules

    return schema.validate(user);
}

module.exports.userSchema = userSchema;
module.exports.validateUser = validateUser;