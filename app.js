const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const userAuth = require("./routes/users/auth");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(cookieParser());

// For Users
app.use("/api/user/auth", userAuth);

module.exports = app;
