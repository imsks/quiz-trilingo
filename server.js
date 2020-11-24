const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config");

const PORT = config.PORT || 8000;

// MongoDB Connection Setup
const uri = config.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.listen(PORT, () =>
  console.log(`Server has started on port localhost:${PORT}`)
);
