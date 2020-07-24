const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const BookingsController = require('../controllers/bookings');

// Handle incoming GET requests to /bookings
router.get("/", checkAuth, BookingsController.get_all);

router.post("/", checkAuth, BookingsController.confirm_booking);

router.get("/:bookingId", checkAuth, BookingsController.get_booking);

router.get('/checkout', async (req, res) => {
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
      success_url:
        "https://example.com/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://example.com/cancel",
    });
    res.render('checkout', {session_id: session.id });
  });

router.delete("/:bookingId", checkAuth, BookingsController.delete_booking);

module.exports = router;
