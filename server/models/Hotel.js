const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hotelSchema = new mongoose.Schema({
  name: { type: String },
  location: { type: String },
  capacity: { type: Number },
  totalRooms: { type: Number },
  contact: { type: contactSchema },
  description: { type: String },
});

const contactSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: Number },
  fax: { type: Number, required: false },
  email: { type: String, unique: true },
});

module.exports = mongoose.model("Hotel", hotelSchema);
