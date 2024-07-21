const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new mongoose.Schema({
  name: { type: String },
  surname: { type: String },
  tckn: { type: String, unique: true },
  address: { type: String },
  email: { type: String, unique: true },
  gender: { type: String },
  phone: { type: Number },
  nation: { type: String },
  rooms: [{ type: Schema.Types.ObjectId, ref: "Room", required: false }],
  currency: { type: String },
  note: { type: String, required: false },
  reservation: [{
    type: Schema.Types.ObjectId,
    ref: "Reservation",
    required: false,
  }],
});

module.exports = mongoose.model("Customer", customerSchema)