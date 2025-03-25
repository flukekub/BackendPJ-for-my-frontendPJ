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
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .gt('userid', lastID)
            .order('userid', { ascending: true })
            .limit(limit);

        if (error) {
            throw new Error(error.message);
        }

        console.log("All users:", data);
        return data;
    } 
    catch (err) {
        console.error("Get all users error:", err);
        throw err;
    }
};

User.getAllUsers = async (lastID, limit) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'user')
            .gt('userid', lastID)
            .order('userid', { ascending: true })
            .limit(limit);

        if (error) {
            throw new Error(error.message);
        }

        console.log("All only users:", data);
        return data;
    } catch (err) {
        console.error("Get only users error:", err);
        throw err;
    }
};

User.getAllAdmins = async (lastID, limit) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'admin')
            .gt('userid', lastID)
            .order('userid', { ascending: true })
            .limit(limit);

        if (error) {
            throw new Error(error.message);
        }

        console.log("All only admins:", data);
        return data;
    } 
    catch (err) {
        console.error("Get only admins error:", err);
        throw err;
    }
};

User.findById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('userid', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                throw { kind: "not_found" };
            }
            throw error;
        }

        console.log("Found user:", data);
        return new User(data);
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
        .single();

    if (error) {
        console.log("Get user error:", error);
        if (error.code === 'PGRST116') {
            throw { kind: 'not_found' };
        }
        throw error;
    }

    console.log("Found user:", data);
    return new User(data);
};

User.create = async (newUser) => {
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    try {
        const { data, error } = await supabase
            .from('users')
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
            throw new Error(error.message);
        }

        console.log("Created user:", data);
        return new User(data[0]);
    } catch (err) {
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

    try {
        const { data, error } = await supabase
            .from('users')
            .update({
                name: user.name, 
                email: user.email, 
                phone: user.phone, 
                password: passwordHash, 
                role: user.role
            })
            .eq('userid', id)
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

        console.log("Updated user:", data[0]);
        return new User(data[0]);
    } 
    catch (err) {
        console.log("Update user error:", err);
        throw err;
    }
};

User.remove = async (id) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .delete()
            .eq('userid', id)
            .select();

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            throw { kind: "not_found" };
        }

        console.log("Deleted user with ID:", id);
        return data;
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