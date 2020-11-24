const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, "Your email alredy exists. Try logging in."],
  },
  hashedPassword: {
    type: String,
  },
  isBanker: {
    type: Boolean,
  },
  balance: {
    type: Number,
  },
  data: [
    {
      type: Object,
      type: {
        type: String,
      },
      money: {
        type: String,
      },
    },
  ],
});

const User = mongoose.model("Users", UserSchema);

module.exports = User;
