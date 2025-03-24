// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = 'https://zxwhflthjiegsuxcxufb.supabase.co'
// const supabaseKey = process.env.SUPABASE_KEY
// const supabase = createClient(supabaseUrl, supabaseKey)

// async function createTables() {
//     try {
//         // ลบตารางเดิมถ้ามีอยู่ (Supabase ใช้ SQL ตรงๆ ได้ใน query)
//         const dropTablesQuery = `
//             DROP TABLE IF EXISTS bookings;
//             DROP TABLE IF EXISTS users;
//             DROP TABLE IF EXISTS dentists;
//         `;
//         await supabase.rpc("sql", { query: dropTablesQuery });

//         console.log("Existing tables dropped");

//         // สร้างตาราง Users
//         const usersQuery = `
//             CREATE TABLE IF NOT EXISTS users (
//                 UserID SERIAL PRIMARY KEY,
//                 Name VARCHAR(255) NOT NULL,
//                 Email VARCHAR(255) UNIQUE NOT NULL,
//                 Phone VARCHAR(20),
//                 Password VARCHAR(255) NOT NULL,
//                 Role VARCHAR(5) NOT NULL CHECK (Role IN ('user', 'admin'))
//             );
//         `;
//         await supabase.rpc("sql", { query: usersQuery });
//         console.log("Users table created");

//         // สร้างตาราง Dentists
//         const dentistsQuery = `
//             CREATE TABLE IF NOT EXISTS dentists (
//                 DentistID SERIAL PRIMARY KEY,
//                 Name VARCHAR(255) NOT NULL,
//                 Experience INT,
//                 Expertise VARCHAR(255)
//             );
//         `;
//         await supabase.rpc("sql", { query: dentistsQuery });
//         console.log("Dentists table created");

//         // สร้างตาราง Bookings
//         const bookingsQuery = `
//             CREATE TABLE IF NOT EXISTS bookings (
//                 BookingID SERIAL PRIMARY KEY,
//                 UserID INT NOT NULL REFERENCES users(UserID) ON DELETE CASCADE,
//                 DentistID INT NOT NULL REFERENCES dentists(DentistID) ON DELETE CASCADE,
//                 Date DATE NOT NULL
//             );
//         `;
//         await supabase.rpc("sql", { query: bookingsQuery });
//         console.log("Bookings table created");

//     } catch (err) {
//         console.error("Error creating tables:", err);
//     }
// }

// // รันสร้างตาราง
// createTables();
