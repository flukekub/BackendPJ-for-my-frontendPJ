const sql = require("../config/pgdb");

const Dentist = function (dentist) {
    this.dentistID = dentist.dentistid | dentist.dentistID;
    this.name = dentist.name;
    this.experience = dentist.experience;
    this.expertise = dentist.expertise;
};

Dentist.getAll = async () => {
    const query = "SELECT * FROM dentists;";

    try {
        const res = await sql.query(query);

        console.log("All dentists:", res.rows);
        return res.rows;
    } 
    catch (err) {
        console.log("Get dentists error:", err);
        throw err;
    }
};
Dentist.countAll = async () => {
    const query = "SELECT COUNT(*) FROM dentists";
    try {
        const result = await sql.query(query);

        
        return parseInt(result.rows[0].count, 10);
    } 
    catch (err) {
        console.log("count bookings error:", err);
        throw err;
    }
};
Dentist.findById = async (id) => {
    const query = "SELECT * FROM dentists WHERE DentistID = $1;";
    const values = [id];

    try {
        const res = await sql.query(query, values);

        if (res.rows.length === 0) {
            throw {kind: "not_found"};
        }
        console.log("Found dentist:", res.rows[0]);
        return res.rows[0];
    } 
    catch (err) {
        console.log("Get dentist error:", err);
        throw err;
    }
};

Dentist.create = async (newDentist) => {
    const query = "INSERT INTO dentists (Name, Experience, Expertise) VALUES ($1, $2, $3) RETURNING *;";
    const values = [newDentist.name, newDentist.experience, newDentist.expertise];

    try {
        const res = await sql.query(query, values);

        console.log("Created dentist:", res.rows[0]);
        return res.rows[0];
    } 
    catch (err) {
        console.log("Create dentist error:", err);
        throw err;
    }
};

Dentist.updateById = async (id, dentist) => {
    const query = `
        UPDATE dentists 
        SET Name = $1, Experience = $2, Expertise = $3 
        WHERE DentistID = $4 RETURNING *;
    `;
    const values = [dentist.name, dentist.experience, dentist.expertise, id];

    try {
        const res = await sql.query(query, values);

        if (res.rowCount === 0) {
            throw {kind: "not_found"};
        }
        console.log("Updated dentist:", res.rows[0]);
        return res.rows[0];
    } 
    catch (err) {
        console.log("Update dentist error:", err);
        throw err;
    }
};

Dentist.remove = async (id) => {
    const query = "DELETE FROM dentists WHERE dentistID = $1 RETURNING *;";
    const values = [id];

    try {
        const res = await sql.query(query, values);
        
        if (res.rowCount === 0) {
            throw {kind: "not_found"};
        }
        console.log("Deleted dentist with ID:", id);
        return res.rows;
    } 
    catch (err) {
        console.log("Delete dentist error:", err);
        throw err;
    }
};

module.exports = Dentist;
