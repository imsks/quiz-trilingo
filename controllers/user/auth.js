const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Auth = require("../../models/user/user");
const Error = require("../../utils/errors");

// FOR TESTING ONLY
exports.test = (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "This route is only for testing purpose.",
  });
};

// Auth Sign In Route
exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await Auth.findOne({ email });

  let payload = { email, password };

  if (user) {
    bcrypt.compare(password, user.hashedPassword, function (err, result) {
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
          data: user,
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

// Auth Sign In Route
exports.signUp = async (req, res) => {
  const { email, password, isBanker } = req.body;

  // 1. Search if the contact already exists
  const isAlreadyRegistered = await Auth.findOne({ email });
  // 2. If not exists
  if (!isAlreadyRegistered) {
    bcrypt.hash(password, 10, function (err, hash) {
      // Store hash in your password DB.
      const newAuth = Auth({
        email,
        hashedPassword: hash,
        isBanker,
      });

      newAuth
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
      message: Error.errorMessages.userAlreadyExists,
    });
  }
};
