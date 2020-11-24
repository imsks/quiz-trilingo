const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const userAuth = require("./routes/users/auth");
const taskAuth = require("./routes/users/task");

const taskKnexAuth = require("./routes/knex-user/task");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/user/auth", userAuth);
app.use("/api/user/task", taskAuth);

// For Kex
app.use("/api/user/knex-task", taskKnexAuth);

module.exports = app;
