const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config({path: "./config/config.env"});

const dentistsRouter = require("./routes/dentists");
const booksRouter = require("./routes/bookings");
const authRouter = require("./routes/auth");

const app = express();
app.use(express.json());
app.use(cookieParser());

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