const express = require("express");

//import Models
const {Ticket} = require("../models/ticketModel");
const {User} = require("../models/userModel");

const {validateTicketSchema} = require("../schemas/ticketSchema");

const router = express.Router();

router.post("/bookTicket", async(req, res)=>{
    const {error} = validateTicketSchema(req.body);
    if(error) return res.status(400).send("Invalid request: "+error.message);
    try{
        const ticket = await Ticket.findOne({seatNumber: req.body.seatNumber});
        if(!ticket.available) return res.status(400).send("Seat not available. Please check once");
    
        // updating the ticket status
        const updateResult = await Ticket.updateOne({seatNumber: req.body.seatNumber, version: ticket.version}, {available: false, bookingUserId: req.user.userId, $inc: {version: 1} });
        if(updateResult.nModified == 0) return res.status(500).send("Somethig went wrong. Please check the seat availability once...");
        return res.send("Booked successfully....");
    }catch(error){
        return res.status(400).send("Error: "+error);
    }

})

router.put("/cancelTicket/:ticketId", async(req, res)=>{
    // cancels ticket based on ticketId if it is booked by that user
    try{
        const ticket = await Ticket.findById(req.params.ticketId);
        if(!ticket) return res.status(400).send("Invalid ticketId");
    
        // check if that ticket is booked by the current user, otherwise bad request  exception
        if(ticket.available || !ticket.bookingUserId || ticket.bookingUserId != req.user.userId) return res.status(400).send("Invalid request. Malformed request.");
    
        // updating ticket status
        const updateResult = await Ticket.findByIdAndUpdate(req.params.ticketId, {available: true, bookingUserId: null, $inc: {version: 1}});
        return res.send("Cacelled successfully...");
    }catch(error){
        return res.status(400).send("Error in cancelling ticket: "+error);
    }
})

router.get("/getStatus/:ticketId", async(req, res)=>{
    try{
        const ticket = await Ticket.findById(req.params.ticketId, {available: 1});
        if(!ticket) return res.status(400).send("Invalid ticketId");
    
        return res.send(ticket);
    }catch(error){
        return res.status(400).send("Error in getting ticket status: "+error);
    }
})

router.get("/getBookedTickets", async(req, res)=>{
    try{
        const bookedTickets = await Ticket.find({available: false}, {seatNumber:1});
        return res.send(bookedTickets);
    }catch(error){
        return res.status(400).send("Error: "+error);
    }

})

router.get("/getAvailableTickets", async(req, res)=>{
    try{
        const availTickets = await Ticket.find({available: true}, {seatNumber: 1});
        return res.send(availTickets);
    }catch(error){
        return res.status(400).send("Error: "+error);
    }
})

router.get("/getUserDetails/:ticketId", async(req, res)=>{
    try{
        const ticket = await Ticket.findById(req.params.ticketId);
        if(!ticket) return res.status(400).send("Invalid ticketId");

        if(ticket.available || !ticket.bookingUserId) return res.status(400).send("No user booked this ticket.");

        // check user is either admin or bookingUser of this ticket. Otherwise, throw error
        if(req.user.userId != ticket.bookingUserId && req.user.role != "ADMIN" ) return res.status(400).send("Invalid request. Malformed request");

        // fetch user details except password
        const user = await User.findOne({_id: ticket.bookingUserId},{password: 0} );
        return res.send(user);
    }catch(error){
        return res.status(400).send("Error in getting userDetails: "+error);
    }
})

module.exports.ticketRouter = router;