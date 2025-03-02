const Booking = require("../models/Booking");

exports.getBookings = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 25;
        const lastID = parseInt(req.query.lastID, 10) || 0;

        const data = await Booking.getAll(lastID, limit);

        const pagination = {};
        if (data.length > 0) {
            pagination.next = {
                lastID: data[data.length - 1].bookingID,
                limit
            };
        }

        res.status(200).json({success: true, data, pagination});
    } 
    catch (err) {
        res.status(500).json({success: false, message: err.message || "Error retrieving bookings"});
    }
};

exports.getBooking = async (req, res) => {
    const {bookingID} = req.params;

    try {
        const data = await Booking.findById(bookingID);

        if (!data) {
            return res.status(404).json({success: false, message: `Booking with ID ${bookingID} not found.`});
        }
        res.status(200).json({success: true, data});
    } 
    catch (err) {
        res.status(500).json({success: false, message: `Error retrieving booking with ID ${bookingID}.`});
    }
};

exports.createBooking = async (req, res) => {
    const {userID, dentistID, date} = req.body;

    if (!userID || !dentistID || !date) {
        return res.status(400).json({success: false, message: "All fields (userID, dentistID, date) are required!"});
    }

    let existingBooking  = null;
    try { 
        existingBooking  = await Booking.findByUserId(userID);
    }
    catch (err) {
        console.log(`Warning: User with ID ${userID} not found, proceeding anyway.`, err.message);
    }

    if (existingBooking ) {
        return res.status(400).json({success: false, message: "User can book only one session!"}); 
    }

    let dentistBooking = null;
    try {
        dentistBooking = await Booking.findByDentistIdAndDate(dentistID, date);
    } 
    catch (err) {
        console.log(`Warning: Dentist with ID ${dentistID} and booking date at ${date} not found, proceeding anyway.`, err.message);
    }

    if (dentistBooking) {
        return res.status(400).json({success: false, message: `This dentist with ID ${dentistID} is already booked for this date!`});
    }

    const newBooking = {userID, dentistID, date};
    
    try {
        const data = await Booking.create(newBooking);

        res.status(201).json({success: true, data});
    } 
    catch (err) {
        res.status(500).json({success: false, message: err.message || "Error creating booking"});
    }
};

exports.updateBooking = async (req, res) => {
    const {userID, dentistID, date} = req.body;
    const {bookingID} = req.params;

    try {
        const data = await Booking.updateById(bookingID, {userID, dentistID, date});

        if (!data) {
            return res.status(404).json({success: false, message: `Booking with ID ${bookingID} not found.`});
        }
        res.status(200).json({success: true, data});
    } 
    catch (err) {
        res.status(500).json({success: false, message: `Error updating booking with ID ${bookingID}.`});
    }
};

exports.deleteBooking = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({success: false, message: "Content cannot be empty!"});
    }

    const {bookingID} = req.params;

    try {
        const data = await Booking.remove(bookingID);
        
        if (!data) {
            return res.status(404).json({success: false, message: `Booking with ID ${bookingID} not found.`});
        }
        res.status(200).json({success: true, message: "Booking deleted successfully!"});
    } 
    catch (err) {
        res.status(500).json({success: false, message: `Could not delete booking with ID ${bookingID}.`});
    }
};

exports.getMeBooking = async (req, res, next) => {
    const {userID} = req.user;

    try {
        const booking = await Booking.findByUserId(userID);

        res.status(200).json({success: true, data: booking,});
    } 
    catch (err) {
        console.error("Error fetching booking:", err);
        res.status(404).json({success: false, message: `Booking with from user with ID ${userID} not found.`});
    }
}

exports.updateMeBooking = async (req, res) => {
    const {dentistID, date} = req.body;
    const {userID} = req.user;

    if (!dentistID || !date) {
        return res.status(400).json({success: false, message: "All fields (dentistID, date) are required!"});
    }

    let userBooking  = null;
    try { 
        userBooking  = await Booking.findByUserId(userID);
    }
    catch (err) {
        return res.status(404).json({success: false, message: `Booking with from user with ID ${userID} not found.`});
    }

    let dentistBooking = null;
    try {
        dentistBooking = await Booking.findByDentistIdAndDate(dentistID, date);
    } 
    catch (err) {
        console.log(`Warning: Dentist with ID ${dentistID} or booking date at ${date} not found, proceeding anyway.`, err.message);
    }

    if (dentistBooking) {
        return res.status(400).json({success: false, message: `This dentist with ID ${dentistID} is already booked for this date!`});
    }

    try {
        const data = await Booking.updateById(userBooking.bookingid, {userID, dentistID, date});

        if (!data) {
            return res.status(404).json({success: false, message: `Booking with ID ${userBooking.bookingid} not found.`});
        }
        res.status(200).json({success: true, data});
    } 
    catch (err) {
        res.status(500).json({success: false, message: `Error updating booking with ID ${userBooking.bookingid}.`});
    }
};

exports.deleteMeBooking = async (req, res) => {
    const {userID} = req.user;

    if (!req.body) {
        return res.status(400).json({success: false, message: "Content cannot be empty!"});
    }

    let userBooking  = null;
    try { 
        userBooking  = await Booking.findByUserId(userID);
    }
    catch (err) {
        return res.status(404).json({success: false, message: `Booking with from user with ID ${userID} not found.`});
    }

    try {
        const data = await Booking.remove(userBooking.bookingid);
        
        if (!data) {
            return res.status(404).json({success: false, message: `Booking with ID ${userBooking.bookingid} not found.`});
        }
        res.status(200).json({success: true, message: "Booking deleted successfully!"});
    } 
    catch (err) {
        res.status(500).json({success: false, message: `Could not delete booking with ID ${userBooking.bookingid}.`});
    }
};