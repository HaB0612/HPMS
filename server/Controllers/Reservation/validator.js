const Customer = require("../../models/Customer");
const Reservation = require("../../models/Reservation");
const Room = require("../../models/Room");
const Employee = require("../../models/Employee");
const mongoose = require("mongoose");
const dateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
/** @namespace */
const reservationValidator = {
  /** Rezervasyonun varlığını yokluğunu kontrol eder.
   * @function reservation
   * @memberof reservationValidator
   * @param {string} reservationID - Veritabanı rezervasyon ID'si
   */
  reservation: async (reservationID) => {
    if (
      !reservationID ||
      !isValidObjectId(reservationID) ||
      !(await Reservation.findById(reservationID))
    )
      return "Lütfen geçerli bir rezervasyon seçin.";
  },
  /** Odaların müsatliğini kontrol eder.
   * @function room
   * @memberof reservationValidator
   * @param {array} rooms - Veritabanı oda ID'leri
   */
  room: async (rooms) => {
    if (!Array.isArray(rooms)) return "Lütfen geçerli oda seçin.";
    let errorForCreate = 0;
    for (let roomID of rooms) {
      if (
        !roomID ||
        !isValidObjectId(roomID) ||
        !(await Room.findById(roomID))
      ) {
        errorForCreate++;
        continue;
      }
    }
    if (errorForCreate > 0)
      return "Lütfen rezerve olmayan geçerli bir oda seçin.";
    return false;
  },
  /** Çalışanın kimliğini kontrol eder.
   * @function employee
   * @memberof reservationValidator
   * @param {string} employeeID - Veritabanı çalışan ID'si
   */
  employee: async (employeeID) => {
    if (
      !employeeID ||
      !isValidObjectId(employeeID) ||
      !(await Employee.findById(employeeID))
    )
      return "Lütfen geçerli bir kimlikle giriş yapın.";
    return false;
  },
  /** Müşterilerin varlığını kontrol eder.
   * @function customer
   * @memberof reservationValidator
   * @param {array} customerID - Veritabanı müşteri ID'leri
   */
  customer: async (customers) => {
    if (!Array.isArray(customers))
      return "Lütfen rezervasyonu olmayan geçerli bir müşteri seçin.";
    let errorForUpdate = 0;
    for (let customerID of customers) {
      if (
        !customerID ||
        !isValidObjectId(customerID) ||
        !(await Customer.findById(customerID))
      ) {
        errorForUpdate++;
        continue;
      }
    }
    if (errorForUpdate > 0)
      return "Lütfen rezervasyonu olmayan geçerli bir müşteri seçin.";
    return false;
  },
  /** Tarihlerin geçerliliğini kontrol eder.
   * @function checkDates
   * @memberof reservationValidator
   * @param {string} checkinDate - Giriş tarihi YYYY-MM-DD
   * @param {string} checkout - Çıkış tarihi YYYY-MM-DD
   * @param {string} reservationId - Eğer düzenleme ise rezervasyon ID'si || null
   * @param {array} rooms - Eğer oluşturma ise oda ID'leri || null
   */
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
        new Date(checkinDate).getTime() >= new Date(checkoutDate).getTime() ||
        isNaN(new Date(checkinDate).getTime()) ||
        isNaN(new Date(checkoutDate).getTime())
      )
        return "Lütfen tarihleri (YYYY-MM-DD) formatında girin ve giriş tarihinin çıkış tarihinin sonrası olmamasına dikkat edin.";
      let room = [];
      if (!reservationID && rooms && Array.isArray(rooms)) {
        if (!Reservation.find({ rooms: { $in: rooms } })) return false;
        room = rooms;
      } else if (reservationID && !rooms) {
        if (!Reservation.find({ reservation: reservationID })) return false;
        let reservationObject = await Reservation.findOne({
          _id: reservationID,
        }).exec();
        room = reservationObject.rooms;
      } else return "Lütfen bir oda veya rezervasyon id girin.";
      const conflictingReservations = await Reservation.find({
        $or: [
          {
            rooms: { $in: room },
          },
          {
            customers: { $in: customers },
          },
        ],
        $and: [
          {
            $or: [
              {
                checkin: { $gte: checkinDate, $lt: checkoutDate },
              },
              {
                checkin: { $lt: checkinDate },
                checkout: { $gt: checkinDate },
              },
              {
                checkout: { $gt: checkinDate, $lte: checkoutDate },
              },
            ],
          },
        ],
      });
      if (conflictingReservations.length > 0)
        return "Seçilen tarihler başka bir rezervasyon ile çakışıyor.";
      return false;
    } catch (error) {
      console.log(error);
    }
  },
  /** Yetişkin sayısının doğruluğunu kontrol eder.
   * @function adults
   * @memberof reservationValidator
   * @param {number} adults - Konaklayacak yetişkin sayısı
   */
  adults: async (adults) => {
    if (!adults || !Number.isInteger(adults))
      return "Lütfen yetişkin sayısını girin.";
    return false;
  },
  /** Çocuk sayısının doğruluğunu kontrol eder.
   * @function childs
   * @memberof reservationValidator
   * @param {number} childs - Konaklayacak çocuk sayısı
   */
  childs: async (childs) => {
    if (!childs || !Number.isInteger(childs))
      return "Lütfen çocuk sayısını rakam kullanarak girin.";
    return false;
  },
  /** Ücretin doğruluğunu kontrol eder.
   * @function price
   * @memberof reservationValidator
   * @param {number} price - Ücret
   */
  price: async (price) => {
    if (!price || !Number.isInteger(price))
      return "Lütfen ücreti rakam kullanarak USD cinsinden girin.";
    return false;
  },
  /** Ödemenin doğruluğunu kontrol eder.
   * @function isPaid
   * @memberof reservationValidator
   * @param {boolean} isPaid - Ödemenin yapılıp yapılmadığı
   */
  isPaid: async (isPaid) => {
    if (!isPaid || typeof isPaid !== "boolean")
      return "Lütfen ödemeyi evet veya hayır olarak girin.";
    return false;
  },
};

module.exports = reservationValidator;
