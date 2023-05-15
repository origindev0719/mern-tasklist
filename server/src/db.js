require("dotenv").config();
const mongoose = require("mongoose");

module.exports = () => {
  const connection = mongoose
    .connect(process.env.dbURI)
    .then((result) => console.log("Connected to database Successfully"))
    .catch((err) => console.log("Could not connect to database"));
};
