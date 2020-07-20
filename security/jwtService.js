const jwt = require("jsonwebtoken");

const {properties} = require("../config");

function getJwtToken(payload){
    // payload is user data
    let token =  jwt.sign(payload, properties.secretKey);
    return token;
}

function verifyToken(token){
    // returns payload if token is valid
    let user = jwt.verify(token, properties.secretKey);
    return user;
}

module.exports.getJwtToken = getJwtToken;
module.exports.verifyToken = verifyToken;
