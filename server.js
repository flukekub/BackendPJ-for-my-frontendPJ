const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const {xss} = require("express-xss-sanitizer");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

dotenv.config({path: "./config/config.env"});

const dentistsRouter = require("./routes/dentists");
const booksRouter = require("./routes/bookings");
const authRouter = require("./routes/auth");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
const limiter=rateLimit({
    windowsMs:10*60*1000,//10 mins
    max: 100
});
app.use(limiter);
app.use(hpp());
app.use(cors());

app.use("/api/v1/dentists", dentistsRouter);
app.use("/api/v1/bookings", booksRouter);
app.use("/api/v1/auth", authRouter);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on("unhandledRejection", (err,promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});