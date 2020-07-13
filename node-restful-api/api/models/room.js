const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomImage: String,
    number: {
    	type: Number,
    	required: true
    },
    features: {
        type: String,
        required: true
    },
    bedCapacity: {
        type: Number,
        required: true
    },
    rent: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    bookingStatus: [{type: mongoose.Schema.Types.ObjectId, ref: 'Booking'}]
    //after checkout time entry should be deleted
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;