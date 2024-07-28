const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new mongoose.Schema({
  name: { type: String },
  tckn: { type: String},
  address: { type: String },
  email: { type: String},
  gender: { type: String },
  phone: { type: Number },
  nation: { type: String },
  note: { type: String, required: false },
});

module.exports = mongoose.model("Customer", customerSchema)