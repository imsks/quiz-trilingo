const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide the name"],
  },
  email: {
    type: String,
    unique: [true, "Your email alredy exists. Try logging in."],
  },
  hashedPassword: {
    type: String,
    required: [true, "Please provide the name"],
  },
  token: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("Users", UserSchema);

module.exports = User;
