const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
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
  refreshToken: {
    type: String,
    required: true,
  },
});

const Admin = mongoose.model("Admins", AdminSchema);

module.exports = Admin;
