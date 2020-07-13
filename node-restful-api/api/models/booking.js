const mongoose = require('mongoose');

var today = new Date();
var current = today.getFullYear()+'-'+(today.getMonth());

var BookingSchema = new mongoose.Schema({
    name: { trim: true, type: String, required: true },
    phoneNumber: { type: Number, required: true},
    checkIn: { type: Date, default: current, required: true},
    checkOut: { type: Date, default: current, required: true},
    roomIds: [{type: mongoose.Schema.Types.ObjectId, ref: 'Room'}]

});

module.exports = mongoose.model('Booking', BookingSchema);