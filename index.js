require('dotenv').config()  // for heroku deployment
const mongoose = require("mongoose");
const express = require("express");
const app = express();

// import routes
const {adminRouter} = require("./routes/adminRouter");
const {authenticationRouter} = require("./routes/authenticationRouter");
const {ticketRouter} = require("./routes/ticketRouter");

// import middlewares
const {checkAdmin, checkLogin} = require("./middlewares/authorization");


// connecting to mongo
mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/ticketbooking", {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>console.log("successfully connected to mongodb..."))
    .catch(err=>console.log(err));

// middleware to let nodejs to convert req object into json while getting an http request
// otherwise, we can't access req.body...
app.use(express.json())


// don't use app.use for http request, because, it serves for every request that starts with given path
app.get("/",(req,res)=>{
    res.status(200).send("hello world");
})

// authenticationRouter will handle signUp and login which are public
app.use("/api/public/",authenticationRouter);

// ticketRouter will handle all ticket related apis. User needs to be logged in to use these apis
app.use("/api/ticket/",checkLogin,  ticketRouter);

// adminRouter which handles admin apis, here checkAdmin is middleware to check if user is admin
app.use("/api/admin", checkAdmin, adminRouter);


// server creation
const port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log(`listening on  port: ${port}`); // es6 feature
})