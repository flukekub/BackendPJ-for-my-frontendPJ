const sql = require("../config/pgdb");

const Booking = function (booking) {
    this.bookingID = booking.bookingid | booking.bookingID;
    this.userID = booking.userid | booking.userID;
    this.dentistID = booking.dentistid | booking.dentistID;
    this.date = booking.date;
};

Booking.getAll = async () => {
    const query = "SELECT * FROM bookings;";

    try {
        const res = await sql.query(query);

        console.log("All bookings:", res.rows);
        return res.rows;
    } 
    catch (err) {
        console.log("Get bookings error:", err);
        throw err;
    }
};

Booking.findById = async (id) => {
    const query = "SELECT * FROM bookings WHERE bookingID = $1;";
    const values = [id];

    try {
        const res = await sql.query(query, values);

        if (res.rows.length === 0) {
            throw {kind: "not_found"};
        }
        console.log("Found booking:", res.rows[0]);
        return res.rows[0];
    } 
    catch (err) {
        console.log("Get booking error:", err);
        throw err;
    }
};

Booking.create = async (newBooking) => {
    
    const checkQuery = "SELECT * FROM bookings WHERE userID = $1;";
    const checkValues = [newBooking.userID];

    try {
        const checkRes = await sql.query(checkQuery, checkValues);
        if (checkRes.rows.length > 0) {
            throw {kind: "already_booked", message: "User already has an existing booking."};
        }
        const query = "INSERT INTO bookings (userID, dentistID, date) VALUES ($1, $2, $3) RETURNING *;";
        const values = [newBooking.userID, newBooking.dentistID, newBooking.date];

        const res = await sql.query(query, values);

        console.log("Created booking:", res.rows[0]);
        return res.rows[0];
    } 
    catch (err) {
        console.log("Create booking error:", err);
        throw err;
    }
};

Booking.updateById = async (id, booking) => {
    const query = `
        UPDATE bookings 
        SET userID = $1, dentistID = $2, date = $3 
        WHERE bookingID = $4 RETURNING *;
    `;
    const values = [booking.userID, booking.dentistID, booking.date, id];

    try {
        const res = await sql.query(query, values);

        if (res.rowCount === 0) {
            throw {kind: "not_found"};
        }
        console.log("Updated booking:", res.rows[0]);
        return res.rows[0];
    } 
    catch (err) {
        console.log("Update booking error:", err);
        throw err;
    }
};

Booking.remove = async (id) => {
    const query = "DELETE FROM bookings WHERE bookingID = $1 RETURNING *;";
    const values = [id];

    try {
        const res = await sql.query(query, values);

        if (res.rowCount === 0) {
            throw {kind: "not_found"};
        }
        console.log("Deleted booking with ID:", id);
        return res.rows;
    } 
    catch (err) {
        console.log("Delete booking error:", err);
        throw err;
    }
};

module.exports = Booking;
