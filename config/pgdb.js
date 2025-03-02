require("dotenv").config();

const {Pool} = require("pg");

const connection = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

async function createTables() {
    try {
        const usersQuery = `
            CREATE TABLE IF NOT EXISTS users (
                UserID SERIAL PRIMARY KEY,
                Name VARCHAR(255) NOT NULL,
                Email VARCHAR(255) UNIQUE NOT NULL,
                Phone VARCHAR(20),
                Password VARCHAR(255) NOT NULL,
                Role VARCHAR(5) NOT NULL CHECK (Role IN ('user', 'admin'))
            );
        `;
        await connection.query(usersQuery);
        console.log("Users table created");

        const dentistsQuery = `
            CREATE TABLE IF NOT EXISTS dentists (
                DentistID SERIAL PRIMARY KEY,
                Name VARCHAR(255) NOT NULL,
                Experience INT,
                Expertise VARCHAR(255)
            );
        `;
        await connection.query(dentistsQuery);
        console.log("Dentists table created");

        const bookingsQuery = `
            CREATE TABLE IF NOT EXISTS bookings (
                BookingID SERIAL PRIMARY KEY,
                UserID INT NOT NULL,
                DentistID INT NOT NULL,
                Date DATE NOT NULL,
                FOREIGN KEY (UserID) REFERENCES users(UserID) ON DELETE CASCADE,
                FOREIGN KEY (DentistID) REFERENCES dentists(DentistID) ON DELETE CASCADE
            );
        `;
        await connection.query(bookingsQuery);
        console.log("Bookings table created");
    } 
    catch (err) {
        console.error("Error creating tables:", err);
    }
}

createTables();

module.exports = connection;
