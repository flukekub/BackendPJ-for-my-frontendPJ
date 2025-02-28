const express = require("express");
const {getBookings, getBooking, createBooking, updateBooking, deleteBooking} = require("../controllers/bookings");
const {protect, authorize} = require("../middleware/auth");
const router = express.Router({mergeParams: true});

router.route("/")
                .get(getBookings)
                .post(protect, authorize("admin", "user"), createBooking);

router.route("/:bookingID")
                        .get(protect, getBooking)
                        .put(protect, authorize("admin", "user"), updateBooking)
                        .delete(protect, authorize("admin", "user"), deleteBooking);

module.exports = router;
