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

reservationSchema.statics.convertCurrency = async function (
  currencyToConvert,
  currentCurrency,
  amount
) {
  try {
    const response = await axios.get(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );
    const exchangeRates = response.data.rates;

    if (!exchangeRates[currencyToConvert] || !exchangeRates[currentCurrency]) {
      return `Invalid currency: ${currencyToConvert} or ${currentCurrency}`;
    }

    const convertedAmount =
      (amount * exchangeRates[currentCurrency]) /
      exchangeRates[currencyToConvert];

    return convertedAmount.toFixed(2);
  } catch (error) {
    console.error(error);
  }
};

module.exports = mongoose.model("Reservation", reservationSchema);