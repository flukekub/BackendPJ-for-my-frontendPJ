const express = require("express");
const {getBookings, getBooking, createBooking, updateBooking, deleteBooking, getMeBooking, createMeBooking, updateMeBooking, deleteMeBooking} = require("../controllers/bookings");
const {protect, authorize} = require("../middleware/auth");

const router = express.Router({mergeParams: true});

router.route("/")
                .get(getBookings)
                .post(protect, authorize("admin"), createBooking);

router.route("/me")
                .get(protect, authorize("admin", "user"), getMeBooking)
                .post(protect, authorize("admin", "user"), createMeBooking)
                .put(protect, authorize("admin", "user"), updateMeBooking)
                .delete(protect, authorize("admin", "user"), deleteMeBooking);

router.route("/:bookingID")
                        .get(protect, getBooking)
                        .put(protect, authorize("admin", "user"), updateBooking)
                        .delete(protect, authorize("admin", "user"), deleteBooking);

module.exports = router;
