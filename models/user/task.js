const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  email: {
    type: String,
  },
  balance: {
    type: Number,
    default: 1000,
  },
  history: [
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

const Task = mongoose.model("Tasks", TaskSchema);

module.exports = Task;
