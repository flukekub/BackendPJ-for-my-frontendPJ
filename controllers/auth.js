const User = require("../models/User");

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === "production") {
        options.secure = true;
    }
    
    res.status(statusCode).cookie("token", token, options).json({success: true, token});
};

exports.register = async (req, res, next) => {
    try {
        const {name, email, phone, password, role} = req.body;

        try {
            const user = await User.create({
                name,
                email,
                phone,
                password,
                role
            });

            // const token = user.getSignedJwtToken();
            // res.status(200).json({success: true, token});
            console.log(user);
            sendTokenResponse(user, 200, res);
        } 
        catch (err) {
            console.error("Registration error:", err);
            res.status(400).json({success: false, error: err.message});
        }
    }
    catch (err) {
        return res.status(401).json({success: false, msg: "Cannot convert email or password to string"});
    }
};

exports.login = async (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({success: false, msg: "Please provide an email and password"});
    }

    try {
        let user;
        try {
            user = await User.findByEmail(email);
        } 
        catch (err) {
            return res.status(500).json({success: false, msg: "Server error"});
        }

        if (!user) {
            return res.status(400).json({success: false, msg: "Invalid credentials"});
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({success: false, msg: "Invalid credentials"});
        }

        // const token = user.getSignedJwtToken();
        // res.status(200).json({success: true, token});
        sendTokenResponse(user, 200, res);
    }
    catch (err) {
        console.error("Login error:", err);
        res.status(500).json({success: false, error: err.message});
    }
};

exports.logout = async (req, res, next) => {
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({success: true, data: {}});
};


exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userID);

        res.status(200).json({success: true, data: user,});
    } 
    catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({success: false, message: "Server error"});
    }
};

exports.getUsers = async (req, res) => {
    
    try {
            
            //Pagination
            const page=parseInt(req.query.page,10)||1;
            const limit=parseInt(req.query.limit,10)||25;
            
            const offset=(page-1)*limit;
            const endIndex=page*limit;
            const total=await User.countAll();
    
            const data = await User.getAll(limit,offset );
    
            
            //Pagingation result
            const pagination ={};
    
            if(endIndex<total){
                pagination.next={
                    page:page+1,
                    limit
                }
            }
    
            if( offset >0){
                pagination.prev={
                    page:page-1,
                    limit
                }
            }
            res.status(200).json({success: true, data,pagination});
        } 
        catch (err) {
            res.status(500).json({success: false, message: err.message || "Some error occurred while retrieving all users"});
        }
};

exports.getOnlyUsers = async (req, res) => {
    
    try {
            
        //Pagination
        const page=parseInt(req.query.page,10)||1;
        const limit=parseInt(req.query.limit,10)||25;
        
        const offset=(page-1)*limit;
        const endIndex=page*limit;
        const total=await User.countAllUsers();

        const data = await User.getAllUsers(limit,offset );

        
        //Pagingation result
        const pagination ={};

        if(endIndex<total){
            pagination.next={
                page:page+1,
                limit
            }
        }

        if( offset >0){
            pagination.prev={
                page:page-1,
                limit
            }
        }
        res.status(200).json({success: true, data,pagination});
    } 
    catch (err) {
        res.status(500).json({success: false, message: err.message || "Some error occurred while retrieving only users"});
    }
};

exports.getOnlyAdmins = async (req, res) => {
   
    try {
            
        //Pagination
        const page=parseInt(req.query.page,10)||1;
        const limit=parseInt(req.query.limit,10)||25;
        
        const offset=(page-1)*limit;
        const endIndex=page*limit;
        const total=await User.countAllAdmins();

        const data = await User.getAllAdmins(limit,offset );

        
        //Pagingation result
        const pagination ={};

        if(endIndex<total){
            pagination.next={
                page:page+1,
                limit
            }
        }

        if( offset >0){
            pagination.prev={
                page:page-1,
                limit
            }
        }
        res.status(200).json({success: true, data,pagination});
    } 
    catch (err) {
        res.status(500).json({success: false, message: err.message || "Some error occurred while retrieving only admins"});
    }
};

exports.updateUser = async (req, res) => {
    const {name, email, phone, password, role} = req.body;
    const {userID} = req.params;

    try {
        const data = await User.updateById(userID, {name, email, phone, password, role});

        if (!data) {
            return res.status(404).json({success: false, message: `User with ID ${userID} not found.`});
        }
        res.status(200).json({success: true, data});
    } 
    catch (err) {
        res.status(500).json({success: false, message: `Error updating user with ID ${userID}.`});
    }
};

exports.deleteUser = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({success: false, message: "Content cannot be empty!"});
    }

    const {userID} = req.params;

    try {
        const data = await User.remove(userID);
        
        if (!data) {
            return res.status(404).json({success: false, message: `User with ID ${userID} not found.`});
        }
        res.status(200).json({success: true, message: "User deleted successfully!"});
    } 
    catch (err) {
        res.status(500).json({success: false, message: `Could not delete user with ID ${userID}.`});
    }
};
