const mongoose = require("mongoose");
const {userSchema} = require("../schemas/userSchema");  // using destructuring

const User = mongoose.model("User", userSchema); // collection name will be: lowercase(model)+"s", here User is model

module.exports.User = User;