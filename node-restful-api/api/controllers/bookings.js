const mongoose = require("mongoose");

const Booking = require("../models/booking");
const Room = require("../models/room");

const stripe = require('stripe')('sk_test_Flc1Upp19T0q8ZgmKGDVJUI400j9emUSTr');

exports.get_all = (req, res, next) => {
  Booking.find()
    .select("product quantity _id")
    .populate("product", "name")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.confirm_booking = (req, res, next) => {
  Product.findById(req.body.roomId)
    .then(room => {
      if (!room) {
        return res.status(404).json({
          message: "Room not found"
        });
      }
      const booking = new Booking({
        _id: mongoose.Types.ObjectId(),
        booking: req.body.roomId
      });
      return booking.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Booking stored",
        createdBooking: {
          _id: result._id,
          room: result.room
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/booking/" + result._id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.get_booking = (req, res, next) => {
  Booking.findById(req.params.orderId)
    .populate("booking")
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: "Booking not found"
        });
      }
      res.status(200).json({
        booking: booking,
        request: {
          type: "GET",
          url: "http://localhost:3000/booking"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.delete_booking = (req, res, next) => {
  Booking.remove({ _id: req.params.bookingId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/booking",
          body: { bookingId: "ID", quantity: "Number" }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
