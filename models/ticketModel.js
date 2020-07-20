const mongoose = require("mongoose");
const {ticketSchema} = require("../schemas/ticketSchema"); // destructuring

const Ticket = mongoose.model("Ticket", ticketSchema); // collection name will be: tickets

module.exports.Ticket = Ticket;