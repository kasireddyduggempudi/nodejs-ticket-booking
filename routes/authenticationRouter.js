const express = require("express");
const {User} = require("../models/userModel");
const {validateUser} = require("../schemas/userSchema")
const {getJwtToken} = require("../security/jwtService");
const Joi = require("@hapi/joi");

const router = express.Router();

// public api
router.post("/signUp", async(req, res)=>{
    const {error} = validateUser(req.body);
    if(error) return res.status(400).send("Invalid request: "+error.message);
    const user = new User(req.body);
    try{
        const result = await user.save();
        // creating token
        const payload = {userId: result._id, name:result.name, gender: result.gender, role: result.role};
        const token = getJwtToken(payload);
        const response = {message:"succcess", token:token};
        return res.send(response);
    }catch(error){
        return res.status(400).send("Invalid details: "+error);
    }
})

// public api
router.post("/login", async(req,res)=>{
    const credentials = req.body;
    const {error} = validateLoginCredentials(credentials);
    if(error) return res.status(400).send("Invalid credentials: "+error.message);
    try{
        const user = await User.findOne({email: credentials.email});
        if(!user || user.password != credentials.password) return res.status(400).send("Invalid email or password");
        // successfully logged in, now creating token
        const payload = {userId: user._id, name: user.name, gender: user.gender, role: user.role};
        const token = getJwtToken(payload);
        const response = {message: "success", token: token};
        return res.send(response);
    }catch(error){
        res.status(400).send("Error while logging in: "+error);
    }

})

function validateLoginCredentials(credentials){
    const schema = Joi.object({
        email: Joi.string().email({minDomainSegments: 2}).required(),
        password: Joi.string().min(6).max(10).required()
    });

    return schema.validate(credentials);
}

module.exports.authenticationRouter = router;