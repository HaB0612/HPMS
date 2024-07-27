const Customer = require("../../models/Customer");
const Feature = require("../../models/Feature");
const Room = require("../../models/Room");
const mongoose = require("mongoose");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

const validateField = async (value, condition, errorMessage) => {
  if (await condition(value)) {
    return errorMessage;
  }
  return false;
};

const roomValidator = {
  roomNumber: async (roomNumber) => {
    if (!roomNumber || !Number.isInteger(roomNumber) || await Room.findOne({ roomNumber })) {
      return "Lütfen rakam kullanarak daha önce kaydedilmemiş bir oda numarası girin.";
    }
  },
  roomName: async (name) =>
    validateField(name, (n) => !n, "Lütfen bir isim girin."),
  isReserved: async (isReserved) =>
    validateField(
      isReserved,
      (reserved) => !reserved || typeof reserved !== "boolean",
      "Lütfen rezervasyonu evet veya hayır olarak girin."
    ),
  capacity: async (capacity) =>
    validateField(
      capacity,
      (cap) => !cap || !Number.isInteger(cap),
      "Lütfen rakam kullanarak kapasite girin."
    ),
  price: async (price) =>
    validateField(
      price,
      (p) => !p || !Number.isInteger(p),
      "Lütfen rakam kullanarak fiyat girin."
    ),
  description: async (description) =>
    validateField(description, (desc) => !desc, "Lütfen bir açıklama girin."),
  adults: async (adults) =>
    validateField(
      adults,
      (a) => !a || !Number.isInteger(a),
      "Lütfen yetişkin sayısını girin."
    ),
  childs: async (childs) =>
    validateField(
      childs,
      (c) => !c || !Number.isInteger(c),
      "Lütfen çocuk sayısını girin."
    ),
  features: async (features) => {
    let errorCount = 0;
    for (let featureID of features) {
      if (
        !featureID ||
        !isValidObjectId(featureID) ||
        !(await Feature.findById(featureID))
      ) {
        errorCount++;
      }
    }
    return errorCount > 0 ? "Lütfen geçerli bir özellik girin." : false;
  },
};
