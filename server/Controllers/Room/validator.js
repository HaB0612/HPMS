const Customer = require("../../models/Customer");
const Feature = require("../../models/Feature");
const Employee = require("../../models/Employee");
const Room = require("../../models/Room");
const mongoose = require("mongoose");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

const roomValidator = {
  room: async (roomID) => {
    if (!roomID || !isValidObjectId(roomID) || !await Room.findById(roomID)) return "Lütfen geçerli bir oda seçin.";
    return false;
  },
  employee: async (employeeID) => {
    if (!employeeID || !isValidObjectId(employeeID) || !(await Employee.findById(employeeID))) return "Lütfen geçerli bir kimlikle giriş yapın.";
    return false;
  },
  roomNumber: async (roomNumber, roomID) => {
    if (roomID) {
      if (roomID && !isValidObjectId(roomID) || !await Room.findById(roomID)) return false;
      const roomFromID = await Room.findById(roomID);
      if (roomFromID.roomNumber == roomNumber) return false;
    }
    if (!roomNumber || !Number.isInteger(roomNumber) || await Room.findOne({ roomNumber })) return "Lütfen kullanılmayan bir oda numarası girin.";
    return false
  },
  roomName: async (name) => {
    if (!name) return "Lütfen bir isim girin.";
    return false;
  },
  price: async (price) => {
    if (!price || !Number.isInteger(price)) return "Lütfen rakam kullanarak fiyat girin.";
    return false;
  },
  description: async (description) => {
    if (!description) return "Lütfen bir açıklama girin.";
    return false;
  },
  adults: async (adults) => {
    if (!adults || !Number.isInteger(adults)) return "Lütfen yetişkin sayısını girin.";
    return false;
  },
  childs: async (childs) => {
    if (!childs || !Number.isInteger(childs)) return "Lütfen çocuk sayısını girin.";
    return false;
  },
  features: async (features) => {
    if (!features || features.length == 0) return false;
    if (!Array.isArray(features)) return "Lütfen geçerli bir oda özelliği seçin.";
    let errorCount = 0;
    for (let featureID of features) {
      if (!isValidObjectId(featureID) || !(await Customer.findById(featureID))) {
        errorCount++;
        continue;
      }
    }
    return errorCount > 0 ? "Lütfen geçerli bir özellik girin." : false;
  },
};

module.exports = roomValidator;
