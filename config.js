const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

// Change it to 'prod' for Production
const envName = "dev";

// For Development
const dev = {
  PORT: process.env.PORT,
  ATLAS_URI: process.env.ATLAS_URI,
};

// For Production
const prod = {
  PORT: process.env.PORT,
  ATLAS_URI: process.env.ATLAS_URI,
};

const env = envName === "prod" ? prod : dev;
module.exports = env;
