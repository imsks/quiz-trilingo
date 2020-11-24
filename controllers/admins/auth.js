const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../../models/admin/admins");
const Error = require("../../utils/errors");

// FOR TESTING ONLY
exports.test = (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "This route is only for testing purpose.",
  });
};

// Admin Sign In Route
exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  
  let payload = { email };

  if (admin) {
    bcrypt.compare(password, admin.hashedPassword, function (err, result) {
      // console.log(process.env.ACCESS_TOKEN_LIFE);
      if (result) {
        //create the access token with the shorter lifespan
        let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "10m",
        });

        res.cookie("token", accessToken, { httpOnly: true }).status(200).json({
          success: "Success",
          message: "Sign in successful.",
          data: admin,
          accessToken,
        });
      } else {
        res.status(400).json({
          success: "Fail",
          message: Error.errorMessages.signinFailed,
        });
      }
    });
  } else {
    res.status(400).json({
      success: "Fail",
      message: Error.errorMessages.signinFailed,
    });
  }
};

// Admin Sign In Route
exports.signUp = async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Search if the contact already exists
  const isAlreadyRegistered = await Admin.findOne({ email });
  // 2. If not exists
  if (!isAlreadyRegistered) {
    bcrypt.hash(password, 10, function (err, hash) {
      let payload = { email };

      // Access Token
      let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "10m",
      });

      // Refresh Token
      let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: process.env.REFRESH_TOKEN_LIFE,
      });

      // Store hash in your password DB.
      const newAdmin = Admin({
        name,
        email,
        hashedPassword: hash,
        token: accessToken,
        refreshToken,
      });

      newAdmin
        .save()
        .then((data) =>
          res.status(200).json({
            status: "Success",
            data,
            message: "Signup successful",
          })
        )
        .catch((err) => console.log(err));
    });
  } else {
    res.status(400).json({
      status: "Fail",
      message: Error.errorMessages.AdminAlreadyExists,
    });
  }
};
