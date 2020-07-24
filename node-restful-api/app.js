const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const roomRoutes = require("./api/routes/rooms");
const bookingRoutes = require("./api/routes/bookings");
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb://localhost:27017/HotelReservationSystem', { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true }, () => {
  console.log('DB Connected')
});

mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/rooms", roomRoutes);
app.use("/bookings", bookingRoutes);
app.use("/user", userRoutes);

app.get('/', (req, res) => res.render('index'));
app.get('/a/dd', (req, res) => res.render('search-results'))
app.get("/checkout", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "T-shirt",
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "https://example.com/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "https://example.com/cancel",
  });
  res.render("checkout", { session_id: session.id });
});

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});


module.exports = app;
