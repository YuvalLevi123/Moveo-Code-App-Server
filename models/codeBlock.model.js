const mongoose = require("mongoose");

const codeBlockSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  currentVisitors: {
    type: Number,
    required: true,
  },
  solution: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("CodeBlock", codeBlockSchema);
