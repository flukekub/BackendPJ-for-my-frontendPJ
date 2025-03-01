const Booking = require("../models/Booking");

exports.getBookings = async (req, res) => {
    try {
        const data = await Booking.getAll();

        res.status(200).json({success: true, data});
    } 
    catch (err) {
        res.status(500).json({success: false, message: err.message || "Some error occurred while retrieving all bookings"});
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
