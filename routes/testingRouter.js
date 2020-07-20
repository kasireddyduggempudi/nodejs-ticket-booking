const express = require("express");
const jwtService = require("../security/jwtService");

//import Models
const {Ticket} = require("../models/ticketModel");

const router = express.Router();

/**
 * This is used for testing purpose. Not meant to be used in application. That's why no routing is there to this in index.js
 */

router.get("/",(req,res)=>{
    res.send("Welcome to testing!!!")
})

router.get("/getToken",(req,res)=>{
    let token;
    let payload = {_id:"1", name:"kasi", role:"USER"}
    try{
        token = jwtService.getJwtToken(payload);
    }catch(error){
        res.status(400).send("Error: "+error);
    }
    res.send(token);
})

router.get("/verifyToken/:token", (req, res)=>{
    let token = req.params.token;
    let payload;
    try{
        payload = jwtService.verifyToken(token);
    }catch(error){
        res.status(400).send(error);
    }
    res.send(payload);
})

router.get("/addTicket/:seatNumber",async(req,res)=>{
    const ticket = new Ticket({seatNumber: req.params.seatNumber});
    let result;
    try{
        result = await ticket.save();
    }catch(error){
        return res.status(400).send(error);
    }
    res.send(result);
})


router.get("/getTickets",async(req,res)=>{
    let tickets = await Ticket.find();
    return res.send(tickets);
})

router.get("/deleteAllTickets", async(req, res)=>{
    let result = await Ticket.remove({});
    res.send(result);
})


module.exports.testingRouter = router;