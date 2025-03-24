const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const {xss} = require("express-xss-sanitizer");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const supabase = require('./config/db');

const testConnection = async () => {
    const { data, error } = await supabase.from('dentists').select('*');
    if (error) console.error("Supabase connection error:", error);
    else console.log("Connected to Supabase!", data);
};



dotenv.config({path: "./config/config.env"});

const dentistsRouter = require("./routes/dentists");
const booksRouter = require("./routes/bookings");
const authRouter = require("./routes/auth");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(xss());
app.use(
    rateLimit({
        windowMs: 10 * 60 * 1000,
        max: 1000
    })
);
app.use(hpp());
app.use(cors());

app.use("/api/v1/dentists", dentistsRouter);
app.use("/api/v1/bookings", booksRouter);
app.use("/api/v1/auth", authRouter);

testConnection();

const PORT = process.env.PORT ;
const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on("unhandledRejection", (err,promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});