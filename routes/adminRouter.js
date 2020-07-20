const express = require("express");
const router = express.Router();

// import models
const {User} = require("../models/userModel");
const {Ticket} = require("../models/ticketModel");

// import validateUser
const {validateUser} = require("../schemas/userSchema");

/**
 * This is only for ADMIN
 */

router.get("/",  function(req, res){
    res.send("welcome to admin portal!!!");
})


router.post("/addAdmin", async(req, res)=>{
    const {value, error} = validateUser(req.body);
    if(error) return res.status(400).send("Invalid data: "+error.message);
    let user = new User(req.body);
    user.role = "ADMIN";
    try{
        let result = await user.save();
        res.send(result);
    }catch(error){
        res.status(400).send(error);
    }
})

router.post("/createTickets",async(req, res)=>{
    let tickets = [];
    let ticket;
    for(let i=1;i<=40;i++){
        ticket = new Ticket({seatNumber: i});
        tickets.push(ticket);
    }
    try{
        // first remove all previous tickets
        await Ticket.remove();
        const result = await Ticket.insertMany(tickets);
        return res.send(result);
    }catch(error){
        return res.status(400).send("Error in creating tickets: "+error);
    }
})

router.post("/resetTickets", async(req, res)=>{
    try{
        const result = await Ticket.updateMany({},{available:true, bookingUserId: null});
        return res.send(result);
    }catch(error){
        return res.status(400).send("Error in resetting tickets: "+error);
    }
})

router.get("/getTickets", async(req, res)=>{
    try{
        const tickets = await Ticket.find();
        return res.send(tickets);
    }catch(error){
        return res.status(400).send("Error in fetching tickets");
    }
})

module.exports.adminRouter = router;