const jwt = require("jsonwebtoken");
const Error = require("../utils/errors");

exports.verify = function (req, res, next) {
  let accessToken = req.headers.jwt;
  // console.log(accessToken);
  //if there is no token stored in cookies, the request is unauthorized
  if (!accessToken) {
    return res.status(400).json({
      success: "Fail",
      message: Error.errorMessages.noAuth,
    });
  }

  let payload;
  try {
    //use the jwt.verify method to verify the access token
    //throws an error if the token has expired or has a invalid signature
    payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    res.payload = payload;
    next();
  } catch (e) {
    //if an error occured return request unauthorized error
    return res.status(400).json({
      success: "Fail",
      message: Error.errorMessages.noAuth,
    });
  }
};
