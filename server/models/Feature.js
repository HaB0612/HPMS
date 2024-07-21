const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const featureSchema = new mongoose.Schema({
  name: { type: String },
  icon: { type: String, required: false },
  description: { type: String },
});

module.exports = mongoose.model("Feature", featureSchema);
