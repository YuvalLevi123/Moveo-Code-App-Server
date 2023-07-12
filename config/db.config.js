require("dotenv").config();
const mongoose = require("mongoose");

//const uri = process.env.MONGODB_URI;
const uri =
  "mongodb+srv://yuval:levi@cluster0.spf7mxz.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

module.exports = mongoose;
