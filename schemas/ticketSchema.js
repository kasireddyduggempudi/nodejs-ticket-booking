const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const ticketSchema = new mongoose.Schema({
    // for now busId is string of length 4, say bus1
    // also, seatNumber is unique for time being
    // here, we also include bookingUserId which will represent the userId of an user who has booked that ticket
    // we can update the ticket status, and userBookingId using the cancelTicket
    busId:{type: String, default:"bus1"},
    seatNumber: {type:Number, min:1, required:true, unique:true},
    available:{type:Boolean, default:true},
    bookingUserId:{type:String, minlength: 24, maxlength: 24},
    version:{type:Number, default:0}
})

function validateTicketSchema(ticket){
    const schema = Joi.object({
        seatNumber: Joi.number().min(1).max(40)
    });

    return schema.validate(ticket);
}

module.exports.ticketSchema = ticketSchema;
module.exports.validateTicketSchema = validateTicketSchema;