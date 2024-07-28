const Customer = require("../../models/Customer");
const Reservation = require("../../models/Reservation");
const Room = require("../../models/Room");
const Employee = require("../../models/Employee");
const mongoose = require("mongoose");
const dateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
const _ = require('lodash');

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

const reservationValidator = {
  reservation: async (reservationID) => {
    if (!reservationID || !isValidObjectId(reservationID) || !(await Reservation.findById(reservationID))) return "Lütfen geçerli bir rezervasyon seçin.";
    return false;
  },
  room: async (rooms) => {
    if (!Array.isArray(rooms)) return "Lütfen geçerli oda seçin.";
    let errorForCreate = 0;
    for (let roomID of rooms) {
      if (!roomID || !isValidObjectId(roomID) || !(await Room.findById(roomID))) {
        errorForCreate++;
        continue;
      }
    }
    if (errorForCreate > 0) return "Lütfen rezerve olmayan geçerli bir oda seçin.";
    return false;
  },
  employee: async (employeeID) => {
    if (!employeeID || !isValidObjectId(employeeID) || !(await Employee.findById(employeeID))) return "Lütfen geçerli bir kimlikle giriş yapın.";
    return false;
  },
  customer: async (customers) => {
    if (!Array.isArray(customers)) return "Lütfen geçerli bir müşteri seçin.";
    let errorForUpdate = 0;
    for (let customerID of customers) {
      if (!customerID || !isValidObjectId(customerID) || !(await Customer.findById(customerID))) {
        errorForUpdate++;
        continue;
      }
    }
    if (errorForUpdate > 0) return "Lütfen geçerli bir müşteri seçin.";
    return false;
  },
  checkDates: async (
    checkinDate,
    checkoutDate,
    reservationID,
    rooms,
    customers
  ) => {
    try {
      if (
        !checkinDate ||
        !checkoutDate ||
        !dateRegex.test(checkinDate) ||
        !dateRegex.test(checkoutDate) ||
        new Date(checkinDate).getTime() >= new Date(checkoutDate).getTime() ||
        isNaN(new Date(checkinDate).getTime()) ||
        isNaN(new Date(checkoutDate).getTime())
      ) return "Lütfen tarihleri (YYYY-MM-DD) formatında girin ve giriş tarihinin çıkış tarihinin sonrası olmamasına dikkat edin.";
      let room = [];
      let reservationFromID;
      if (!reservationID && rooms && Array.isArray(rooms)) {
        if (!Reservation.find({ rooms: { $in: rooms } })) return false;
        room = rooms;
      } else if (reservationID) {
        if (!isValidObjectId(reservationID) || !Reservation.find({ reservation: reservationID })) return "Rezervasyon bulunamadı.";
        let reservationObject = await Reservation.findOne({ _id: reservationID }).exec();
        room = reservationObject.rooms;
        reservationFromID = reservationObject;
      } else return "Lütfen bir oda veya rezervasyon id girin.";
      const conflictingReservations = await Reservation.find({
        $or: [
          { rooms: { $in: room } },
          { customers: { $in: customers } },
        ],
        $and: [
          {
            $or: [
              { checkin: { $gte: checkinDate, $lt: checkoutDate } },
              { checkin: { $lt: checkinDate }, checkout: { $gt: checkinDate } },
              { checkout: { $gt: checkinDate, $lte: checkoutDate } },
            ]
          }
        ]
      });
      const selfExist = conflictingReservations.some(item => _.isEqual(item, reservationFromID))
      if (selfExist) conflictingReservations--
      if (conflictingReservations.length > 0) return "Seçilen tarihler başka bir rezervasyon ile çakışıyor.";
      return false;
    } catch (error) {
      console.log(error);
    }
  },
  adults: async (adults) => {
    if (!adults || !Number.isInteger(adults)) return "Lütfen yetişkin sayısını girin.";
    return false;
  },
  childs: async (childs) => {
    if (!childs || !Number.isInteger(childs)) return "Lütfen çocuk sayısını rakam kullanarak girin.";
    return false;
  },
  price: async (price) => {
    if (!price || !Number.isInteger(price)) return "Lütfen ücreti rakam kullanarak cinsinden girin.";
    return false;
  },
  isPaid: async (isPaid) => {
    if (!isPaid || typeof isPaid !== "boolean") return "Lütfen ödemeyi evet veya hayır olarak girin.";
    return false;
  },
};

module.exports = reservationValidator;
