const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomTypeSchema = new mongoose.Schema({
  roomName: { type: String },
  price: { type: Number },
  adults: { type: Number },
  childs: { type: Number },
  features: [{ type: Schema.Types.ObjectId, ref: "Feature", required: false }],
  note: { type: String, required: false },
});

const roomSchema = new mongoose.Schema({
  roomType: { type: roomTypeSchema, required: true },
  roomNumber: { type: Number },
  note: { type: String, required: false },
});

module.exports = mongoose.model("Room", roomSchema);