const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user/user");
const Error = require("../../utils/errors");

// FOR TESTING ONLY
exports.test = (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "This route is only for testing purpose.",
  });
};

// User Sign In Route
exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  let payload = { email };

  if (user) {
    bcrypt.compare(password, user.hashedPassword, function (err, result) {
      if (result) {
        console.log(process.env.ACCESS_TOKEN_LIFE);
        // Generate Access Token
        let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: process.env.ACCESS_TOKEN_LIFE,
        });

        // Generate Refresh Token
        let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: process.env.REFRESH_TOKEN_LIFE,
        });

        user.updateOne({ token: accessToken, refreshToken }).then((data) => {
          res
            .cookie("token", accessToken, { httpOnly: true })
            .status(200)
            .json({
              success: "Success",
              message: "Sign in successful.",
              data,
              accessToken,
              refreshToken,
            });
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

// User Sign In Route
exports.signUp = async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Search if the contact already exists
  const isAlreadyRegistered = await User.findOne({ email });
  // 2. If not exists
  if (!isAlreadyRegistered) {
    bcrypt.hash(password, 10, function (err, hash) {
      let payload = { email };

      // Generate Access Token
      let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: process.env.ACCESS_TOKEN_LIFE,
      });

      // Generate Refresh Token
      let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: process.env.REFRESH_TOKEN_LIFE,
      });

      // Store hash in your password DB.
      const newUser = User({
        name,
        email,
        hashedPassword: hash,
        token: accessToken,
        refreshToken,
      });

      newUser
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

// Refresh Token
exports.refreshToken = async (req, res, next) => {
  const refreshToken = req.headers.refreshtoken;
  const accessToken = req.headers.accesstoken;
  // console.log(accessToken)

  // Check if Access Token is provided
  if (!accessToken) {
    return res.status(400).json({
      success: "Fail",
      message: Error.errorMessages.noAuth,
    });
  }

  // Get the user
  const user = await User.findOne({ refreshToken });
  // console.log(user);

  let payload;

  // Verify Access Token
  try {
    payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  } catch (e) {
    return res.status(400).json({
      success: "Fail",
      message: Error.errorMessages.needToSignIn,
    });
  }

  // Verify Refresh Token
  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (e) {
    return res.status(400).json({
      success: "Fail",
      message: Error.errorMessages.needToSignIn,
    });
  }

  // Assign new Access Token
  let newToken = jwt.sign(
    { email: payload.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      algorithm: "HS256",
      expiresIn: process.env.ACCESS_TOKEN_LIFE,
    }
  );

  user.updateOne({ token: newToken }).then((data) => {
    res
      .cookie("token", newToken, { httpOnly: true })
      .status(200)
      .json({
        success: "Success",
        message: "Sign in successful.",
        data,
        newToken,
        refreshToken,
      });
  });
};
