const mongoose = require("mongoose");
const phoneRegex = /^\+?[1-9]\d{1,14}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

const hotelValidator = {
  name: async (name) => {
    if (!name) return "Lütfen bir isim girin.";
    return false;
  },
  location: async (location) => {
    if (!location) return "Lütfen bir adres girin.";
    return false;
  },
  capacity: async (capacity, update) => {
    if (update) {
      if (capacity && !Number.isInteger(capacity))
        return "Lütfen rakam kullanarak kapasite girin.";
    } else {
      if (!capacity || !Number.isInteger(capacity))
        return "Lütfen rakam kullanarak kapasite girin.";
    }
    return false;
  },
  totalRooms: async (totalRooms, update) => {
    if (update) {
      if (totalRooms && !Number.isInteger(totalRooms))
        return "Lütfen rakam kullanarak oda sayısını girin.";
    } else {
      if (!totalRooms || !Number.isInteger(totalRooms))
        return "Lütfen rakam kullanarak oda sayısını girin.";
    }
    return false;
  },
  contact: async (contact) => {
    if (!contact) return "Lütfen bir iletişim bilgisi girin.";

    return false;
  },
  description: async (description) => {
    if (!description) return "Lütfen bir açıklama girin.";

    return false;
  },
  name: async (name) => {
    if (!name) return "Lütfen bir isim girin.";

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
};

module.exports = hotelValidator;