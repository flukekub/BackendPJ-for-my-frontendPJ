const express = require("express");
const {getDentists, getDentist, createDentist, updateDentist, deleteDentist} = require("../controllers/dentists");
const {protect, authorize} = require("../middleware/auth");
const bookingRouter = require("./bookings");

const router = express.Router();

router.use("/:dentistID/bookings/", bookingRouter);

router.route("/")
                .get(getDentists)
                .post(protect, authorize("admin"), createDentist);

router.route("/:dentistID")
                        .get(protect, getDentist)
                        .put(protect, authorize("admin"), updateDentist)
                        .delete(protect, authorize("admin"), deleteDentist);

module.exports = router;