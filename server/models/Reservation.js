const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const axios = require("axios");

const reservationSchema = new mongoose.Schema({
  employee: { type: Schema.Types.ObjectId, ref: "Employee" },
  customers: [{ type: Schema.Types.ObjectId, ref: "Customer" }],
  rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
  checkin: { type: String },
  checkout: { type: String },
  adults: { type: Number },
  childs: { type: Number },
  price: { type: Number, required: false },
  note: { type: String, required: false },
  isPaid: { type: Boolean, required: false, default: false },
});

module.exports = mongoose.model("Reservation", reservationSchema);