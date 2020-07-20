const {verifyToken} = require("../security/jwtService");

function checkLogin(req, res, next){
    const token = req.header("x-auth-token"); // taking token from header
    if(!token) return res.status(401).send("Access denied. Please login...");
    //validate token and get payload which is user details
    try{
        const payload = verifyToken(token);
        req.user = payload; // payload contains userId, name, gender, role
        next();
    }catch(error){
        return res.status(400).send("Invalid token: "+error);
    }
}

function checkAdmin(req, res, next){
    const token = req.header("x-auth-token"); // taking token from header
    if(!token) return res.status(401).send("Access denied. Please login...");
    // validate token and get payload which is user details
    try{
        const payload = verifyToken(token);
        if(!payload.role || payload.role != "ADMIN") return res.status(403).send("Forbidden error");
        req.user = payload;
        next()
    }catch(error){
        return res.status(400).send("Invalid token: "+error);
    }
}

module.exports.checkAdmin = checkAdmin;
module.exports.checkLogin = checkLogin;