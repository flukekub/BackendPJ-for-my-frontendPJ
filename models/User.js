const supabase = require('../config/db.js');

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

User.getAll = async (lastID, limit) => {
    const query = "SELECT * FROM users WHERE userID > $1 ORDER BY userID LIMIT $2;";

    try {
        const res = await sql.query(query, [lastID, limit]);

        console.log("All users:", res.rows);
        return res.rows;
    } 
    catch (err) {
        console.error("Get all users error:", err);
        throw err;
    }
};

User.getAllUsers = async (lastID, limit) => {
    try {
        // ใช้ supabase เพื่อ query ข้อมูลจาก table 'users'
        const { data, error } = await supabase
            .from('users') // กำหนด table ที่ต้องการดึงข้อมูล
            .select('*') // เลือกทุกคอลัมน์
            .eq('role', 'user') // เงื่อนไข role = 'user'
            .gt('userID', lastID) // เงื่อนไข userID > lastID
            .order('userID', { ascending: true }) // เรียงลำดับ userID
            .limit(limit); // จำกัดจำนวนผลลัพธ์ตาม limit ที่ระบุ

        if (error) {
            throw new Error(error.message); // ถ้ามี error ให้ throw ขึ้นไป
        }

        console.log("All only users:", data); // แสดงผลข้อมูล
        return data; // คืนค่าผลลัพธ์
    } catch (err) {
        console.error("Get only users error:", err);
        throw err; // โยน error ขึ้นไป
    }
};

User.getAllAdmins = async (lastID, limit) => {
    const query = "SELECT * FROM users WHERE role = 'admin' AND userID > $1 ORDER BY userID LIMIT $2;";

    try {
        const res = await sql.query(query, [lastID, limit]);

        console.log("All only admins:", res.rows);
        return res.rows;
    } 
    catch (err) {
        console.error("Get only admins error:", err);
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
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();  // ใช้ .single() เพื่อให้ Supabase คืนค่าผลลัพธ์แค่แถวเดียว

    if (error) {
        console.log("Get user error:", error);
        if (error.code === 'PGRST100') {
            throw { kind: 'not_found' };  // สามารถปรับตามความต้องการ
        }
        throw error;
    }

    console.log("Found user:", data);
    return new User(data);  // สร้าง User จากข้อมูลที่ Supabase คืนมา
};


User.create = async (newUser) => {
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    try {
        // ใช้ supabase เพื่อ insert ข้อมูลใหม่ลงใน table 'users'
        const { data, error } = await supabase
            .from('users') // กำหนด table ที่จะ insert ข้อมูล
            .insert([
                {
                    name: newUser.name,
                    email: newUser.email,
                    phone: newUser.phone,
                    password: newUser.password,
                    role: newUser.role
                }
            ])
            .select();
            
        if (error) {
            console.log("Insert error:", error);
            throw new Error(error.message); // ถ้ามี error ให้ throw ขึ้นไป
        }

        console.log("Created user:", data); // แสดงผลข้อมูลที่สร้าง
        return new User(data); // คืนค่าผู้ใช้ใหม่ที่ถูกสร้างขึ้น
    } catch (err) {
        console.log("Create user error:", err);
        throw err; // โยน error ขึ้นไป
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
