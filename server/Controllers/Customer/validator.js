const mongoose = require("mongoose");
const phoneRegex = /^\+?[1-9]\d{1,14}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const dateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
const currenciesData = require("./models/currencies.json");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

const customerValidator = {
  name: async (name, update) => {
    if (!name) return "Lütfen bir isim girin.";

    return false;
  },
  surname: async (surname) => {
    if (!surname) return "Lütfen bir soyisim girin.";

    return false;
  },
  tckn: async (tckn) => {
    if (!tckn) return "Lütfen bir TCKN veya Pasaport No girin.";

    return false;
  },
  phone: async (phone, update) => {
    if (update) {
      if (phone && !phoneRegex.test(phone))
        return "Lütfen geçerli bir telefon numarası girin.";
    } else {
      if (!phone || !phoneRegex.test(phone))
        return "Lütfen geçerli bir telefon numarası girin.";
    }
    return false;
  },
  email: async (email, update) => {
    if (update) {
      if (email && !emailRegex.test(email))
        return "Lütfen geçerli bir email adresi girin.";
    } else {
      if (!email || !emailRegex.test(email))
        return "Lütfen geçerli bir email adresi girin.";
    }
    return false;
  },
  dob: async (dob, update) => {
    if (update) {
      if (dob && !dateRegex.test(dob))
        return "Lütfen (YYYY-MM-DD) formatında bir doğum tarihi girin.";
    } else {
      if (!dob || !dateRegex.test(dob))
        return "Lütfen (YYYY-MM-DD) formatında bir doğum tarihi girin.";
    }
    return false;
  },
  gender: async (gender) => {
    if (!gender) return "Lütfen bir cinsiyet girin.";

    return false;
  },
  address: async (address) => {
    if (!address) return "Lütfen bir adres girin.";

    return false;
  },
  nation: async (nation) => {
    if (!nation) return "Lütfen bir uyruk girin.";

    return false;
  },
  currency: async (currency, update) => {
    if (update) {
      if (
        currency &&
        !Object.keys(currenciesData).includes(currency.toUpperCase())
      )
        return "Lütfen geçerli bir para birimi girin.";
    } else {
      if (
        !currency ||
        !Object.keys(currenciesData).includes(currency.toUpperCase())
      )
        return "Lütfen geçerli bir para birimi girin.";
    }
    return false;
  },
};

module.exports = customerValidator;