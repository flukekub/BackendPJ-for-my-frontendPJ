const sql = require("../config/pgdb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = function (user) {
    this.userID = user.userid | user.bookingID;
    this.name = user.name;
    this.email = user.email;
    this.phone = user.phone;
    this.password = user.password;
    this.role = user.role;
};

User.getAll = async () => {
    const query = "SELECT * FROM users;";

    try {
        const res = await sql.query(query);

        console.log("All users:", res.rows);
        return res.rows;
    } 
    catch (err) {
        console.log("Get users error:", err);
        throw err;
    }
};

User.getAllUsers = async () => {
    const query = "SELECT * FROM users WHERE role = 'user';";

    try {
        const res = await sql.query(query);

        console.log("All only users:", res.rows);
        return res.rows;
    } 
    catch (err) {
        console.log("Get only users error:", err);
        throw err;
    }
};

User.getAllAdmins = async () => {
    const query = "SELECT * FROM users WHERE role = 'admin';";

    try {
        const res = await sql.query(query);

        console.log("All only admins:", res.rows);
        return res.rows;
    } 
    catch (err) {
        console.log("Get only admins error:", err);
        throw err;
    }
};

User.findById = async (id) => {
    const query = "SELECT * FROM users WHERE userID = $1;";
    const values = [id];

    try {
        const res = await sql.query(query, values);

        if (res.rows.length === 0) {
            throw {kind: "not_found"};
        }
        console.log("Found user:", res.rows[0]);
        return new User(res.rows[0]);
    } 
    catch (err) {
        console.log("Get user error:", err);
        throw err;
    }
};

User.findByEmail = async (email) => {
    const query = "SELECT * FROM users WHERE email = $1;";
    const values = [email];

    try {
        const res = await sql.query(query, values);

        if (res.rows.length === 0) {
            throw {kind: "not_found"};
        }
        console.log("Found user:", res.rows[0]);
        return new User(res.rows[0]);
    } 
    catch (err) {
        console.log("Get user error:", err);
        throw err;
    }
};

User.create = async (newUser) => {
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    const query = "INSERT INTO users (name, email, phone, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *;";
    const values = [newUser.name, newUser.email, newUser.phone, newUser.password, newUser.role];

    try {
        const res = await sql.query(query, values);

        console.log("Created user:", res.rows[0]);
        return new User(res.rows[0]);
    } 
    catch (err) {
        console.log("Create user error:", err);
        throw err;
    }
};

User.updateById = async (id, user) => {
    let passwordHash = user.password;

    if (user.password) {
        const salt = await bcrypt.genSalt(10);
        passwordHash = await bcrypt.hash(user.password, salt);
    }

    const query = `
        UPDATE users 
        SET name = $1, email = $2, phone = $3, password = $4, role = $5
        WHERE userID = $6 RETURNING *;
    `;
    const values = [user.name, user.email, user.phone, passwordHash, user.role, id];

    try {
        const res = await sql.query(query, values);

        if (res.rowCount === 0) {
            throw {kind: "not_found"};
        }
        console.log("Updated user:", res.rows[0]);
        return new User(res.rows[0]);
    } 
    catch (err) {
        console.log("Update user error:", err);
        throw err;
    }
};

User.remove = async (id) => {
    const query = "DELETE FROM users WHERE userID = $1 RETURNING *;";
    const values = [id];

    try {
        const res = await sql.query(query, values);

        if (res.rowCount === 0) {
            throw {kind: "not_found"};
        }
        console.log("Deleted user with ID:", id);
        return res.rows;
    } 
    catch (err) {
        console.log("Delete user error:", err);
        throw err;
    }
};

User.prototype.getSignedJwtToken = function() {
    return jwt.sign({id: this.userID}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;
