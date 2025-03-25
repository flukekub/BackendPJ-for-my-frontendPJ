const supabase = require('../config/db.js');

const Booking = function (booking) {
    this.bookingID = booking.bookingid | booking.bookingID;
    this.userID = booking.userid | booking.userID;
    this.dentistID = booking.dentistid | booking.dentistID;
    this.date = booking.date;
};

Booking.getAll = async (lastID, limit) => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .gt('bookingid', lastID)
            .order('bookingid', { ascending: true })
            .limit(limit);

        if (error) {
            throw new Error(error.message);
        }

        console.log("All bookings:", data);
        return data;
    } 
    catch (err) {
        console.error("Get bookings error:", err);
        throw err;
    }
};

Booking.findById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('bookingid', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                throw { kind: "not_found" };
            }
            throw error;
        }

        console.log("Found booking:", data);
        return data;
    } 
    catch (err) {
        console.log("Get booking error:", err);
        throw err;
    }
};

Booking.findByUserId = async (id) => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('userid', id);

        if (error) {
            throw error;
        }

        if (data.length === 0) {
            throw { kind: "not_found" };
        }

        console.log("Found bookings for user:", data);
        return data;
    } 
    catch (err) {
        console.log("Get booking error:", err);
        throw err;
    }
};

Booking.findByDentistIdAndDate = async (id, date) => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('dentistid', id)
            .eq('date', date)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                throw { kind: "not_found" };
            }
            throw error;
        }

        console.log("Found booking:", data);
        return data;
    } 
    catch (err) {
        console.log("Get booking error:", err);
        throw err;
    }
};

Booking.create = async (newBooking) => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .insert([
                {
                    userid: newBooking.userID,
                    dentistid: newBooking.dentistID,
                    date: newBooking.date
                }
            ])
            .select();
            
        if (error) {
            console.log("Insert error:", error);
            throw new Error(error.message);
        }

        console.log("Created booking:", data[0]);
        return data[0];
    } 
    catch (err) {
        console.log("Create booking error:", err);
        throw err;
    }
};

Booking.updateById = async (id, booking) => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .update({
                userid: booking.userID,
                dentistid: booking.dentistID,
                date: booking.date
            })
            .eq('bookingid', id)
            .select();

        if (error) {
            if (error.code === 'PGRST116') {
                throw { kind: "not_found" };
            }
            throw error;
        }

        if (!data || data.length === 0) {
            throw { kind: "not_found" };
        }

        console.log("Updated booking:", data[0]);
        return data[0];
    } 
    catch (err) {
        console.log("Update booking error:", err);
        throw err;
    }
};

Booking.remove = async (id) => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .delete()
            .eq('bookingid', id)
            .select();

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            throw { kind: "not_found" };
        }

        console.log("Deleted booking with ID:", id);
        return data;
    } 
    catch (err) {
        console.log("Delete booking error:", err);
        throw err;
    }
};

module.exports = Booking;